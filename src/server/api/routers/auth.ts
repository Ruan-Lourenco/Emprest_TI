import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router, tenantProcedure } from "../trpc";

export const authRouter = router({
  login: publicProcedure.input(z.object({ email: z.email(), password: z.string().min(1) })).mutation(async ({ ctx, input }) => {
    const { data, error } = await ctx.supabase.auth.signInWithPassword(input);
    if (error || !data.user) throw new TRPCError({ code: "UNAUTHORIZED", message: "E-mail ou senha inválidos." });
    const membership = await ctx.prisma.membership.findFirst({ where: { userId: data.user.id, tenant: { slug: "suporte_ti" } } });
    if (!membership) {
      await ctx.supabase.auth.signOut();
      throw new TRPCError({ code: "FORBIDDEN", message: "Usuário sem acesso ao EmpresTI." });
    }
    return { role: membership.role };
  }),
  me: tenantProcedure.input(z.void()).query(({ ctx }) => ({
    id: ctx.user.id, email: ctx.user.email ?? "", role: ctx.membership.role,
    name: ctx.membership.displayName, department: ctx.membership.department
  })),
  logout: publicProcedure.input(z.void()).mutation(async ({ ctx }) => {
    await ctx.supabase.auth.signOut();
    return { ok: true };
  })
});
