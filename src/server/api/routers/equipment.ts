import { z } from "zod";
import { operationsProcedure, router, tenantProcedure } from "../trpc";
import { categories, createEquipment, listEquipment } from "@/server/services/equipment";

const createInput = z.object({
  name: z.string().trim().min(3),
  category: z.enum(categories),
  patrimony: z.string().trim().regex(/^PAT-\d{4}$/i),
  serial: z.string().trim().min(3),
  location: z.string().trim().min(3),
  status: z.enum(["available", "maintenance", "retired"]),
  description: z.string().trim().max(280)
});

export const equipmentRouter = router({
  list: tenantProcedure.input(z.object({ cursor: z.uuid().nullish() })).query(({ ctx, input }) => listEquipment(ctx.prisma, ctx.membership.tenantId, input.cursor)),
  create: operationsProcedure.input(createInput).mutation(({ ctx, input }) => createEquipment(ctx.prisma, ctx.membership.tenantId, ctx.user.id, input))
});
