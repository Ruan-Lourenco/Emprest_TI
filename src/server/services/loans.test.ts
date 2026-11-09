// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { Prisma, type PrismaClient } from "@prisma/client";
import { listLoans, requestLoan } from "./loans";

const now = new Date("2026-11-06T12:00:00.000Z");
const tenantId = "tenant-a";
const userId = "user-a";
const equipmentId = "equipment-a";

function fakeDb(openDueDates: Date[], changed = 1) {
  const loan = { id: "loan-new", dueAt: new Date(now.getTime() + 14 * 86400000) };
  const tx = {
    loan: { findMany: vi.fn().mockResolvedValue(openDueDates.map((dueAt) => ({ dueAt }))), create: vi.fn().mockResolvedValue(loan) },
    equipment: { updateMany: vi.fn().mockResolvedValue({ count: changed }) },
    auditLog: { create: vi.fn().mockResolvedValue({}) }
  };
  const db = { $transaction: vi.fn((callback: (arg: typeof tx) => unknown) => callback(tx)) } as unknown as PrismaClient;
  return { db, tx };
}

describe("solicitar empréstimo", () => {
  it("CA-06: lista pessoal filtra usuário e tenant no servidor", async () => {
    const findMany = vi.fn().mockResolvedValue([]);
    const db = { loan: { findMany } } as unknown as PrismaClient;
    await listLoans(db, tenantId, userId);
    expect(findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { tenantId, userId } }));
  });
  it("CA-03: cria empréstimo por 14 dias e troca somente equipamento disponível do tenant", async () => {
    const { db, tx } = fakeDb([]);
    await requestLoan(db, tenantId, userId, equipmentId, now);
    expect(tx.equipment.updateMany).toHaveBeenCalledWith({ where: { id: equipmentId, tenantId, status: "available" }, data: { status: "loaned" } });
    expect(tx.loan.create).toHaveBeenCalledWith({ data: { tenantId, equipmentId, userId, borrowedAt: now, dueAt: new Date("2026-11-20T12:00:00.000Z") } });
    expect(tx.auditLog.create).toHaveBeenCalledOnce();
  });

  it("CA-04: bloqueia o quarto item sem alterar equipamento", async () => {
    const { db, tx } = fakeDb([now, now, now]);
    await expect(requestLoan(db, tenantId, userId, equipmentId, now)).rejects.toMatchObject({ code: "PRECONDITION_FAILED" });
    expect(tx.equipment.updateMany).not.toHaveBeenCalled();
  });

  it("CA-04: bloqueia pessoa com item atrasado", async () => {
    const { db, tx } = fakeDb([new Date(now.getTime() - 1000)]);
    await expect(requestLoan(db, tenantId, userId, equipmentId, now)).rejects.toMatchObject({ code: "PRECONDITION_FAILED" });
    expect(tx.loan.create).not.toHaveBeenCalled();
  });

  it("CA-04: recusa item indisponível no servidor", async () => {
    const { db, tx } = fakeDb([], 0);
    await expect(requestLoan(db, tenantId, userId, equipmentId, now)).rejects.toMatchObject({ code: "CONFLICT" });
    expect(tx.loan.create).not.toHaveBeenCalled();
  });

  it("CA-05: indisponibilidade da transação retorna conflito ao solicitante", async () => {
    const error = new Prisma.PrismaClientKnownRequestError("Unable to start a transaction in the given time.", {
      code: "P2028", clientVersion: Prisma.prismaVersion.client
    });
    const db = { $transaction: vi.fn().mockRejectedValue(error) } as unknown as PrismaClient;
    await expect(requestLoan(db, tenantId, userId, equipmentId, now)).rejects.toMatchObject({ code: "CONFLICT" });
  });
});
