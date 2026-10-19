import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const userId = process.argv[2];
const role = process.argv[3] ?? "operations";

async function main() {
  if (userId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
    throw new Error("Informe o UUID do usuário criado no Supabase Auth.");
  }
  if (!(["collaborator", "operations"] as string[]).includes(role)) throw new Error("Papel inválido.");
  const tenant = await prisma.tenant.upsert({ where: { slug: "suporte_ti" }, create: { slug: "suporte_ti" }, update: {} });
  if (userId) {
    await prisma.membership.upsert({
      where: { tenantId_userId: { tenantId: tenant.id, userId } },
      create: { tenantId: tenant.id, userId, role },
      update: { role }
    });
  }
  process.stdout.write(userId ? "Tenant e vínculo atualizados.\n" : "Tenant criado ou confirmado.\n");
}

main().catch(() => {
  process.stderr.write("Não foi possível executar o seed. Confira a conexão, migration e usuário Auth.\n");
  process.exitCode = 1;
}).finally(() => prisma.$disconnect());
