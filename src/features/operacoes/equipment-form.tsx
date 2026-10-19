"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Plus } from "@phosphor-icons/react";
import Link from "next/link";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { EquipmentIcon, StatusPill } from "@/components/equipment-ui";
import { useAppData } from "@/features/data/app-data-provider";

const schema = z.object({
  name: z.string().trim().min(3, "Informe um nome com pelo menos 3 caracteres."),
  category: z.enum(["Notebook", "Monitor", "Câmera", "Acessório", "Projetor"], { error: "Selecione uma categoria." }),
  patrimony: z.string().trim().regex(/^PAT-\d{4}$/i, "Use o formato PAT-0000."),
  serial: z.string().trim().min(3, "Informe o número de série."),
  location: z.string().trim().min(3, "Informe o local de retirada."),
  status: z.enum(["available", "maintenance", "retired"], { error: "Selecione a situação inicial." }),
  description: z.string().trim().max(280, "Use no máximo 280 caracteres.")
});

type FormData = z.infer<typeof schema>;

const defaults: Partial<FormData> = {
  name: "",
  patrimony: "",
  serial: "",
  location: "",
  description: ""
};

export function EquipmentForm() {
  const { addEquipment } = useAppData();
  const [feedback, setFeedback] = useState<{ message: string; ok: boolean } | null>(null);
  const { register, handleSubmit, control, setValue, reset, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: defaults });
  const values = useWatch({ control });

  async function submit(data: FormData) {
    const result = await addEquipment({ ...data, patrimony: data.patrimony.toUpperCase() });
    setFeedback(result);
    if (result.ok) reset(defaults);
  }

  return (
    <div className="page">
      <header className="page-heading"><div><p className="eyebrow">Novo registro</p><h1>Cadastrar equipamento</h1><p className="subtitle">Um registro por unidade física.</p></div><Link className="button secondary" href="/operacoes/emprestimos">Voltar aos empréstimos</Link></header>
      {feedback && <div className={`notice ${feedback.ok ? "success-notice" : ""}`} role={feedback.ok ? "status" : "alert"} style={{ marginBottom: 20 }}><CheckCircle size={18} />{feedback.message}</div>}
      <div className="form-layout">
        <form className="form-grid" onSubmit={handleSubmit(submit)} noValidate>
          <div className="field full"><label htmlFor="name">Nome</label><input id="name" aria-invalid={!!errors.name} {...register("name")} /><span className="field-error">{errors.name?.message}</span></div>
          <div className="field"><label htmlFor="category">Categoria</label><select id="category" {...register("category")}><option value="">Selecione</option><option>Notebook</option><option>Monitor</option><option>Câmera</option><option>Acessório</option><option>Projetor</option></select><span className="field-error">{errors.category?.message}</span></div>
          <div className="field"><label htmlFor="patrimony">Patrimônio</label><input id="patrimony" placeholder="PAT-0000" aria-invalid={!!errors.patrimony} {...register("patrimony")} /><span className="field-error">{errors.patrimony?.message}</span></div>
          <div className="field"><label htmlFor="serial">Número de série</label><input id="serial" aria-invalid={!!errors.serial} {...register("serial")} /><span className="field-error">{errors.serial?.message}</span></div>
          <div className="field"><label htmlFor="location">Local de retirada</label><input id="location" aria-invalid={!!errors.location} {...register("location")} /><span className="field-error">{errors.location?.message}</span></div>
          <div className="field full">
            <label>Situação inicial</label>
            <div className="segmented" role="group" aria-label="Situação inicial">
              {(["available", "maintenance", "retired"] as const).map((status) => <button key={status} className={values.status === status ? "active" : ""} type="button" aria-pressed={values.status === status} onClick={() => setValue("status", status, { shouldValidate: true })}>{status === "available" ? "Disponível" : status === "maintenance" ? "Em manutenção" : "Fora de uso"}</button>)}
            </div>
            <span className="subtle" style={{ fontSize: 11 }}>Itens em manutenção ou fora de uso não ficam disponíveis para solicitação.</span>
          </div>
          <div className="field full"><label htmlFor="description">Observações</label><textarea id="description" placeholder="Informações úteis para quem vai utilizar o item" aria-invalid={!!errors.description} {...register("description")} /><span className="field-error">{errors.description?.message}</span></div>
          <div className="form-actions"><button className="button" type="submit"><Plus size={15} /> Cadastrar equipamento</button><button className="button secondary" type="button" onClick={() => reset(defaults)}>Limpar</button></div>
        </form>
        <aside>
          <div className="card preview-card">
            <p className="eyebrow">Prévia no catálogo</p>
            <div className="card-top"><span className="item-icon">{values.category && <EquipmentIcon category={values.category} />}</span>{values.status ? <StatusPill status={values.status} /> : <span className="pill">Situação pendente</span>}</div>
            <div style={{ marginTop: 18 }}><h2 style={{ marginBottom: 5 }}>{values.name || "Nome do equipamento"}</h2><p className="subtle">{values.category || "Categoria"} · {values.patrimony?.toUpperCase() || "PAT-0000"}</p></div>
            <p className="muted" style={{ marginTop: 22, fontSize: 12, lineHeight: 1.6 }}>{values.description || "A descrição aparecerá aqui enquanto você preenche o formulário."}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
