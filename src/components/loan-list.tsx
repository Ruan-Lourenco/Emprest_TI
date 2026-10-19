"use client";

import { ArrowUDownLeft } from "@phosphor-icons/react";
import { EquipmentIcon } from "@/components/equipment-ui";
import { formatDate, isOverdue } from "@/features/data/dates";
import type { Equipment, Loan } from "@/features/data/types";

export function LoanList({
  loans,
  equipment,
  onReturn,
  operations = false
}: {
  loans: Loan[];
  equipment: Equipment[];
  onReturn: (loan: Loan) => void;
  operations?: boolean;
}) {
  if (!loans.length) return <div className="empty"><ArrowUDownLeft size={30} /><h2>Nenhum empréstimo aqui</h2><p>As movimentações compatíveis com o filtro aparecerão nesta lista.</p></div>;
  return (
    <div className="card list">
      {loans.map((loan) => {
        const item = equipment.find((entry) => entry.id === loan.equipmentId);
        if (!item) return null;
        const overdue = isOverdue(loan);
        const elapsed = overdue ? 100 : 62;
        return (
          <div className={`loan-row ${overdue ? "overdue" : ""}`} key={loan.id}>
            <div className="loan-item"><span className="item-icon"><EquipmentIcon category={item.category} /></span><p><strong>{item.name}</strong><span>{operations ? `${loan.borrower} · ${loan.department}` : `${item.patrimony} · ${item.location}`}</span></p></div>
            <div><span className="cell-label">{operations ? "Retirada" : "Prazo"}</span><p>{operations ? formatDate(loan.borrowedAt) : `Até ${formatDate(loan.dueAt)}`}</p>{!operations && <div className={`progress ${overdue ? "overdue" : ""}`}><span style={{ width: `${elapsed}%` }} /></div>}</div>
            <div><span className="cell-label">Situação</span><p><span className={`pill ${overdue ? "overdue" : "on-time"}`}>{overdue ? "Em atraso" : "No prazo"}</span></p></div>
            {loan.returnedAt ? <span className="pill on-time">Devolvido</span> : <button className={`button small ${overdue ? "danger" : "secondary"}`} type="button" onClick={() => onReturn(loan)}>Devolver</button>}
          </div>
        );
      })}
    </div>
  );
}
