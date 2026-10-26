import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { initialEquipment } from "@/test/fixtures";
import { CatalogView } from "./catalog-view";

vi.mock("@/features/data/app-data-provider", () => ({ useAppData: () => ({ equipment: initialEquipment }) }));

describe("CatalogView", () => {
  it("filtra por busca e apresenta estado vazio", async () => {
    const user = userEvent.setup();
    render(<CatalogView />);
    const search = screen.getByRole("searchbox", { name: /buscar equipamento/i });
    await user.type(search, "MacBook");
    expect(screen.getByText('MacBook Pro 14"')).toBeInTheDocument();
    expect(screen.queryByText("ThinkPad T14")).not.toBeInTheDocument();
    await user.clear(search);
    await user.type(search, "inexistente");
    expect(screen.getByText("Nenhum equipamento encontrado")).toBeInTheDocument();
  });

  it("filtra somente os disponíveis", async () => {
    const user = userEvent.setup();
    render(<CatalogView />);
    await user.click(screen.getByRole("checkbox", { name: /só disponíveis/i }));
    expect(screen.queryByText("ThinkPad T14")).not.toBeInTheDocument();
    expect(screen.getByText('MacBook Pro 14"')).toBeInTheDocument();
  });
});
