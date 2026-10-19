import { EquipmentDetail } from "@/features/catalogo/equipment-detail";

export default async function EquipmentPage({ params }: { params: Promise<{ patrimonio: string }> }) {
  const { patrimonio } = await params;
  return <EquipmentDetail patrimony={decodeURIComponent(patrimonio)} />;
}
