# Evidências — Autenticação e persistência

Estado atualizado em 2026-11-09: **parcial**. A migration e o seed de produção
foram executados por workflows protegidos, e o responsável informou ter
validado login, catálogo, solicitação e recarga no deploy. Esta spec abrange
outros critérios além da prática; o relato não substitui a verificação de
todos eles.

- **CA-01:** `src/server/api/authz.test.ts` cobre credencial inválida; o
  responsável informou login real. Logout remoto ainda não tem evidência
  registrada.
- **CA-02:** `src/server/api/authz.test.ts` cobre ausência de vínculo no login;
  `tests/e2e/main-flow.spec.ts` cobre redirecionamento sem sessão. Falta
  conferir todos os procedimentos com contexto real.
- **CA-03:** `scripts/test-db.ts` cria e lista equipamento em banco local; o
  responsável informou catálogo persistente após recarga no ambiente final.
- **CA-04:** `scripts/test-db.ts` cobre solicitação, devolução e concorrência em
  banco local. O responsável informou solicitação e recarga em produção;
  devolução remota ainda não tem evidência registrada.
- **CA-05:** `src/server/services/loans.test.ts` e `scripts/test-db.ts` cobrem
  limite de três, atraso e manutenção; o responsável informou recusa pelo
  limite no deploy.
- **CA-06:** `src/server/services/loans.ts` filtra por usuário e tenant; a
  prova completa de procedimento e papel continua pendente.
- **CA-07:** `scripts/test-db.ts` cobre isolamento em services no banco local.
  Falta teste por procedimento tRPC e tentativa de mutação entre tenants.
- **CA-08:** `src/server/api/authz.test.ts` cobre cadastro negado ao
  colaborador. Falta teste de devolução de empréstimo de terceiro.
- **CA-09:** no PR #27, `npm run typecheck`, `npm run lint`,
  `npm test -- --maxWorkers=4` (31 testes) e `npm run build` passaram.
  E2E autenticado e todos os critérios da spec ampla ainda não foram
  reavaliados pelo verificador.

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
  publicação. O [PR #27](https://github.com/Ruan-Lourenco/Emprest_TI/pull/27)
  entrou em `main`; o responsável informou que o fluxo autenticado voltou a
  funcionar na Vercel. O relato não contém captura de todas as etapas.
