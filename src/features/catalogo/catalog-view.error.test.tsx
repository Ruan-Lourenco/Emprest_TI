import { render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { CatalogView } from "./catalog-view";

vi.mock("@/features/data/app-data-provider", () => ({
  useAppData: () => ({ equipment: [], loading: true, error: "internal database error" })
}));

it("CA-03: reports a failed catalog query instead of showing an empty catalog", () => {
  render(<CatalogView />);
  expect(screen.getByRole("alert")).toHaveTextContent("Não foi possível carregar o catálogo");
  expect(screen.queryByText("Nenhum equipamento encontrado")).not.toBeInTheDocument();
  expect(screen.queryByText("internal database error")).not.toBeInTheDocument();
});
