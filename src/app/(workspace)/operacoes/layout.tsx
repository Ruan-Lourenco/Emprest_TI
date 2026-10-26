import { createContext } from "@/server/api/trpc";
import { redirect } from "next/navigation";

export default async function OperationsLayout({ children }: { children: React.ReactNode }) {
  const { user, membership } = await createContext();
  if (!user) redirect("/login");
  if (membership?.role !== "operations") redirect("/catalogo");
  return children;
}
