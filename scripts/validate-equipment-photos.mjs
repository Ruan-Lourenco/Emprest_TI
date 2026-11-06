import { readFile } from "node:fs/promises";
import sharp from "sharp";

const items = JSON.parse(await readFile("data/equipamentos-iniciais.json", "utf8"));
const photos = JSON.parse(await readFile("data/fotos-aprovadas.json", "utf8"));
const metadataOnly = process.argv.includes("--metadata-only");
if (items.length !== 12 || photos.length !== 12) throw new Error("São necessários exatamente 12 itens e 12 fotos aprovadas.");
const patrimonies = new Set(items.map((item) => item.patrimonio));
const ids = new Set();
for (const photo of photos) {
  if (!patrimonies.delete(photo.patrimonio)) throw new Error(`Patrimônio ausente ou repetido: ${photo.patrimonio}`);
  if (!photo.pexelsId || ids.has(photo.pexelsId)) throw new Error(`ID Pexels ausente ou repetido: ${photo.patrimonio}`);
  ids.add(photo.pexelsId);
  if (!photo.photographer || photo.license !== "Pexels License" ||
      !photo.sourceUrl?.startsWith("https://www.pexels.com/photo/")) throw new Error(`Crédito incompleto: ${photo.patrimonio}`);
  if (!photo.publicUrl || !new URL(photo.publicUrl).pathname.includes("/storage/v1/object/public/equipment/"))
    throw new Error(`URL de Storage público inválida: ${photo.patrimonio}`);
  if (!metadataOnly) {
    const meta = await sharp(`.photo-prep/${photo.patrimonio}.jpg`).metadata();
    if (meta.width !== 800 || meta.height !== 600 || meta.format !== "jpeg") throw new Error(`Imagem inválida: ${photo.patrimonio}`);
  }
}
process.stdout.write(`12 fotos únicas e metadados válidos${metadataOnly ? " (dimensões não verificadas neste ambiente)" : " em arquivos 800×600"}; conferência visual e URLs públicas ainda são humanas.\n`);
