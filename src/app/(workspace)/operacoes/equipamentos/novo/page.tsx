import type { Metadata } from "next";
import { EquipmentForm } from "@/features/operacoes/equipment-form";

export const metadata: Metadata = { title: "Cadastrar equipamento" };

export default function NewEquipmentPage() {
  return <EquipmentForm />;
}
