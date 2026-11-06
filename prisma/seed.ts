import { PrismaClient } from "@prisma/client";
import { readFile } from "node:fs/promises";

const prisma = new PrismaClient();
const initialEquipment = process.argv.includes("--initial-equipment");
const positionals = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
const userId = positionals[0];
const role = positionals[1] ?? "operations";

type InitialItem = { patrimonio: string; nome: string; categoria: string; situacao: string };
type ApprovedPhoto = { patrimonio: string; pexelsId: string; photographer: string; sourceUrl: string; license: string; publicUrl: string };

async function seedEquipment(tenantId: string) {
  const items = JSON.parse(await readFile("data/equipamentos-iniciais.json", "utf8")) as InitialItem[];
  const photos = JSON.parse(await readFile("data/fotos-aprovadas.json", "utf8")) as ApprovedPhoto[];
  if (items.length !== 12 || photos.length !== 12 || new Set(items.map((item) => item.patrimonio)).size !== 12 ||
      new Set(photos.map((photo) => photo.pexelsId)).size !== 12) throw new Error("Manifesto de equipamentos/fotos incompleto.");
  const byPatrimony = new Map(photos.map((photo) => [photo.patrimonio, photo]));
  const category = { notebook: "Notebook", monitor: "Monitor", cabo: "Acessório", camera: "Câmera" } as const;
  for (const item of items) {
    const photo = byPatrimony.get(item.patrimonio);
    if (!photo || photo.license !== "Pexels License" || !photo.sourceUrl.startsWith("https://www.pexels.com/photo/"))
      throw new Error(`Foto não aprovada: ${item.patrimonio}`);
    let publicUrl: URL;
    try { publicUrl = new URL(photo.publicUrl); } catch { throw new Error(`URL inválida: ${item.patrimonio}`); }
    if (publicUrl.protocol !== "https:" || !publicUrl.hostname.endsWith(".supabase.co") ||
        publicUrl.pathname !== `/storage/v1/object/public/equipment/${item.patrimonio}.jpg` || publicUrl.search)
      throw new Error(`URL inválida: ${item.patrimonio}`);
    if (item.situacao !== "disponivel" && item.situacao !== "manutencao") throw new Error(`Situação inválida: ${item.patrimonio}`);
    const mappedCategory = category[item.categoria as keyof typeof category];
    if (!mappedCategory) throw new Error(`Categoria inválida: ${item.patrimonio}`);
    const image = { imageUrl: photo.publicUrl, imagePexelsId: photo.pexelsId,
      imagePhotographer: photo.photographer, imageSourceUrl: photo.sourceUrl, imageLicense: photo.license };
    await prisma.equipment.upsert({
      where: { tenantId_patrimony: { tenantId, patrimony: item.patrimonio } },
      create: { tenantId, patrimony: item.patrimonio, name: item.nome, category: mappedCategory,
        status: item.situacao === "manutencao" ? "maintenance" : "available",
        serial: `SEED-${item.patrimonio}`, location: "Acervo de TI", ...image },
      update: { name: item.nome, category: mappedCategory, ...image }
    });
  }
}

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
  if (initialEquipment) await seedEquipment(tenant.id);
  process.stdout.write(initialEquipment ? "Tenant e 12 equipamentos confirmados.\n" : userId ? "Tenant e vínculo atualizados.\n" : "Tenant criado ou confirmado.\n");
}

main().catch(() => {
  process.stderr.write("Não foi possível executar o seed. Confira a conexão, migration e usuário Auth.\n");
  process.exitCode = 1;
}).finally(() => prisma.$disconnect());
