import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { DemoProvider } from "@/features/demo/demo-provider";
import { EquipmentForm } from "./equipment-form";

describe("EquipmentForm", () => {
  it("mostra mensagens de validação no envio inválido", async () => {
    const user = userEvent.setup();
    render(<DemoProvider><EquipmentForm /></DemoProvider>);
    await user.click(screen.getByRole("button", { name: /cadastrar na demonstração/i }));
    expect(await screen.findByText(/nome com pelo menos 3/i)).toBeInTheDocument();
    expect(screen.getByText(/formato PAT-0000/i)).toBeInTheDocument();
  });

  it("atualiza a prévia enquanto o nome é digitado", async () => {
    const user = userEvent.setup();
    render(<DemoProvider><EquipmentForm /></DemoProvider>);
    await user.type(screen.getByLabelText("Nome"), "Notebook de teste");
    expect(screen.getByRole("heading", { name: "Notebook de teste" })).toBeInTheDocument();
  });
});
