"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BellSimple,
  HandArrowDown,
  Info,
  ListChecks,
  Package,
  PlusSquare,
  SquaresFour
} from "@phosphor-icons/react";
import { useDemo } from "@/features/demo/demo-provider";

const nav = [
  { group: "Colaborador", href: "/catalogo", label: "Catálogo", icon: SquaresFour },
  { group: "Colaborador", href: "/meus-emprestimos", label: "Meus empréstimos", icon: HandArrowDown },
  { group: "Operações", href: "/operacoes/emprestimos", label: "Empréstimos em aberto", icon: ListChecks },
  { group: "Operações", href: "/operacoes/equipamentos/novo", label: "Cadastrar equipamento", icon: PlusSquare }
];

function Sidebar() {
  const pathname = usePathname();
  const { currentUserLoans } = useDemo();

  return (
    <aside className="sidebar" aria-label="Navegação principal">
      <Link className="brand" href="/catalogo" aria-label="EmpresTI — Catálogo">
        <span className="brand-mark"><Package size={17} weight="fill" /></span>
        <span>EmpresTI</span>
      </Link>
      <nav className="nav-group">
        {["Colaborador", "Operações"].map((group) => (
          <span key={group} style={{ display: "contents" }}>
            <span className="nav-label">{group}</span>
            {nav.filter((item) => item.group === group).map((item) => {
              const active = pathname === item.href || (item.href === "/catalogo" && pathname.startsWith("/catalogo/"));
              const Icon = item.icon;
              return (
              <Link key={item.href} className={`nav-link ${active ? "active" : ""}`} href={item.href} aria-current={active ? "page" : undefined}>
                <Icon size={17} weight={active ? "fill" : "regular"} />
                <span>{item.label}</span>
                {item.href === "/meus-emprestimos" && <span className="nav-count">{currentUserLoans.length}</span>}
              </Link>
              );
            })}
          </span>
        ))}
      </nav>
      <div className="profile">
        <span className="avatar">MA</span>
        <span><strong>Marina Alves</strong><span>Design · demonstração</span></span>
      </div>
    </aside>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentUserLoans } = useDemo();
  const title = pathname.startsWith("/operacoes") ? "Operações" : pathname.startsWith("/meus") ? "Meus empréstimos" : "Catálogo";

  return (
    <div className="app-frame">
      <Sidebar />
      <div className="main-shell">
        <div className="demo-bar" role="status">
          <Info size={14} /> Modo demonstrativo — alterações não são salvas e nenhum dado real é acessado.
        </div>
        <header className="topbar">
          <div className="topbar-title"><strong>{title}</strong></div>
          <div className="loan-counter">{currentUserLoans.length} de 3 itens com você &nbsp; <BellSimple size={17} aria-hidden="true" /></div>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
