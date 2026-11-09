# Evidência — Solicitar empréstimo

Atualizado em 2026-11-09. **Spec NÃO PRONTA**; o PostgreSQL local foi verificado,
mas falta fluxo autenticado em produção com conta de teste separada.

| CA | Evidência observada | Estado |
| --- | --- | --- |
| CA-01 | `src/server/api/authz.test.ts:10,15` recusa sem sessão e sem vínculo no procedimento | ATENDIDO localmente |
| CA-02 | `src/features/catalogo/catalog-view.test.tsx:30` cobre foto, nome, categoria, estado e crédito | PARCIAL: foto de fixture, sem dados reais |
| CA-03 | `src/server/api/authz.test.ts:32` prova contexto; `scripts/test-db.ts` confirmou prazo exato de 14 dias, criação e estado persistidos na mesma transação PostgreSQL | ATENDIDO localmente; fluxo de produção pendente |
| CA-04 | `src/server/services/loans.test.ts` e `src/features/catalogo/equipment-detail.test.tsx` cobrem motivos; `scripts/test-db.ts` confirmou limite de três, atraso e manutenção no PostgreSQL, sem alterar os itens recusados | ATENDIDO localmente; fluxo de produção pendente |
| CA-05 | `npm run test:db` no PostgreSQL isolado verificou exatamente uma criação, outro solicitante com `CONFLICT` e um empréstimo aberto; `P2028` de espera por transação passou a mapear para conflito | ATENDIDO localmente; produção pendente |
| CA-06 | `src/server/api/authz.test.ts` e `src/server/services/loans.test.ts` cobrem filtro; `npm run test:db` confirmou lista pessoal e isolamento entre tenants | PARCIAL: recarga e fluxo autenticado em produção pendentes |

`npm run test:db` passou em 2026-11-09 no PostgreSQL Docker isolado em
`localhost:5433`, após aplicação das três migrations. Uma role não proprietária
sujeita a RLS viu zero registros de tenants, equipamentos e empréstimos.
`npm test` passou com 25 testes; `npm run typecheck`, `npm run lint` e
`npm run build` passaram após a correção de concorrência. O banco remoto não
foi usado como ambiente de teste.

| Procedimento alterado | Papel | Contexto | Tentativa entre tenants | Evidência | Resultado |
| --- | --- | --- | --- | --- | --- |
| `loans.request` | `collaborator` ou `operations` com vínculo ativo | `tenantProcedure` fornece sessão e vínculo `suporte_ti`; entrada contém só `equipmentId` | `appRouter.createCaller` com vínculo de outro tenant recebeu `CONFLICT`; item e empréstimos do tenant de destino não mudaram | `src/server/api/authz.test.ts`, `scripts/test-db.ts` | Passou no PostgreSQL local; RLS de papel não proprietário testada separadamente |
