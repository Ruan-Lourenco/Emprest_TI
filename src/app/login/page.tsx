"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Package } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  email: z.email("Informe um e-mail válido."),
  password: z.string().min(1, "Informe a senha para continuar.")
});

type LoginData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "marina@empresa.com", password: "demonstracao" }
  });

  function enterDemo() {
    router.push("/catalogo");
  }

  return (
    <main className="login-page">
      <section className="login-hero" aria-labelledby="login-hero-title">
        <div className="brand">
          <span className="brand-mark"><Package size={18} weight="fill" /></span>
          <span>EmpresTI</span>
        </div>
        <div className="login-copy">
          <p className="eyebrow">Equipamentos sob controle</p>
          <h1 id="login-hero-title">Pegue. Use. Devolva.</h1>
          <p>Um fluxo simples para encontrar equipamentos, acompanhar prazos e manter o acervo disponível.</p>
          <div className="login-numbers" aria-label="Regras principais">
            <div><strong>3</strong><span>itens por pessoa</span></div>
            <div><strong>14</strong><span>dias de prazo</span></div>
          </div>
        </div>
        <span className="subtle">Operações · demonstração local</span>
      </section>

      <section className="login-form-wrap" aria-labelledby="login-title">
        <div className="login-panel">
          <p className="eyebrow">Acesso demonstrativo</p>
          <h2 id="login-title">Entrar</h2>
          <p className="subtitle">Use os dados preenchidos para conhecer o fluxo.</p>
          <form onSubmit={handleSubmit(enterDemo)} noValidate>
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby="email-error" {...register("email")} />
              <span className="field-error" id="email-error">{errors.email?.message}</span>
            </div>
            <div className="field">
              <label htmlFor="password">Senha</label>
              <input id="password" type="password" autoComplete="current-password" aria-invalid={!!errors.password} aria-describedby="password-error" {...register("password")} />
              <span className="field-error" id="password-error">{errors.password?.message}</span>
            </div>
            <button className="button" type="submit" disabled={isSubmitting}>Entrar na demonstração <ArrowRight size={16} /></button>
          </form>
          <p className="demo-note">Nenhuma autenticação real acontece. Os campos existem somente para demonstrar a experiência planejada.</p>
        </div>
      </section>
    </main>
  );
}
