import type { Metadata } from "next";
import { OperationsLoansView } from "@/features/operacoes/operations-loans-view";

export const metadata: Metadata = { title: "Operações" };

export default function OperationsLoansPage() {
  return <OperationsLoansView />;
}
