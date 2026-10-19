"use client";

import { CheckCircle, Plus } from "@phosphor-icons/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { LoanList } from "@/components/loan-list";
import { dateInSevenDays, isOverdue, todayInSaoPaulo } from "@/features/data/dates";
import { useAppData } from "@/features/data/app-data-provider";
import type { Loan } from "@/features/data/types";

type Filter = "Todos" | "Em atraso" | "Vencem esta semana" | "Notebooks";

export function OperationsLoansView() {
  const { equipment, loans, returnLoan } = useAppData();
  const [filter, setFilter] = useState<Filter>("Todos");
  const [selected, setSelected] = useState<Loan | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; ok: boolean } | null>(null);
  const openLoans = loans.filter((loan) => !loan.returnedAt);
  const filtered = useMemo(() => openLoans.filter((loan) => {
    const item = equipment.find((entry) => entry.id === loan.equipmentId);
    if (filter === "Em atraso") return isOverdue(loan);
    if (filter === "Vencem esta semana") return loan.dueAt >= todayInSaoPaulo() && loan.dueAt <= dateInSevenDays();
    if (filter === "Notebooks") return item?.category === "Notebook";
    return true;
  }), [equipment, filter, openLoans]);
  const overdue = openLoans.filter(isOverdue).length;
  const maintenance = equipment.filter((item) => item.status === "maintenance").length;

  async function confirmReturn() {
    if (!selected) return;
    const result = await returnLoan(selected.id, true);
    setSelected(null);
    setFeedback(result);
  }

  const filters: Filter[] = ["Todos", "Em atraso", "Vencem esta semana", "Notebooks"];
  return (
    <div className="page">
      <header className="page-heading"><div><p className="eyebrow">Visão do balcão</p><h1>Empréstimos em aberto</h1><p className="subtitle">{openLoans.length} itens fora · atualizado agora</p></div><Link className="button" href="/operacoes/equipamentos/novo"><Plus size={15} /> Cadastrar equipamento</Link></header>
      <div className="stats">
        <div className="card stat"><span>Em aberto</span><strong>{openLoans.length}</strong></div>
        <div className="card stat"><span>Vencem em 7 dias</span><strong>{openLoans.filter((loan) => loan.dueAt >= todayInSaoPaulo() && loan.dueAt <= dateInSevenDays()).length}</strong></div>
        <div className="card stat danger"><span>Em atraso</span><strong>{overdue}</strong></div>
        <div className="card stat"><span>Em manutenção</span><strong>{maintenance}</strong></div>
      </div>
      <div className="toolbar"><div className="chips">{filters.map((item) => <button className={`chip ${filter === item ? "active" : ""}`} type="button" key={item} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</button>)}</div></div>
      {feedback && <div className={`notice ${feedback.ok ? "success-notice" : ""}`} role={feedback.ok ? "status" : "alert"} style={{ marginBottom: 16 }}><CheckCircle size={18} />{feedback.message}</div>}
      <LoanList loans={filtered} equipment={equipment} onReturn={setSelected} operations />
      {selected && <div className="dialog-backdrop" role="presentation"><section className="dialog" role="dialog" aria-modal="true" aria-labelledby="ops-return-title"><h2 id="ops-return-title">Registrar devolução</h2><p className="subtitle">Confirme o recebimento do item no balcão.</p><div className="dialog-consequence">A devolução será registrada permanentemente.</div><div className="dialog-actions"><button className="button secondary" type="button" onClick={() => setSelected(null)}>Cancelar</button><button className="button" type="button" onClick={confirmReturn}>Confirmar</button></div></section></div>}
    </div>
  );
}
