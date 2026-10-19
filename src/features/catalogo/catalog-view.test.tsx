import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { DemoProvider } from "@/features/demo/demo-provider";
import { CatalogView } from "./catalog-view";

describe("CatalogView", () => {
  it("filtra por busca e apresenta estado vazio", async () => {
    const user = userEvent.setup();
    render(<DemoProvider><CatalogView /></DemoProvider>);
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
    render(<DemoProvider><CatalogView /></DemoProvider>);
    await user.click(screen.getByRole("checkbox", { name: /só disponíveis/i }));
    expect(screen.queryByText("ThinkPad T14")).not.toBeInTheDocument();
    expect(screen.getByText('MacBook Pro 14"')).toBeInTheDocument();
  });
});
