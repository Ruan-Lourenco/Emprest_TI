import type { Metadata } from "next";
import { MyLoansView } from "@/features/emprestimos/my-loans-view";

export const metadata: Metadata = { title: "Meus empréstimos" };

export default function MyLoansPage() {
  return <MyLoansView />;
}
