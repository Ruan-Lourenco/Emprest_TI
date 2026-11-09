# Evidência — Dados iniciais

Atualizado em 2026-11-09. **Spec NÃO PRONTA** porque o seed, o convite e o login
reais ainda não foram comprovados em produção. O responsável aprovou cinco
fotos já publicadas e sete substitutas Pixabay. Após o upload humano das sete,
as 12 URLs do bucket público `EmprestTi` responderam HTTP 200 sem login. Os
arquivos remotos coincidem por SHA-256 com os 12 JPEGs aprovados, todos 800×600.
URLs e pareceres estão em `urls-publicadas-validadas.json`; metadados de origem
e URLs estão em `data/fotos-aprovadas.json`. O comando
`node scripts/validate-equipment-photos.mjs` passou.

| CA | Evidência observada | Estado |
| --- | --- | --- |
| CA-01 | `src/test/initial-equipment.test.ts:6` valida 12 patrimônios, nomes exatos, 3 em manutenção e 9 disponíveis | ATENDIDO no manifesto; seed em banco pendente no CA-04 |
| CA-02 | Preparação pela API Pixabay, 12 IDs únicos, manifesto completo e `node scripts/validate-equipment-photos.mjs` passou com 12 JPEGs 800×600 | ATENDIDO |
| CA-03 | Responsável aprovou as 12 fotos; todas as URLs públicas responderam HTTP 200 sem login e os 12 hashes remotos coincidiram com os arquivos aprovados | ATENDIDO |
| CA-04 | Três migrations aplicadas no PostgreSQL isolado em `localhost:5433`; seed executado três vezes com manifesto de teste temporário: 12 itens no `suporte_ti` (3 manutenção, 9 disponíveis), zero empréstimos; equipamentos de outros tenants permaneceram 108 antes/depois | ATENDIDO localmente; aplicação em produção pendente |
| CA-05 | Convite, vínculo e login real não executados | BLOQUEADO por ação humana em produção |
| CA-06 | `src/features/catalogo/catalog-view.test.tsx` e `src/features/catalogo/equipment-detail.test.tsx` cobrem foto/crédito Pixabay e ocultação de foto antiga com URL de teste | PARCIAL: não há fotos reais no catálogo remoto |

Após o upload e a inclusão do manifesto aprovado, `npm run typecheck`,
`npm run lint`, `npm test -- --run` (6 arquivos, 26 testes), `npm run build`,
`node scripts/validate-equipment-photos.mjs` e `git diff --check` passaram.
Em 2026-11-09, Docker passou a
funcionar: o PostgreSQL isolado em `localhost:5433` recebeu as três migrations.
O manifesto usado naquela rodada anterior de seed foi uma fixture local
ignorada pelo Git, com URLs fictícias; o manifesto aprovado agora versionado
ainda não foi usado no seed de produção. Uma role
não proprietária, sujeita às policies RLS, viu zero registros em tenants,
equipamentos e empréstimos. As cinco tabelas de domínio têm RLS habilitado.
O verificador-spec independente confirmou CA-01/02/03 **ATENDIDOS** após
comparar as 12 URLs, os hashes e o manifesto. Veredito geral **NÃO PRONTA**:
CA-04/05/06 ainda dependem de evidência em produção.
