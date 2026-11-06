// @vitest-environment node
import { describe, expect, it } from "vitest";
import items from "../../data/equipamentos-iniciais.json";

describe("lista inicial de equipamentos", () => {
  it("CA-01: contém os 12 patrimônios únicos e os três itens em manutenção da lista canônica", () => {
    expect(items).toHaveLength(12);
    expect(new Set(items.map((item) => item.patrimonio)).size).toBe(12);
    expect(items.map((item) => item.patrimonio)).toEqual(Array.from({ length: 12 }, (_, index) => `TI-${String(index + 1).padStart(4, "0")}`));
    expect(items.map((item) => item.nome)).toEqual([
      "Notebook 14 polegadas", "Notebook 15 polegadas", "Notebook 13 polegadas", "Notebook 15 polegadas",
      "Monitor 24 polegadas", "Monitor 27 polegadas", "Monitor 22 polegadas", "Cabo HDMI 2 m",
      "Cabo USB-C 1 m", "Cabo de rede 3 m", "Webcam Full HD", "Câmera compacta"
    ]);
    expect(items.filter((item) => item.situacao === "manutencao").map((item) => item.patrimonio))
      .toEqual(["TI-0004", "TI-0007", "TI-0010"]);
    expect(items.filter((item) => item.situacao === "disponivel")).toHaveLength(9);
  });
});
