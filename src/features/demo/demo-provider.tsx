"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { initialEquipment, initialLoans } from "./data";
import type { Equipment, Loan, NewEquipment } from "./types";

type DemoContextValue = {
  equipment: Equipment[];
  loans: Loan[];
  currentUserLoans: Loan[];
  requestEquipment: (equipmentId: string) => { ok: boolean; message: string };
  returnLoan: (loanId: string) => void;
  addEquipment: (equipment: NewEquipment) => void;
};

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [equipment, setEquipment] = useState(initialEquipment);
  const [loans, setLoans] = useState(initialLoans);

  const currentUserLoans = useMemo(
    () => loans.filter((loan) => loan.borrower === "Marina Alves" && !loan.returnedAt),
    [loans]
  );

  function requestEquipment(equipmentId: string) {
    const target = equipment.find((item) => item.id === equipmentId);
    if (!target || target.status !== "available") {
      return { ok: false, message: "Este equipamento não está disponível." };
    }
    if (currentUserLoans.length >= 3) {
      return { ok: false, message: "O limite demonstrativo de três itens foi atingido." };
    }
    const hasOverdue = currentUserLoans.some((loan) => loan.dueAt < "2026-09-28");
    if (hasOverdue) {
      return { ok: false, message: "Há um item em atraso nesta demonstração." };
    }
    setEquipment((items) => items.map((item) => item.id === equipmentId ? { ...item, status: "loaned" } : item));
    setLoans((items) => [
      ...items,
      {
        id: `loan-demo-${equipmentId}`,
        equipmentId,
        borrower: "Marina Alves",
        department: "Design",
        borrowedAt: "2026-09-28",
        dueAt: "2026-10-12"
      }
    ]);
    return { ok: true, message: "Solicitação simulada. Os dados serão descartados ao recarregar." };
  }

  function returnLoan(loanId: string) {
    const loan = loans.find((item) => item.id === loanId);
    if (!loan) return;
    setLoans((items) => items.map((item) => item.id === loanId ? { ...item, returnedAt: "2026-09-28" } : item));
    setEquipment((items) => items.map((item) => item.id === loan.equipmentId ? { ...item, status: "available" } : item));
  }

  function addEquipment(newEquipment: NewEquipment) {
    setEquipment((items) => [
      { ...newEquipment, id: `eq-demo-${Date.now()}`, lastReturn: "Nunca" },
      ...items
    ]);
  }

  return (
    <DemoContext.Provider value={{ equipment, loans, currentUserLoans, requestEquipment, returnLoan, addEquipment }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error("useDemo deve ser usado dentro de DemoProvider");
  return context;
}
