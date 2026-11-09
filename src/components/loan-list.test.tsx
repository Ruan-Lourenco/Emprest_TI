import { render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { initialEquipment } from "@/test/fixtures";
import { LoanList } from "./loan-list";

it("CA-06: mostra o equipamento e o vencimento na lista pessoal", () => {
  const item = initialEquipment[0];
  render(<LoanList
    equipment={[item]}
    loans={[{
      id: "loan-test", equipmentId: item.id, userId: "user-test",
      borrower: "Teste", department: "", borrowedAt: "2026-11-09",
      dueAt: "2026-11-23"
    }]}
    onReturn={vi.fn()}
  />);

  expect(screen.getByText(item.name)).toBeInTheDocument();
  expect(screen.getByText("Até 23 de nov")).toBeInTheDocument();
});
