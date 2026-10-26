import { router } from "./trpc";
import { authRouter } from "./routers/auth";
import { equipmentRouter } from "./routers/equipment";
import { loansRouter } from "./routers/loans";

export const appRouter = router({ auth: authRouter, equipment: equipmentRouter, loans: loansRouter });
export type AppRouter = typeof appRouter;
