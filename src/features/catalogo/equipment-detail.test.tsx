import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { initialEquipment } from "@/test/fixtures";
import type { Loan } from "@/features/data/types";
import { EquipmentDetail } from "./equipment-detail";

const state: { currentUserLoans: Loan[] } = { currentUserLoans: [] };
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock("@/features/data/app-data-provider", () => ({ useAppData: () => ({
  equipment: initialEquipment, currentUserLoans: state.currentUserLoans,
  requestEquipment: vi.fn(), loading: false, error: null
}) }));

beforeEach(() => { state.currentUserLoans = []; });

describe("detalhe do equipamento", () => {
  it("CA-06 dados iniciais: mostra foto e crédito no detalhe", () => {
    const item = initialEquipment[0];
    item.imageUrl = "https://example.supabase.co/storage/v1/object/public/equipment/TI-0001.jpg";
    item.imageProvider = "Pixabay";
    item.imageCreator = "Autor teste";
    item.imageSourceUrl = "https://pixabay.com/photos/example-123/";
    try {
      render(<EquipmentDetail patrimony={item.patrimony} />);
      expect(screen.getByRole("img", { name: item.name })).toHaveAttribute("width", "800");
      expect(screen.getByRole("link", { name: "Fotos: Pixabay" })).toHaveAttribute("href", "https://pixabay.com/");
      expect(screen.getByRole("link", { name: "Foto: Autor teste" })).toHaveAttribute("href", item.imageSourceUrl);
    } finally {
      item.imageUrl = null;
      item.imageProvider = null;
      item.imageCreator = null;
      item.imageSourceUrl = null;
    }
  });

  it("preserva crédito de foto Pexels anterior à migration", () => {
    const item = initialEquipment[0];
    item.imageUrl = "https://example.supabase.co/storage/v1/object/public/equipment/TI-0001.jpg";
    item.imageProvider = "Pexels";
    try {
      render(<EquipmentDetail patrimony={item.patrimony} />);
      expect(screen.getByRole("link", { name: "Fotos: Pexels" })).toHaveAttribute("href", "https://www.pexels.com/");
    } finally {
      item.imageUrl = null;
      item.imageProvider = null;
    }
  });

  it("CA-04: item em manutenção explica a indisponibilidade", () => {
    render(<EquipmentDetail patrimony="PAT-0233" />);
    expect(screen.getByRole("button", { name: "Solicitar equipamento" })).toBeDisabled();
    expect(screen.getByText("Este item está em manutenção.")).toBeInTheDocument();
  });

  it("CA-04: item emprestado explica a indisponibilidade", () => {
    render(<EquipmentDetail patrimony="PAT-1188" />);
    expect(screen.getByRole("button", { name: "Solicitar equipamento" })).toBeDisabled();
    expect(screen.getByText("Este item já está emprestado.")).toBeInTheDocument();
  });

  it("CA-04: atraso informa o motivo da recusa", () => {
    state.currentUserLoans = [{ id: "atraso", equipmentId: "outro", borrower: "Teste", department: "", borrowedAt: "2000-01-01", dueAt: "2000-01-02" }];
    render(<EquipmentDetail patrimony="PAT-1042" />);
    expect(screen.getByRole("button", { name: "Solicitar equipamento" })).toBeDisabled();
    expect(screen.getByText("Devolva os itens em atraso antes de solicitar outro.")).toBeInTheDocument();
  });

  it("CA-04: limite de três informa o motivo da recusa", () => {
    state.currentUserLoans = Array.from({ length: 3 }, (_, index) => ({
      id: `loan-${index}`, equipmentId: `other-${index}`, borrower: "Teste", department: "",
      borrowedAt: "2026-11-06", dueAt: "2999-01-01"
    }));
    render(<EquipmentDetail patrimony="PAT-1042" />);
    expect(screen.getByRole("button", { name: "Solicitar equipamento" })).toBeDisabled();
    expect(screen.getByText("Você já está com três itens.")).toBeInTheDocument();
  });
});
