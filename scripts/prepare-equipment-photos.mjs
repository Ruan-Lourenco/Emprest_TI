import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

process.loadEnvFile(".env.local");
const key = process.env.PIXABAY_API_KEY;
if (!key) throw new Error("Configure PIXABAY_API_KEY em .env.local.");
const items = JSON.parse(await readFile("data/equipamentos-iniciais.json", "utf8"));
const out = path.resolve(".photo-prep");
await mkdir(out, { recursive: true });
let rejected = [];
try { rejected = JSON.parse(await readFile(path.join(out, "rejected.json"), "utf8")); }
catch (error) { if (error?.code !== "ENOENT") throw error; }
if (!Array.isArray(rejected) || rejected.some((id) => !Number.isInteger(Number(id))))
  throw new Error(".photo-prep/rejected.json deve ser uma lista de IDs numéricos.");
const rejectedIds = new Set(rejected.map(Number));
const used = new Set();
const manifest = [];

for (const item of items) {
  let hits;
  const cacheFile = path.join(out, `${item.patrimonio}.json`);
  try {
    const cached = JSON.parse(await readFile(cacheFile, "utf8"));
    if (Date.now() - cached.fetchedAt < 86_400_000) hits = cached.hits;
  } catch (error) { if (error?.code !== "ENOENT") throw new Error(`Cache inválido: ${item.patrimonio}`); }
  if (!hits) {
    const url = new URL("https://pixabay.com/api/");
    url.searchParams.set("key", key);
    url.searchParams.set("q", item.busca);
    url.searchParams.set("image_type", "photo");
    url.searchParams.set("orientation", "horizontal");
    url.searchParams.set("min_width", "800");
    url.searchParams.set("min_height", "600");
    url.searchParams.set("safesearch", "true");
    url.searchParams.set("per_page", "40");
    let response;
    try { response = await fetch(url); }
    catch { throw new Error(`Busca Pixabay indisponível: ${item.patrimonio}`); }
    if (!response.ok) throw new Error(`Busca Pixabay falhou: ${item.patrimonio}, HTTP ${response.status}`);
    const body = await response.json();
    hits = body.hits;
    if (!Array.isArray(hits)) throw new Error(`Resposta Pixabay inválida: ${item.patrimonio}`);
    await writeFile(cacheFile, JSON.stringify({ fetchedAt: Date.now(), hits }));
  }
  const photo = hits.find((candidate) => Number.isInteger(candidate.id) &&
    !used.has(candidate.id) && !rejectedIds.has(candidate.id) &&
    candidate.largeImageURL?.startsWith("https://pixabay.com/get/") &&
    candidate.pageURL?.startsWith("https://pixabay.com/") && candidate.user);
  if (!photo) throw new Error(`Nenhuma foto única candidata: ${item.patrimonio}`);
  used.add(photo.id);
  let download;
  try { download = await fetch(photo.largeImageURL); }
  catch { throw new Error(`Download Pixabay indisponível: ${item.patrimonio}`); }
  if (!download.ok || !["pixabay.com", "cdn.pixabay.com"].includes(new URL(download.url).hostname))
    throw new Error(`Download Pixabay falhou: ${item.patrimonio}, HTTP ${download.status}`);
  const image = await sharp(Buffer.from(await download.arrayBuffer()))
    .resize(800, 600, { fit: "cover", position: "attention" }).jpeg({ quality: 84 }).toBuffer();
  const meta = await sharp(image).metadata();
  if (meta.width !== 800 || meta.height !== 600) throw new Error(`Dimensão inválida: ${item.patrimonio}`);
  await writeFile(path.join(out, `${item.patrimonio}.jpg`), image);
  manifest.push({ patrimonio: item.patrimonio, provider: "Pixabay", sourceId: String(photo.id),
    creator: photo.user, sourceUrl: photo.pageURL, license: "Pixabay Content License",
    localFile: `${item.patrimonio}.jpg`, review: "PENDENTE — conferir pessoas, marcas, logos, texto e telas" });
  process.stdout.write(`Preparada ${manifest.length}/${items.length}: ${item.patrimonio}\n`);
}
await writeFile(path.join(out, "candidatas.json"), JSON.stringify(manifest, null, 2) + "\n");
process.stdout.write("12 candidatas preparadas em .photo-prep/; revisão visual obrigatória.\n");
