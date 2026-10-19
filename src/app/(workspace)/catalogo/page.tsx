import type { Metadata } from "next";
import { CatalogView } from "@/features/catalogo/catalog-view";

export const metadata: Metadata = { title: "Catálogo" };

export default function CatalogPage() {
  return <CatalogView />;
}
