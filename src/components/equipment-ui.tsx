import {
  ArrowRight,
  Camera,
  Desktop,
  Laptop,
  ProjectorScreen,
  Usb
} from "@phosphor-icons/react";
import Link from "next/link";
import type { Equipment, EquipmentStatus } from "@/features/data/types";

const statusLabels: Record<EquipmentStatus, string> = {
  available: "Disponível",
  loaned: "Emprestado",
  maintenance: "Manutenção",
  retired: "Fora de uso"
};

export function EquipmentIcon({ category, size = 21 }: { category: Equipment["category"]; size?: number }) {
  const props = { size, weight: "regular" as const };
  if (category === "Notebook") return <Laptop {...props} />;
  if (category === "Monitor") return <Desktop {...props} />;
  if (category === "Câmera") return <Camera {...props} />;
  if (category === "Projetor") return <ProjectorScreen {...props} />;
  return <Usb {...props} />;
}

export function StatusPill({ status }: { status: EquipmentStatus }) {
  return <span className={`pill ${status}`}>{statusLabels[status]}</span>;
}

export function EquipmentCard({ item }: { item: Equipment }) {
  const content = (
    <article className={`card equipment-card ${item.status}`}>
      <div className="card-top">
        <span className="item-icon"><EquipmentIcon category={item.category} /></span>
        <StatusPill status={item.status} />
      </div>
      <div>
        <h2>{item.name}</h2>
        <span className="meta">{item.category} · {item.patrimony}</span>
      </div>
      <div className="card-footer">
        <span>{item.status === "available" ? "Solicitar" : item.status === "maintenance" ? "Em assistência" : "Indisponível agora"}</span>
        {item.status === "available" && <ArrowRight size={15} />}
      </div>
    </article>
  );
  return item.status === "available" ? <Link href={`/catalogo/${item.patrimony}`} aria-label={`Ver ${item.name}`}>{content}</Link> : content;
}
