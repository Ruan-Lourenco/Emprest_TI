# Evidências — Autenticação e persistência

Estado em 2026-11-05: **parcial**. Este mapa aponta para provas existentes e
lacunas; não substitui a execução dos checks nem aprova a spec.

- **CA-01:** `src/server/api/authz.test.ts` cobre credencial inválida. Falta
  login e logout reais com conta convidada no ambiente remoto.
- **CA-02:** `src/server/api/authz.test.ts` cobre ausência de vínculo no login;
  `tests/e2e/main-flow.spec.ts` cobre redirecionamento sem sessão. Falta
  conferir todos os procedimentos com contexto real.
- **CA-03:** `scripts/test-db.ts` cria e lista equipamento em banco local.
  Falta prova de recarga e nova sessão no ambiente final.
- **CA-04:** `scripts/test-db.ts` cobre solicitação, devolução e concorrência em
  banco local. Falta a jornada completa após recarga.
- **CA-05:** as regras constam em `src/server/services/loans.ts`; ainda faltam
  testes específicos para limite de três, atraso e manutenção.
- **CA-06:** `src/server/services/loans.ts` filtra por usuário e tenant; a
  prova completa de procedimento e papel continua pendente.
- **CA-07:** `scripts/test-db.ts` cobre isolamento em services no banco local.
  Falta teste por procedimento tRPC e tentativa de mutação entre tenants.
- **CA-08:** `src/server/api/authz.test.ts` cobre cadastro negado ao
  colaborador. Falta teste de devolução de empréstimo de terceiro.
- **CA-09:** `tasks.md` registra checks locais de 2026-10-19. Devem ser
  executados novamente antes de declarar a spec pronta; login real e
  persistência remota seguem pendentes.

O script `test:db` recusa host não local. A validação RLS histórica está
registrada em `tasks.md`; não foi reproduzida nesta entrega.
