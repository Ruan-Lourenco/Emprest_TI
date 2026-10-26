import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { createSupabaseServerClient } from "@/server/auth";
import { prisma } from "@/server/db";

export async function createContext() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const membership = user ? await prisma.membership.findFirst({
    where: { userId: user.id, tenant: { slug: "suporte_ti" } }
  }) : null;
  return { supabase, prisma, user, membership };
}

const t = initTRPC.context<typeof createContext>().create({ transformer: superjson });
export const router = t.router;
export const publicProcedure = t.procedure;
export const tenantProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
  if (!ctx.membership) throw new TRPCError({ code: "FORBIDDEN", message: "Acesso não vinculado a uma área." });
  return next({ ctx: { ...ctx, user: ctx.user, membership: ctx.membership } });
});
export const operationsProcedure = tenantProcedure.use(({ ctx, next }) => {
  if (ctx.membership.role !== "operations") throw new TRPCError({ code: "FORBIDDEN" });
  return next({ ctx });
});
