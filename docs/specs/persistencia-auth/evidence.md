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

## Incidente de 2026-11-09 — estabilidade do deploy

- O vídeo enviado pelo responsável mostra catálogo carregado, confirmação de
  solicitação, lista pessoal vazia e, em seguida, erro do servidor. Em nova
  tentativa de login, o Prisma retornou `prepared statement "s3" does not
  exist` durante `membership.findFirst()`.
- O ADR-001 exige Supavisor transaction pooler na porta 6543 com
  `pgbouncer=true&connection_limit=1`. O runtime passou a garantir esses
  parâmetros para esse host/porta; a URL direta permanece intacta.
- Catálogo e Meus empréstimos agora mostram erro genérico quando uma consulta
  falha, sem afirmar que existem zero registros nem revelar detalhes do banco.
- Evidência local: `src/server/database-url.test.ts` e os testes de erro das
  duas telas. `npm run typecheck`, `npm run lint`, `npm test -- --maxWorkers=4`
  (31 testes) e `npm run build` passaram. A correção ainda depende de
  publicação e repetição do fluxo
  autenticado na Vercel; não é evidência de sucesso em produção.
