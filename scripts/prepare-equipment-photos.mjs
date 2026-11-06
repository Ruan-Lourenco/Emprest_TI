import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const keyFile = process.argv[2];
if (!keyFile || !path.isAbsolute(keyFile) || path.resolve(keyFile).startsWith(process.cwd() + path.sep))
  throw new Error("Informe o caminho absoluto de um arquivo de chave fora do repositório.");
const key = (await readFile(keyFile, "utf8")).trim();
if (!key) throw new Error("Arquivo de chave Pexels vazio.");
const items = JSON.parse(await readFile("data/equipamentos-iniciais.json", "utf8"));
const out = path.resolve(".photo-prep");
await mkdir(out, { recursive: true });
const used = new Set();
let rejected = [];
try {
  rejected = JSON.parse(await readFile(path.join(out, "rejected.json"), "utf8"));
} catch (error) {
  if (error?.code !== "ENOENT") throw error;
}
if (!Array.isArray(rejected) || rejected.some((id) => !Number.isInteger(Number(id))))
  throw new Error(".photo-prep/rejected.json deve ser uma lista de IDs Pexels.");
const rejectedIds = new Set(rejected.map(Number));
const manifest = [];

for (const item of items) {
  const url = new URL("https://api.pexels.com/v1/search");
  url.searchParams.set("query", item.busca);
  url.searchParams.set("per_page", "40");
  const response = await fetch(url, { headers: { Authorization: key } });
  if (!response.ok) throw new Error(`Busca Pexels falhou para ${item.patrimonio}: HTTP ${response.status}`);
  const body = await response.json();
  const photo = body.photos?.find((candidate) =>
    Number.isInteger(candidate.id) && !used.has(candidate.id) && !rejectedIds.has(candidate.id) &&
    candidate.src?.original?.startsWith("https://images.pexels.com/") &&
    candidate.url?.startsWith("https://www.pexels.com/photo/") && candidate.photographer
  );
  if (!photo) throw new Error(`Nenhuma foto única candidata para ${item.patrimonio}`);
  used.add(photo.id);
  const download = await fetch(photo.src.original);
  if (!download.ok || !download.url.startsWith("https://images.pexels.com/"))
    throw new Error(`Download Pexels falhou para ${item.patrimonio}: HTTP ${download.status}`);
  const bytes = Buffer.from(await download.arrayBuffer());
  const image = await sharp(bytes).resize(800, 600, { fit: "cover", position: "attention" }).jpeg({ quality: 84 }).toBuffer();
  const metadata = await sharp(image).metadata();
  if (metadata.width !== 800 || metadata.height !== 600) throw new Error(`Dimensão inválida: ${item.patrimonio}`);
  await writeFile(path.join(out, `${item.patrimonio}.jpg`), image);
  manifest.push({ patrimonio: item.patrimonio, pexelsId: String(photo.id), photographer: photo.photographer,
    sourceUrl: photo.url, license: "Pexels License", localFile: `${item.patrimonio}.jpg`,
    review: "PENDENTE — conferir pessoas, marcas, logos, texto e telas" });
}
await writeFile(path.join(out, "candidatas.json"), JSON.stringify(manifest, null, 2) + "\n");
process.stdout.write("12 candidatas preparadas em .photo-prep/; revisão visual obrigatória.\n");
