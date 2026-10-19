"use client";

import { ArrowLeft, CheckCircle, Info } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { EquipmentIcon, StatusPill } from "@/components/equipment-ui";
import { useAppData } from "@/features/data/app-data-provider";
import { todayInSaoPaulo } from "@/features/data/dates";

export function EquipmentDetail({ patrimony }: { patrimony: string }) {
  const router = useRouter();
  const { equipment, currentUserLoans, requestEquipment, loading, error } = useAppData();
  const item = equipment.find((entry) => entry.patrimony === patrimony);
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; ok: boolean } | null>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) confirmRef.current?.focus();
  }, [open]);

  if (loading) return <div className="page"><p role="status">Carregando equipamento...</p></div>;
  if (error) return <div className="page"><p role="alert">Não foi possível carregar o equipamento.</p></div>;
  if (!item) return <div className="page"><div className="empty"><h1>Equipamento não encontrado</h1><Link className="button" href="/catalogo"><ArrowLeft /> Voltar ao catálogo</Link></div></div>;
  const selectedItem = item;

  async function confirmRequest() {
    const result = await requestEquipment(selectedItem.id);
    setOpen(false);
    setFeedback(result);
    if (result.ok) window.setTimeout(() => router.push("/meus-emprestimos"), 900);
  }

  const canRequest = selectedItem.status === "available" && currentUserLoans.length < 3 && !currentUserLoans.some((loan) => loan.dueAt < todayInSaoPaulo());
  return (
    <div className="page">
      <Link className="button ghost small" href="/catalogo"><ArrowLeft /> Voltar ao catálogo</Link>
      {feedback && <div className={`notice ${feedback.ok ? "success-notice" : ""}`} role={feedback.ok ? "status" : "alert"} style={{ marginTop: 14 }}><CheckCircle size={18} />{feedback.message}</div>}
      <div className="split" style={{ marginTop: 20 }}>
        <section>
          <div className="hero-image"><EquipmentIcon category={selectedItem.category} size={70} /></div>
          <div className="detail-title"><h1>{selectedItem.name}</h1><StatusPill status={selectedItem.status} /></div>
          <p className="subtitle" style={{ maxWidth: "60ch" }}>{selectedItem.description}</p>
          <dl className="spec-grid">
            <div><dt>Categoria</dt><dd>{selectedItem.category}</dd></div>
            <div><dt>Patrimônio</dt><dd>{selectedItem.patrimony}</dd></div>
            <div><dt>Local</dt><dd>{selectedItem.location}</dd></div>
            <div><dt>Última devolução</dt><dd>{selectedItem.lastReturn}</dd></div>
          </dl>
        </section>
        <aside>
          <section className="card side-card">
            <p className="eyebrow">Disponibilidade</p><h2>Solicitar empréstimo</h2>
            <div className="summary-row"><span>Retirada</span><strong>Hoje</strong></div>
            <div className="summary-row"><span>Prazo padrão</span><strong>14 dias</strong></div>
            <div className="summary-row"><span>Devolver até</span><strong>14 dias após retirada</strong></div>
            <button className="button" type="button" disabled={!canRequest} onClick={() => setOpen(true)}>Solicitar equipamento</button>
            {!canRequest && <p className="muted" style={{ margin: "12px 0 0", fontSize: 11 }}>Item indisponível ou limite atingido.</p>}
          </section>
          <section className="card side-card">
            <p className="eyebrow">Seu limite</p><h2>{currentUserLoans.length} de 3 itens</h2>
            <div className="segments" aria-label={`${currentUserLoans.length} de 3 itens usados`}>{[0,1,2].map((index) => <span key={index} className={`segment ${index < currentUserLoans.length ? "filled" : ""}`} />)}</div>
            <p className="muted" style={{ margin: "13px 0 0", fontSize: 11 }}>{currentUserLoans.some((loan) => loan.dueAt < todayInSaoPaulo()) ? "Há item em atraso." : "Nenhum item em atraso."}</p>
          </section>
        </aside>
      </div>
      {open && (
        <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setOpen(false)}>
          <section className="dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-title" onKeyDown={(event) => event.key === "Escape" && setOpen(false)}>
            <h2 id="confirm-title">Confirmar solicitação</h2>
            <p className="subtitle">Você está solicitando {selectedItem.name}.</p>
            <div className="dialog-consequence"><Info size={16} /> O prazo é de 14 dias. Você ficará com {currentUserLoans.length + 1} de 3 itens.</div>
            <div className="dialog-actions"><button className="button secondary" type="button" onClick={() => setOpen(false)}>Cancelar</button><button ref={confirmRef} className="button" type="button" onClick={confirmRequest}>Confirmar</button></div>
          </section>
        </div>
      )}
    </div>
  );
}
