import type { Equipment, Loan } from "./types";

export const DEMO_TODAY = "2026-09-28";

export const initialEquipment: Equipment[] = [
  {
    id: "eq-1042",
    name: 'MacBook Pro 14"',
    category: "Notebook",
    patrimony: "PAT-1042",
    serial: "C02-DEMO-1042",
    location: "Balcão · 2º andar",
    status: "available",
    description: "Notebook para projetos de design, vídeo e desenvolvimento.",
    lastReturn: "22/set"
  },
  {
    id: "eq-1188",
    name: "ThinkPad T14",
    category: "Notebook",
    patrimony: "PAT-1188",
    serial: "PF-DEMO-1188",
    location: "Balcão · 2º andar",
    status: "loaned",
    description: "Notebook corporativo com perfil de uso geral.",
    lastReturn: "05/set"
  },
  {
    id: "eq-0871",
    name: 'Dell UltraSharp 27"',
    category: "Monitor",
    patrimony: "PAT-0871",
    serial: "CN-DEMO-0871",
    location: "Estoque A",
    status: "available",
    description: "Monitor QHD com conexão USB-C para estações temporárias.",
    lastReturn: "18/set"
  },
  {
    id: "eq-0233",
    name: "Sony A7 III",
    category: "Câmera",
    patrimony: "PAT-0233",
    serial: "S01-DEMO-0233",
    location: "Armário audiovisual",
    status: "maintenance",
    description: "Câmera para registros institucionais e eventos.",
    lastReturn: "11/ago"
  },
  {
    id: "eq-0455",
    name: "Dock USB-C Anker",
    category: "Acessório",
    patrimony: "PAT-0455",
    serial: "AK-DEMO-0455",
    location: "Estoque B",
    status: "available",
    description: "Dock com HDMI, rede, USB-A e alimentação USB-C.",
    lastReturn: "24/set"
  },
  {
    id: "eq-0102",
    name: "Projetor Epson X49",
    category: "Projetor",
    patrimony: "PAT-0102",
    serial: "EP-DEMO-0102",
    location: "Sala de apoio",
    status: "loaned",
    description: "Projetor portátil para apresentações e treinamentos.",
    lastReturn: "02/set"
  },
  {
    id: "eq-0910",
    name: 'LG UltraFine 24"',
    category: "Monitor",
    patrimony: "PAT-0910",
    serial: "LG-DEMO-0910",
    location: "Estoque A",
    status: "loaned",
    description: "Monitor compacto para trabalho híbrido.",
    lastReturn: "26/set"
  },
  {
    id: "eq-0338",
    name: "Adaptador HDMI Belkin",
    category: "Acessório",
    patrimony: "PAT-0338",
    serial: "BK-DEMO-0338",
    location: "Estoque B",
    status: "loaned",
    description: "Adaptador USB-C para HDMI.",
    lastReturn: "20/set"
  }
];

export const initialLoans: Loan[] = [
  { id: "loan-1", equipmentId: "eq-1188", borrower: "Marina Alves", department: "Design", borrowedAt: "2026-09-22", dueAt: "2026-10-06" },
  { id: "loan-2", equipmentId: "eq-0102", borrower: "Marina Alves", department: "Design", borrowedAt: "2026-09-18", dueAt: "2026-10-02" },
  { id: "loan-3", equipmentId: "eq-0910", borrower: "Camila Duarte", department: "Marketing", borrowedAt: "2026-09-05", dueAt: "2026-09-19" },
  { id: "loan-4", equipmentId: "eq-0338", borrower: "Tiago Menezes", department: "Suporte", borrowedAt: "2026-09-08", dueAt: "2026-09-22" },
  { id: "loan-5", equipmentId: "eq-0871", borrower: "Ana Sato", department: "Financeiro", borrowedAt: "2026-09-21", dueAt: "2026-10-05", returnedAt: "2026-09-25" }
];

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" })
    .format(new Date(`${date}T12:00:00`))
    .replace(".", "");
}

export function isOverdue(loan: Loan) {
  return !loan.returnedAt && loan.dueAt < DEMO_TODAY;
}
