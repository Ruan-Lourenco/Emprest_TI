"use client";

import { Info, MagnifyingGlass, Package } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { EquipmentCard } from "@/components/equipment-ui";
import { useAppData } from "@/features/data/app-data-provider";

const categories = ["Todos", "Notebook", "Monitor", "Câmera", "Acessório", "Projetor"] as const;

export function CatalogView() {
  const { equipment } = useAppData();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("Todos");
  const [availableOnly, setAvailableOnly] = useState(false);
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("pt-BR");
    return equipment.filter((item) => {
      const matchesQuery = !normalized || `${item.name} ${item.patrimony}`.toLocaleLowerCase("pt-BR").includes(normalized);
      const matchesCategory = category === "Todos" || item.category === category;
      return matchesQuery && matchesCategory && (!availableOnly || item.status === "available");
    });
  }, [availableOnly, category, equipment, query]);
  const available = equipment.filter((item) => item.status === "available").length;

  return (
    <div className="page">
      <header className="page-heading">
        <div><p className="eyebrow">Acervo interno</p><h1>Catálogo</h1><p className="subtitle">{equipment.length} equipamentos · {available} disponíveis agora</p></div>
        <div className="search-wrap">
          <MagnifyingGlass size={17} aria-hidden="true" />
          <label className="sr-only" htmlFor="catalog-search">Buscar equipamento</label>
          <input id="catalog-search" className="search-input" type="search" placeholder="Buscar por nome ou patrimônio" value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>
      </header>
      <div className="notice">
        <Info size={18} />
        <div><strong>Antes de solicitar</strong>Você pode ficar com até 3 itens por 14 dias. Um atraso bloqueia novas solicitações e itens em manutenção não ficam disponíveis.</div>
      </div>
      <div className="toolbar">
        <div className="chips" aria-label="Filtrar por categoria">
          {categories.map((item) => <button key={item} type="button" className={`chip ${category === item ? "active" : ""}`} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}
        </div>
        <label className="toggle"><input type="checkbox" checked={availableOnly} onChange={(event) => setAvailableOnly(event.target.checked)} /> Só disponíveis</label>
      </div>
      {filtered.length ? <div className="equipment-grid">{filtered.map((item) => <EquipmentCard key={item.id} item={item} />)}</div> : (
        <div className="empty"><Package size={30} /><h2>Nenhum equipamento encontrado</h2><p>Ajuste a busca ou remova algum filtro.</p></div>
      )}
    </div>
  );
}
