"use client";

import { CheckCircle, Plus } from "@phosphor-icons/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { LoanList } from "@/components/loan-list";
import { DEMO_TODAY, isOverdue } from "@/features/demo/data";
import { useDemo } from "@/features/demo/demo-provider";
import type { Loan } from "@/features/demo/types";

type Filter = "Todos" | "Em atraso" | "Vencem esta semana" | "Notebooks";

export function OperationsLoansView() {
  const { equipment, loans, returnLoan } = useDemo();
  const [filter, setFilter] = useState<Filter>("Todos");
  const [selected, setSelected] = useState<Loan | null>(null);
  const [feedback, setFeedback] = useState("");
  const openLoans = loans.filter((loan) => !loan.returnedAt);
  const filtered = useMemo(() => openLoans.filter((loan) => {
    const item = equipment.find((entry) => entry.id === loan.equipmentId);
    if (filter === "Em atraso") return isOverdue(loan);
    if (filter === "Vencem esta semana") return loan.dueAt >= DEMO_TODAY && loan.dueAt <= "2026-10-05";
    if (filter === "Notebooks") return item?.category === "Notebook";
    return true;
  }), [equipment, filter, openLoans]);
  const overdue = openLoans.filter(isOverdue).length;
  const maintenance = equipment.filter((item) => item.status === "maintenance").length;

  function confirmReturn() {
    if (!selected) return;
    returnLoan(selected.id);
    setSelected(null);
    setFeedback("Devolução simulada e lista atualizada.");
  }

  const filters: Filter[] = ["Todos", "Em atraso", "Vencem esta semana", "Notebooks"];
  return (
    <div className="page">
      <header className="page-heading"><div><p className="eyebrow">Visão do balcão</p><h1>Empréstimos em aberto</h1><p className="subtitle">{openLoans.length} itens fora · atualizado agora</p></div><Link className="button" href="/operacoes/equipamentos/novo"><Plus size={15} /> Cadastrar equipamento</Link></header>
      <div className="stats">
        <div className="card stat"><span>Em aberto</span><strong>{openLoans.length}</strong></div>
        <div className="card stat"><span>Vencem em 7 dias</span><strong>{openLoans.filter((loan) => loan.dueAt >= DEMO_TODAY && loan.dueAt <= "2026-10-05").length}</strong></div>
        <div className="card stat danger"><span>Em atraso</span><strong>{overdue}</strong></div>
        <div className="card stat"><span>Em manutenção</span><strong>{maintenance}</strong></div>
      </div>
      <div className="toolbar"><div className="chips">{filters.map((item) => <button className={`chip ${filter === item ? "active" : ""}`} type="button" key={item} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</button>)}</div></div>
      {feedback && <div className="notice success-notice" role="status" style={{ marginBottom: 16 }}><CheckCircle size={18} />{feedback}</div>}
      <LoanList loans={filtered} equipment={equipment} onReturn={setSelected} operations />
      {selected && <div className="dialog-backdrop" role="presentation"><section className="dialog" role="dialog" aria-modal="true" aria-labelledby="ops-return-title"><h2 id="ops-return-title">Registrar devolução demonstrativa</h2><p className="subtitle">Confirme o recebimento do item no balcão.</p><div className="dialog-consequence">Nenhum registro real será criado.</div><div className="dialog-actions"><button className="button secondary" type="button" onClick={() => setSelected(null)}>Cancelar</button><button className="button" type="button" onClick={confirmReturn}>Confirmar</button></div></section></div>}
    </div>
  );
}
