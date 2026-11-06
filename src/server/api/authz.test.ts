// @vitest-environment node
import { randomUUID } from "node:crypto";
import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./root";
import type { createContext } from "./trpc";

type Context = Awaited<ReturnType<typeof createContext>>;

describe("autenticação e autorização", () => {
  it("CA-01 solicitar empréstimo: recusa sem sessão", async () => {
    const caller = appRouter.createCaller({ user: null, membership: null } as unknown as Context);
    await expect(caller.loans.request({ equipmentId: randomUUID() })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("CA-01 solicitar empréstimo: recusa sessão sem vínculo", async () => {
    const caller = appRouter.createCaller({ user: { id: randomUUID() }, membership: null } as unknown as Context);
    await expect(caller.loans.request({ equipmentId: randomUUID() })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("CA-01/CA-06: lista pessoal usa usuário e tenant do contexto", async () => {
    const userId = randomUUID();
    const tenantId = randomUUID();
    const findMany = vi.fn().mockResolvedValue([]);
    const ctx = { user: { id: userId }, membership: { userId, tenantId, role: "collaborator" },
      prisma: { loan: { findMany } } } as unknown as Context;
    const caller = appRouter.createCaller(ctx);
    await caller.loans.mine({});
    expect(findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { tenantId, userId } }));
    await expect(caller.loans.all({})).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("CA-01/CA-03: solicitação usa identidade e tenant do contexto", async () => {
    const userId = randomUUID();
    const tenantId = randomUUID();
    const equipmentId = randomUUID();
    const findMany = vi.fn().mockResolvedValue([]);
    const updateMany = vi.fn().mockResolvedValue({ count: 1 });
    const createLoan = vi.fn().mockResolvedValue({ id: randomUUID() });
    const tx = { loan: { findMany, create: createLoan }, equipment: { updateMany },
      auditLog: { create: vi.fn().mockResolvedValue({}) } };
    const ctx = { user: { id: userId }, membership: { userId, tenantId, role: "collaborator" },
      prisma: { $transaction: (callback: (arg: typeof tx) => unknown) => callback(tx) } } as unknown as Context;
    await appRouter.createCaller(ctx).loans.request({ equipmentId });
    expect(findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { tenantId, userId, returnedAt: null } }));
    expect(updateMany).toHaveBeenCalledWith(expect.objectContaining({ where: { tenantId, id: equipmentId, status: "available" } }));
    expect(createLoan).toHaveBeenCalledWith({ data: expect.objectContaining({ tenantId, userId, equipmentId }) });
  });
  it("CA-01 (parcial): recusa credenciais inválidas", async () => {
    const ctx = {
      user: null, membership: null,
      supabase: { auth: { signInWithPassword: vi.fn().mockResolvedValue({ data: { user: null }, error: new Error("invalid") }) } }
    } as unknown as Context;
    const caller = appRouter.createCaller(ctx);
    await expect(caller.auth.login({ email: "teste@example.com", password: "invalida" }))
      .rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("CA-02 (parcial): recusa usuário Auth sem vínculo de tenant", async () => {
    const signOut = vi.fn().mockResolvedValue({});
    const ctx = {
      user: null, membership: null,
      supabase: { auth: { signInWithPassword: vi.fn().mockResolvedValue({ data: { user: { id: randomUUID() } }, error: null }), signOut } },
      prisma: { membership: { findFirst: vi.fn().mockResolvedValue(null) } }
    } as unknown as Context;
    const caller = appRouter.createCaller(ctx);
    await expect(caller.auth.login({ email: "teste@example.com", password: "qualquer" }))
      .rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(signOut).toHaveBeenCalledOnce();
  });

  it("CA-08 (parcial): impede colaborador de cadastrar equipamento", async () => {
    const ctx = {
      user: { id: randomUUID() }, membership: { tenantId: randomUUID(), role: "collaborator" }
    } as unknown as Context;
    const caller = appRouter.createCaller(ctx);
    await expect(caller.equipment.create({
      name: "Notebook teste", category: "Notebook", patrimony: "PAT-9999", serial: "TEST-01",
      location: "Balcão", status: "available", description: ""
    })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
