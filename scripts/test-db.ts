import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { createEquipment, listEquipment } from "../src/server/services/equipment";
import { listLoans, requestLoan, returnLoan } from "../src/server/services/loans";

const url = process.env.DATABASE_URL;
if (!url || !["localhost", "127.0.0.1"].includes(new URL(url).hostname)) {
  throw new Error("DATABASE_URL deve apontar para PostgreSQL local neste teste.");
}
const db = new PrismaClient({ datasources: { db: { url } } });

async function main() {
  const tenantA = await db.tenant.create({ data: { slug: `test-a-${randomUUID()}` } });
  const tenantB = await db.tenant.create({ data: { slug: `test-b-${randomUUID()}` } });
  const userA = randomUUID();
  const userB = randomUUID();
  await db.$executeRaw`INSERT INTO auth.users (id) VALUES (${userA}::uuid), (${userB}::uuid)`;
  await db.membership.createMany({ data: [
    { tenantId: tenantA.id, userId: userA, role: "collaborator" },
    { tenantId: tenantB.id, userId: userB, role: "collaborator" }
  ] });
  const item = await createEquipment(db, tenantA.id, userA, {
    name: "Notebook teste", category: "Notebook", patrimony: "PAT-9999", serial: "TEST-001",
    location: "Balcão teste", status: "available", description: ""
  });
  assert.equal((await listEquipment(db, tenantA.id)).items.length, 1);
  assert.equal((await listEquipment(db, tenantB.id)).items.length, 0);
  await requestLoan(db, tenantA.id, userA, item.id);
  assert.equal((await listLoans(db, tenantA.id, userA)).items.length, 1);
  assert.equal((await listLoans(db, tenantB.id, userB)).items.length, 0);
  await assert.rejects(requestLoan(db, tenantA.id, userA, item.id));
  const [loan] = (await listLoans(db, tenantA.id, userA)).items;
  await assert.rejects(returnLoan(db, tenantB.id, userB, loan.id, false));
  await returnLoan(db, tenantA.id, userA, loan.id, false);
  assert.equal((await db.equipment.findUniqueOrThrow({ where: { id: item.id } })).status, "available");
  const userC = randomUUID();
  await db.$executeRaw`INSERT INTO auth.users (id) VALUES (${userC}::uuid)`;
  await db.membership.create({ data: { tenantId: tenantA.id, userId: userC, role: "collaborator" } });
  const contested = await createEquipment(db, tenantA.id, userA, {
    name: "Monitor teste", category: "Monitor", patrimony: "PAT-9998", serial: "TEST-002",
    location: "Balcão teste", status: "available", description: ""
  });
  const concurrent = await Promise.allSettled([
    requestLoan(db, tenantA.id, userA, contested.id),
    requestLoan(db, tenantA.id, userC, contested.id)
  ]);
  assert.equal(concurrent.filter((result) => result.status === "fulfilled").length, 1);
  assert.equal((await db.loan.count({ where: { tenantId: tenantA.id, equipmentId: contested.id, returnedAt: null } })), 1);
  await db.equipment.createMany({ data: Array.from({ length: 100 }, (_, index) => ({
    tenantId: tenantA.id, name: `Teste ${index}`, category: "Acessório", patrimony: `PAT-${String(2000 + index)}`,
    serial: `SER-${index}`, location: "Balcão teste", status: "available", description: ""
  })) });
  const firstPage = await listEquipment(db, tenantA.id);
  const secondPage = await listEquipment(db, tenantA.id, firstPage.nextCursor);
  assert.equal(firstPage.items.length, 100);
  assert.equal(secondPage.items.length, 2);
  assert.equal(new Set([...firstPage.items, ...secondPage.items].map((entry) => entry.id)).size, 102);
  process.stdout.write("Persistência, isolamento, conflito, concorrência, paginação e devolução: OK\n");
}

main().catch((error) => {
  process.stderr.write(`Teste de banco falhou: ${error instanceof Error ? error.name : "erro"}\n`);
  process.exitCode = 1;
}).finally(() => db.$disconnect());
