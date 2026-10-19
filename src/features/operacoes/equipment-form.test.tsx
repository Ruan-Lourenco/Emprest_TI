import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { EquipmentForm } from "./equipment-form";

vi.mock("@/features/data/app-data-provider", () => ({ useAppData: () => ({ addEquipment: vi.fn().mockResolvedValue({ ok: true, message: "Equipamento cadastrado." }) }) }));

describe("EquipmentForm", () => {
  it("mostra mensagens de validação no envio inválido", async () => {
    const user = userEvent.setup();
    render(<EquipmentForm />);
    await user.click(screen.getByRole("button", { name: /cadastrar equipamento/i }));
    expect(await screen.findByText(/nome com pelo menos 3/i)).toBeInTheDocument();
    expect(screen.getByText(/formato PAT-0000/i)).toBeInTheDocument();
  });

  it("atualiza a prévia enquanto o nome é digitado", async () => {
    const user = userEvent.setup();
    render(<EquipmentForm />);
    await user.type(screen.getByLabelText("Nome"), "Notebook de teste");
    expect(screen.getByRole("heading", { name: "Notebook de teste" })).toBeInTheDocument();
  });
});
