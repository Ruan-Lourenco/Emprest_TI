import { render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { MyLoansView } from "./my-loans-view";

vi.mock("@/features/data/app-data-provider", () => ({
  useAppData: () => ({ equipment: [], currentUserLoans: [], loans: [], user: null, loading: true, error: "internal database error" })
}));

it("CA-04: reports a failed loans query instead of showing zero loans", () => {
  render(<MyLoansView />);
  expect(screen.getByRole("alert")).toHaveTextContent("Não foi possível carregar seus empréstimos");
  expect(screen.queryByText("Nenhum empréstimo aqui")).not.toBeInTheDocument();
  expect(screen.queryByText("internal database error")).not.toBeInTheDocument();
});
