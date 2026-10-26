import { z } from "zod";
import { operationsProcedure, router, tenantProcedure } from "../trpc";
import { listLoans, requestLoan, returnLoan } from "@/server/services/loans";

export const loansRouter = router({
  mine: tenantProcedure.input(z.object({ cursor: z.uuid().nullish() })).query(({ ctx, input }) => listLoans(ctx.prisma, ctx.membership.tenantId, ctx.user.id, input.cursor)),
  all: operationsProcedure.input(z.object({ cursor: z.uuid().nullish() })).query(({ ctx, input }) => listLoans(ctx.prisma, ctx.membership.tenantId, undefined, input.cursor)),
  request: tenantProcedure.input(z.object({ equipmentId: z.uuid() })).mutation(({ ctx, input }) =>
    requestLoan(ctx.prisma, ctx.membership.tenantId, ctx.user.id, input.equipmentId)),
  returnMine: tenantProcedure.input(z.object({ loanId: z.uuid() })).mutation(({ ctx, input }) =>
    returnLoan(ctx.prisma, ctx.membership.tenantId, ctx.user.id, input.loanId, false)),
  returnOperations: operationsProcedure.input(z.object({ loanId: z.uuid() })).mutation(({ ctx, input }) =>
    returnLoan(ctx.prisma, ctx.membership.tenantId, ctx.user.id, input.loanId, true))
});
