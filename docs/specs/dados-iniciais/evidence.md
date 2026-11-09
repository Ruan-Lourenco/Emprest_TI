# Evidência — Dados iniciais

Atualizado em 2026-11-09. Migration, dois seeds e vínculo constam como
concluídos nos workflows de produção. O responsável informou ter conferido
12 itens sem duplicatas, login e zero empréstimos da conta do professor no
deploy. O verificador-spec independente marcou CA-04 e CA-05 como PARCIAIS
porque essas duas conferências remotas não têm captura anexada. O responsável
aprovou cinco
fotos já publicadas e sete substitutas Pixabay. Após o upload humano das sete,
as 12 URLs do bucket público `EmprestTi` responderam HTTP 200 sem login. Os
arquivos remotos coincidem por SHA-256 com os 12 JPEGs aprovados, todos 800×600.
As 12 URLs foram conferidas novamente por HEAD em 2026-11-09: todas
responderam HTTP 200 sem autenticação. URLs e pareceres estão em
`urls-publicadas-validadas.json`; metadados de origem
e URLs estão em `data/fotos-aprovadas.json`. O comando
`node scripts/validate-equipment-photos.mjs` passou.

| CA | Evidência observada | Estado |
| --- | --- | --- |
| CA-01 | `src/test/initial-equipment.test.ts:6` valida 12 patrimônios, nomes exatos, 3 em manutenção e 9 disponíveis; seed remoto concluído conforme CA-04 | ATENDIDO |
| CA-02 | Preparação pela API Pixabay, 12 IDs únicos, manifesto completo e `node scripts/validate-equipment-photos.mjs` passou com 12 JPEGs 800×600 | ATENDIDO |
| CA-03 | Responsável aprovou as 12 fotos; todas as URLs públicas responderam HTTP 200 sem login e os 12 hashes remotos coincidiram com os arquivos aprovados | ATENDIDO |
| CA-04 | PostgreSQL isolado: seed três vezes manteve 12 itens e isolou outros tenants. [Migration](https://github.com/Ruan-Lourenco/Emprest_TI/actions/runs/42624490914) e [seed 1](https://github.com/Ruan-Lourenco/Emprest_TI/actions/runs/42624620235)/[seed 2](https://github.com/Ruan-Lourenco/Emprest_TI/actions/runs/42625055903) concluídos em produção; responsável informou 12 itens sem duplicatas | PARCIAL: contagem remota e ausência de empréstimos do seed sem captura anexada |
| CA-05 | [Vínculo Auth](https://github.com/Ruan-Lourenco/Emprest_TI/actions/runs/42626220868) concluído; responsável definiu senha por fluxo administrativo e informou login real e zero empréstimos da conta do professor | PARCIAL: login e zero empréstimos sem captura anexada; nenhuma senha no repositório |
| CA-06 | `src/features/catalogo/catalog-view.test.tsx` e `src/features/catalogo/equipment-detail.test.tsx` cobrem foto/crédito Pixabay e ocultação de foto antiga; responsável informou ter conferido catálogo e fotos no deploy | ATENDIDO local e por validação humana em produção |

Após o upload e a inclusão do manifesto aprovado, `npm run typecheck`,
`npm run lint`, `npm test -- --run` (6 arquivos, 26 testes), `npm run build`,
`node scripts/validate-equipment-photos.mjs` e `git diff --check` passaram.
Em 2026-11-09, Docker passou a
funcionar: o PostgreSQL isolado em `localhost:5433` recebeu as três migrations.
O manifesto usado na rodada local anterior de seed foi uma fixture ignorada
pelo Git, com URLs fictícias. Os workflows protegidos de produção foram
executados depois da publicação do manifesto aprovado. Uma role
não proprietária, sujeita às policies RLS, viu zero registros em tenants,
equipamentos e empréstimos. As cinco tabelas de domínio têm RLS habilitado.
O verificador-spec independente anterior confirmou CA-01/02/03 **ATENDIDOS**
após comparar as 12 URLs, os hashes e o manifesto. Essa rodada precede a
execução de produção; uma nova revisão precisa avaliar CA-04/05/06 e os
relatos de validação humana.

Rodada independente posterior à validação informada: CA-01/02/03/06
ATENDIDOS, CA-04/05 PARCIAIS; veredito **NÃO PRONTA** até evidência anexada da
contagem de produção e da conta do professor com zero empréstimos. A execução
de checks amplos nesta rodada foi interrompida por contenção do ambiente;
os resultados anteriores do PR #27 permanecem registrados separadamente.
