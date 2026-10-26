"use client";

import { ArrowRight, CheckCircle } from "@phosphor-icons/react";
import Link from "next/link";
import { useState } from "react";
import { LoanList } from "@/components/loan-list";
import { useAppData } from "@/features/data/app-data-provider";
import { isOverdue } from "@/features/data/dates";
import type { Loan } from "@/features/data/types";

export function MyLoansView() {
  const { equipment, currentUserLoans, loans, returnLoan, user } = useAppData();
  const [selected, setSelected] = useState<Loan | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; ok: boolean } | null>(null);
  const history = loans.filter((loan) => loan.userId === user?.id && loan.returnedAt);

  async function confirmReturn() {
    if (!selected) return;
    const result = await returnLoan(selected.id);
    setSelected(null);
    setFeedback(result);
  }

  return (
    <div className="page">
      <header className="page-heading">
        <div><p className="eyebrow">Sua responsabilidade</p><h1>Comigo agora</h1><p className="subtitle">{currentUserLoans.length} de 3 itens · {currentUserLoans.filter(isOverdue).length} em atraso</p></div>
        <Link className="button" href="/catalogo">Pegar emprestado <ArrowRight size={15} /></Link>
      </header>
      <div className="segments" style={{ width: 180, marginBottom: 20 }} aria-label={`${currentUserLoans.length} de 3 itens usados`}>{[0,1,2].map((index) => <span key={index} className={`segment ${index < currentUserLoans.length ? "filled" : ""}`} />)}</div>
      {feedback && <div className={`notice ${feedback.ok ? "success-notice" : ""}`} role={feedback.ok ? "status" : "alert"} style={{ marginBottom: 16 }}><CheckCircle size={18} />{feedback.message}</div>}
      <LoanList loans={currentUserLoans} equipment={equipment} onReturn={setSelected} />
      <section style={{ marginTop: 32 }}>
        <h2>Histórico</h2>
        {history.length ? <LoanList loans={history} equipment={equipment} onReturn={() => undefined} /> : <p className="muted">Nenhuma devolução registrada.</p>}
      </section>
      {selected && (
        <div className="dialog-backdrop" role="presentation">
          <section className="dialog" role="dialog" aria-modal="true" aria-labelledby="return-title">
            <h2 id="return-title">Confirmar devolução</h2><p className="subtitle">O item ficará disponível novamente no catálogo.</p>
            <div className="dialog-consequence">A devolução será registrada permanentemente.</div>
            <div className="dialog-actions"><button className="button secondary" type="button" onClick={() => setSelected(null)}>Cancelar</button><button className="button" type="button" onClick={confirmReturn}>Confirmar devolução</button></div>
          </section>
        </div>
      )}
    </div>
  );
}
