import { Prisma, type PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const categories = ["Notebook", "Monitor", "Câmera", "Acessório", "Projetor"] as const;
export const equipmentStatuses = ["available", "loaned", "maintenance", "retired"] as const;

export async function listEquipment(db: PrismaClient, tenantId: string, cursor?: string | null) {
  const limit = 100;
  const items = await db.equipment.findMany({
    where: { tenantId }, orderBy: { id: "asc" }, take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {})
  });
  const hasMore = items.length > limit;
  if (hasMore) items.pop();
  const nextCursor = hasMore ? items.at(-1)!.id : undefined;
  return { items, nextCursor };
}

export async function createEquipment(db: PrismaClient, tenantId: string, actorId: string, input: {
  name: string; category: string; patrimony: string; serial: string;
  location: string; status: string; description: string;
}) {
  try {
    return await db.$transaction(async (tx) => {
      const item = await tx.equipment.create({ data: { ...input, tenantId, patrimony: input.patrimony.toUpperCase() } });
      await tx.auditLog.create({ data: { tenantId, actorUserId: actorId, action: "equipment.created", resourceType: "equipment", resourceId: item.id } });
      return item;
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new TRPCError({ code: "CONFLICT", message: "Patrimônio já cadastrado nesta área." });
    }
    throw error;
  }
}
