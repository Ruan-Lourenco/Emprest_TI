import type { Loan } from "@/features/data/types";

export function todayInSaoPaulo() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });
}

export function dateInSevenDays() {
  return new Date(Date.now() + 7 * 86400000).toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", timeZone: "UTC" })
    .format(new Date(`${date}T12:00:00Z`)).replace(".", "");
}

export function isOverdue(loan: Loan) {
  return !loan.returnedAt && loan.dueAt < todayInSaoPaulo();
}
