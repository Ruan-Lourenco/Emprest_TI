# Evidência — Solicitar empréstimo

Atualizado em 2026-11-09. PostgreSQL local verificado; o responsável informou
ter validado o fluxo autenticado de produção com conta de teste separada,
inclusive persistência após recarga e limite de empréstimos. Todos os seis
critérios foram aceitos na revisão independente final.

| CA | Evidência observada | Estado |
| --- | --- | --- |
| CA-01 | `src/server/api/authz.test.ts:10,15` recusa sem sessão e sem vínculo no procedimento | ATENDIDO localmente |
| CA-02 | `src/features/catalogo/catalog-view.test.tsx` cobre foto, nome, categoria, estado, crédito Pixabay e ocultação de foto antiga; responsável conferiu fotos reais no deploy | ATENDIDO local e por validação humana em produção |
| CA-03 | `src/server/api/authz.test.ts:32` prova contexto; `scripts/test-db.ts` confirmou prazo de 14 dias, criação e estado na mesma transação PostgreSQL; responsável informou solicitação e mudança de estado em produção | ATENDIDO local e por validação humana em produção |
| CA-04 | Testes de service/UI e `scripts/test-db.ts` cobrem limite, atraso e manutenção; `src/features/catalogo/equipment-detail.test.tsx` passou a cobrir item fora de uso com botão bloqueado e motivo visível. O service só atualiza equipamento com `status: available`; responsável informou recusa visível e limite em produção | ATENDIDO local e por validação humana em produção; teste PostgreSQL específico para item fora de uso não foi executado |
| CA-05 | `npm run test:db` no PostgreSQL isolado verificou uma criação e conflito na segunda solicitação, com um empréstimo aberto; `P2028` mapeado para conflito | ATENDIDO no PostgreSQL local; concorrência não foi repetida no deploy |
| CA-06 | `src/server/api/authz.test.ts` e `src/server/services/loans.test.ts` cobrem filtro; `npm run test:db` confirmou lista pessoal e isolamento entre tenants; `src/components/loan-list.test.tsx` confirmou exibição do equipamento e vencimento; responsável informou recarga e login separados no deploy | ATENDIDO local e por validação humana em produção |

`npm run test:db` passou em 2026-11-09 no PostgreSQL Docker isolado em
`localhost:5433`, após aplicação das três migrations. Uma role não proprietária
sujeita a RLS viu zero registros de tenants, equipamentos e empréstimos.
`npm test` passou com 26 testes; `npm run typecheck`, `npm run lint` e
`npm run build` passaram após a correção de concorrência. O banco remoto não
foi usado como ambiente de teste.

O [PR #27](https://github.com/Ruan-Lourenco/Emprest_TI/pull/27) corrigiu a
instabilidade do pooler que interrompia a consulta depois da primeira
solicitação. Na branch do PR, `npm run typecheck`, `npm run lint`,
`npm test -- --maxWorkers=4` (31 testes) e `npm run build` passaram. O
responsável informou que o novo deploy funciona. Não há vídeo ou captura da
repetição bem-sucedida; o relato é a fonte da evidência remota.

Após o primeiro parecer independente, foram adicionados dois testes sem
alterar código de produção: indisponibilidade de item fora de uso no detalhe
e vencimento na lista pessoal. `npx vitest run
src/features/catalogo/equipment-detail.test.tsx
src/components/loan-list.test.tsx --maxWorkers=2` passou (2 arquivos,
8 testes). A execução demorou 285,71 s no workspace do OneDrive, com 98% do
tempo gasto em importação de módulos. O lint desses dois arquivos passou.
Uma primeira execução de `npm run typecheck` foi interrompida após cinco
minutos no workspace sincronizado. A checagem foi repetida no commit
`e25d36b`, em worktree temporária fora do OneDrive, e terminou com código zero.
Rodada independente final de 2026-11-09: CA-01 a CA-06 **ATENDIDOS** e spec
**PRONTA**, considerando também os checks aprovados do PR #28.

| Procedimento alterado | Papel | Contexto | Tentativa entre tenants | Evidência | Resultado |
| --- | --- | --- | --- | --- | --- |
| `loans.request` | `collaborator` ou `operations` com vínculo ativo | `tenantProcedure` fornece sessão e vínculo `suporte_ti`; entrada contém só `equipmentId` | `appRouter.createCaller` com vínculo de outro tenant recebeu `CONFLICT`; item e empréstimos do tenant de destino não mudaram | `src/server/api/authz.test.ts`, `scripts/test-db.ts` | Passou no PostgreSQL local; RLS de papel não proprietário testada separadamente |
