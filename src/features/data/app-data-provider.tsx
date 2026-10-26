"use client";

import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import { trpc } from "@/lib/trpc";
import type { Equipment, Loan, NewEquipment } from "@/features/data/types";

type Result = { ok: boolean; message: string };
type AppData = {
  equipment: Equipment[];
  loans: Loan[];
  currentUserLoans: Loan[];
  user: { id: string; email: string; role: string; name: string | null; department: string | null } | null;
  loading: boolean;
  error: string | null;
  requestEquipment: (id: string) => Promise<Result>;
  returnLoan: (id: string, operations?: boolean) => Promise<Result>;
  addEquipment: (data: NewEquipment) => Promise<Result>;
};

const Context = createContext<AppData | null>(null);
const dateOnly = (date: Date) => date.toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });

export function AppDataProvider({ children }: { children: ReactNode }) {
  const utils = trpc.useUtils();
  const me = trpc.auth.me.useQuery(undefined, { retry: false });
  const items = trpc.equipment.list.useInfiniteQuery({}, { enabled: !!me.data, getNextPageParam: (page) => page.nextCursor });
  const mine = trpc.loans.mine.useInfiniteQuery({}, { enabled: !!me.data, getNextPageParam: (page) => page.nextCursor });
  const all = trpc.loans.all.useInfiniteQuery({}, { enabled: me.data?.role === "operations", getNextPageParam: (page) => page.nextCursor });
  const request = trpc.loans.request.useMutation();
  const returnMine = trpc.loans.returnMine.useMutation();
  const returnOperations = trpc.loans.returnOperations.useMutation();
  const create = trpc.equipment.create.useMutation();

  const { hasNextPage: itemsMore, isFetchingNextPage: itemsFetching, isError: itemsError, fetchNextPage: fetchItems } = items;
  const { hasNextPage: mineMore, isFetchingNextPage: mineFetching, isError: mineError, fetchNextPage: fetchMine } = mine;
  const { hasNextPage: allMore, isFetchingNextPage: allFetching, isError: allError, fetchNextPage: fetchAll } = all;
  useEffect(() => { if (itemsMore && !itemsFetching && !itemsError) void fetchItems(); }, [itemsMore, itemsFetching, itemsError, fetchItems]);
  useEffect(() => { if (mineMore && !mineFetching && !mineError) void fetchMine(); }, [mineMore, mineFetching, mineError, fetchMine]);
  useEffect(() => { if (allMore && !allFetching && !allError) void fetchAll(); }, [allMore, allFetching, allError, fetchAll]);

  const equipment = useMemo<Equipment[]>(() => (items.data?.pages.flatMap((page) => page.items) ?? []).map((item) => ({
    id: item.id, name: item.name, category: item.category as Equipment["category"],
    patrimony: item.patrimony, serial: item.serial, location: item.location,
    status: item.status as Equipment["status"], description: item.description,
    lastReturn: item.lastReturnAt ? dateOnly(item.lastReturnAt) : "Nunca"
  })).sort((a, b) => a.name.localeCompare(b.name, "pt-BR")), [items.data]);
  const ownRows = mine.data?.pages.flatMap((page) => page.items) ?? [];
  const allRows = all.data?.pages.flatMap((page) => page.items) ?? [];
  const convert = (rows: typeof ownRows): Loan[] => rows.map((loan) => ({
    id: loan.id, equipmentId: loan.equipmentId, borrower: loan.borrower.displayName ?? loan.userId.slice(0, 8),
    department: loan.borrower.department ?? "", borrowedAt: dateOnly(loan.borrowedAt),
    dueAt: dateOnly(loan.dueAt), returnedAt: loan.returnedAt ? dateOnly(loan.returnedAt) : undefined,
    userId: loan.userId
  }));
  const ownLoans = convert(ownRows);
  const loans = (me.data?.role === "operations" ? convert(allRows) : ownLoans).sort((a, b) => b.borrowedAt.localeCompare(a.borrowedAt));
  const currentUserLoans = ownLoans.filter((loan) => !loan.returnedAt);

  async function refresh() {
    await Promise.all([utils.equipment.list.invalidate(), utils.loans.mine.invalidate(), utils.loans.all.invalidate()]);
  }
  async function requestEquipment(id: string): Promise<Result> {
    try { await request.mutateAsync({ equipmentId: id }); await refresh(); return { ok: true, message: "Empréstimo registrado." }; }
    catch (error) { return { ok: false, message: error instanceof Error ? error.message : "Não foi possível solicitar o item." }; }
  }
  async function returnLoan(id: string, operations = false): Promise<Result> {
    try {
      if (operations) await returnOperations.mutateAsync({ loanId: id });
      else await returnMine.mutateAsync({ loanId: id });
      await refresh(); return { ok: true, message: "Devolução registrada." };
    } catch (error) { return { ok: false, message: error instanceof Error ? error.message : "Não foi possível registrar a devolução." }; }
  }
  async function addEquipment(data: NewEquipment): Promise<Result> {
    try { await create.mutateAsync(data); await refresh(); return { ok: true, message: "Equipamento cadastrado." }; }
    catch (error) { return { ok: false, message: error instanceof Error ? error.message : "Não foi possível cadastrar o equipamento." }; }
  }

  return <Context.Provider value={{
    equipment, loans, currentUserLoans, user: me.data ?? null,
    loading: me.isPending || (!!me.data && (items.isPending || items.hasNextPage || mine.isPending || mine.hasNextPage || (me.data.role === "operations" && (all.isPending || all.hasNextPage)))),
    error: me.error?.message ?? items.error?.message ?? mine.error?.message ?? all.error?.message ?? null,
    requestEquipment, returnLoan, addEquipment
  }}>{children}</Context.Provider>;
}

export function useAppData() {
  const context = useContext(Context);
  if (!context) throw new Error("useAppData deve ser usado dentro de AppDataProvider");
  return context;
}
