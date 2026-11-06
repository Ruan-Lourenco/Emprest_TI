# Evidência — Solicitar empréstimo

Atualizado em 2026-11-06. **Spec NÃO PRONTA**; faltam PostgreSQL local e
fluxo autenticado em produção com conta de teste separada.

| CA | Evidência observada | Estado |
| --- | --- | --- |
| CA-01 | `src/server/api/authz.test.ts:10,15` recusa sem sessão e sem vínculo no procedimento | ATENDIDO localmente |
| CA-02 | `src/features/catalogo/catalog-view.test.tsx:30` cobre foto, nome, categoria, estado e crédito | PARCIAL: foto de fixture, sem dados reais |
| CA-03 | `src/server/api/authz.test.ts:32` prova contexto; `src/server/services/loans.test.ts:29` prova prazo de 14 dias e mudança de estado no service | PARCIAL: atomicidade/persistência não executadas em PostgreSQL |
| CA-04 | `src/server/services/loans.test.ts:37,43,49` cobre limite, atraso e item indisponível; `src/features/catalogo/equipment-detail.test.tsx:34,40,46,53` cobre motivos visíveis para manutenção, emprestado, atraso e limite | PARCIAL: estados e regras não testados no banco real |
| CA-05 | `scripts/test-db.ts` verifica uma criação, rejeição `CONFLICT` e um empréstimo aberto por item | BLOQUEADO: script não executado em PostgreSQL local |
| CA-06 | `src/server/api/authz.test.ts:20` e `src/server/services/loans.test.ts:23` cobrem filtro de usuário e tenant; `scripts/test-db.ts` inclui tentativa entre tenants | PARCIAL: script de banco e recarga não executados |

`npm test`: 6 arquivos, 23 testes passaram. `npm run lint`,
`npm run typecheck`, `npm run build` e `git diff --check` passaram.
`npm run test:db` não foi executado porque
o Docker Desktop não iniciou o daemon; uma outra aplicação ocupa a porta 5432,
e o `DATABASE_URL` da aplicação aponta ao Supabase remoto, que o script recusa.
