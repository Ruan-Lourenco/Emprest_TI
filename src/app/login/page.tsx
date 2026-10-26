"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Package } from "@phosphor-icons/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { trpc } from "@/lib/trpc";

const loginSchema = z.object({ email: z.email("Informe um e-mail válido."), password: z.string().min(1, "Informe a senha.") });
type LoginData = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const login = trpc.auth.login.useMutation();
  const utils = trpc.useUtils();
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginData>({ resolver: zodResolver(loginSchema) });

  async function submit(data: LoginData) {
    setError("");
    try { await login.mutateAsync(data); await utils.auth.me.invalidate(); router.replace("/catalogo"); router.refresh(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Não foi possível entrar."); }
  }

  return <main className="login-page">
    <section className="login-hero" aria-labelledby="login-hero-title">
      <div className="brand"><span className="brand-mark"><Package size={18} weight="fill" /></span><span>EmpresTI</span></div>
      <div className="login-copy"><p className="eyebrow">Equipamentos sob controle</p><h1 id="login-hero-title">Pegue. Use. Devolva.</h1><p>Encontre equipamentos, acompanhe prazos e mantenha o acervo disponível.</p><div className="login-numbers" aria-label="Regras principais"><div><strong>3</strong><span>itens por pessoa</span></div><div><strong>14</strong><span>dias de prazo</span></div></div></div>
      <span className="subtle">Acesso interno</span>
    </section>
    <section className="login-form-wrap" aria-labelledby="login-title"><div className="login-panel">
      <p className="eyebrow">Acesso ao EmpresTI</p><h2 id="login-title">Entrar</h2><p className="subtitle">Use sua conta convidada pela equipe de Operações.</p>
      {search.get("acesso") === "pendente" && <p role="alert">Sua conta ainda não tem acesso a uma área. Fale com Operações.</p>}
      {error && <p className="field-error" role="alert">{error}</p>}
      <form onSubmit={handleSubmit(submit)} noValidate>
        <div className="field"><label htmlFor="email">E-mail</label><input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...register("email")} /><span className="field-error">{errors.email?.message}</span></div>
        <div className="field"><label htmlFor="password">Senha</label><input id="password" type="password" autoComplete="current-password" aria-invalid={!!errors.password} {...register("password")} /><span className="field-error">{errors.password?.message}</span></div>
        <button className="button" type="submit" disabled={isSubmitting}>Entrar <ArrowRight size={16} /></button>
      </form>
    </div></section>
  </main>;
}

export default function LoginPage() { return <Suspense><LoginForm /></Suspense>; }
