import { Prisma, type PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export async function listLoans(db: PrismaClient, tenantId: string, userId?: string, cursor?: string | null) {
  const limit = 100;
  const items = await db.loan.findMany({
    where: { tenantId, ...(userId ? { userId } : {}) },
    include: { borrower: { select: { displayName: true, department: true } } },
    orderBy: { id: "asc" }, take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {})
  });
  const hasMore = items.length > limit;
  if (hasMore) items.pop();
  const nextCursor = hasMore ? items.at(-1)!.id : undefined;
  return { items, nextCursor };
}

export async function requestLoan(db: PrismaClient, tenantId: string, userId: string, equipmentId: string, now = new Date()) {
  try {
    return await db.$transaction(async (tx) => {
      const open = await tx.loan.findMany({ where: { tenantId, userId, returnedAt: null }, select: { dueAt: true } });
      if (open.length >= 3) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Você já está com três itens." });
      if (open.some((loan) => loan.dueAt < now)) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Devolva os itens em atraso antes de solicitar outro." });
      const changed = await tx.equipment.updateMany({ where: { id: equipmentId, tenantId, status: "available" }, data: { status: "loaned" } });
      if (changed.count !== 1) throw new TRPCError({ code: "CONFLICT", message: "Este equipamento não está disponível." });
      const loan = await tx.loan.create({ data: {
        tenantId, equipmentId, userId, borrowedAt: now, dueAt: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000)
      } });
      await tx.auditLog.create({ data: { tenantId, actorUserId: userId, action: "loan.created", resourceType: "loan", resourceId: loan.id } });
      return loan;
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && ["P2002", "P2034"].includes(error.code)) {
      throw new TRPCError({ code: "CONFLICT", message: "A disponibilidade mudou. Atualize a página e tente novamente." });
    }
    throw error;
  }
}

export async function returnLoan(db: PrismaClient, tenantId: string, actorId: string, loanId: string, canReturnOthers: boolean, now = new Date()) {
  try {
    return await db.$transaction(async (tx) => {
      const loan = await tx.loan.findFirst({ where: { id: loanId, tenantId, returnedAt: null, ...(!canReturnOthers ? { userId: actorId } : {}) } });
      if (!loan) throw new TRPCError({ code: "NOT_FOUND", message: "Empréstimo em aberto não encontrado." });
      const changed = await tx.loan.updateMany({ where: { id: loanId, tenantId, returnedAt: null }, data: { returnedAt: now } });
      if (changed.count !== 1) throw new TRPCError({ code: "CONFLICT", message: "A devolução já foi registrada." });
      await tx.equipment.update({ where: { id_tenantId: { id: loan.equipmentId, tenantId } }, data: { status: "available", lastReturnAt: now } });
      await tx.auditLog.create({ data: { tenantId, actorUserId: actorId, action: "loan.returned", resourceType: "loan", resourceId: loan.id } });
      return { ok: true };
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034") {
      throw new TRPCError({ code: "CONFLICT", message: "A devolução já foi registrada ou está em andamento." });
    }
    throw error;
  }
}
