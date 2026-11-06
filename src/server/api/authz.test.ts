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
