import { PrismaClient } from "@prisma/client";
import { runtimeDatabaseUrl } from "@/server/database-url";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: { db: { url: runtimeDatabaseUrl(process.env.DATABASE_URL) } }
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
