export type EquipmentStatus = "available" | "loaned" | "maintenance" | "retired";

export type Equipment = {
  id: string;
  name: string;
  category: "Notebook" | "Monitor" | "Câmera" | "Acessório" | "Projetor";
  patrimony: string;
  serial: string;
  location: string;
  status: EquipmentStatus;
  description: string;
  lastReturn: string;
};

export type Loan = {
  id: string;
  equipmentId: string;
  borrower: string;
  department: string;
  borrowedAt: string;
  dueAt: string;
  returnedAt?: string;
};

export type NewEquipment = Omit<Equipment, "id" | "lastReturn">;
