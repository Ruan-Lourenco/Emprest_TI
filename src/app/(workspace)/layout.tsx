import { AppShell } from "@/components/app-shell";
import { createContext } from "@/server/api/trpc";
import { redirect } from "next/navigation";

export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const { user, membership } = await createContext();
  if (!user) redirect("/login");
  if (!membership) redirect("/login?acesso=pendente");
  return <AppShell>{children}</AppShell>;
}
