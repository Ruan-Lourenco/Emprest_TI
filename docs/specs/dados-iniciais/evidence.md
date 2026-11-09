# Evidência — Dados iniciais

Atualizado em 2026-11-09. **Spec NÃO PRONTA**; os testes locais não comprovam
dados nem imagens aprovadas em produção. Em 2026-11-09, 12 candidatas Pixabay
foram preparadas localmente em `.photo-prep/`. O responsável informou 12 URLs
no bucket público `EmprestTi`; todas responderam HTTP 200 como JPEG 800×600
sem login. Os arquivos publicados correspondem às candidatas arquivadas em
`.photo-prep/remote-review/`; a seleção local atual já mudou. Na triagem dessas
imagens publicadas, 7 exigem substituição (pessoa, marca, tela/texto ou item
incorreto) e 5 ainda aguardam aprovação visual humana. URLs e pareceres estão
em `urls-publicadas-pendentes.json`; metadados de origem permanecem no rascunho
local `.photo-prep/publicadas-pendentes.json`. **Não há
manifesto aprovado para o seed.**

| CA | Evidência observada | Estado |
| --- | --- | --- |
| CA-01 | `src/test/initial-equipment.test.ts:6` valida 12 patrimônios, nomes exatos, 3 em manutenção e 9 disponíveis | ATENDIDO no manifesto; seed em banco pendente no CA-04 |
| CA-02 | `scripts/prepare-equipment-photos.mjs` gerou 12 JPEGs 800×600 e IDs distintos; `scripts/validate-equipment-photos.mjs` aceita o bucket público real `EmprestTi` | PARCIAL: candidatas inadequadas foram rejeitadas em `.photo-prep/rejected.json`; manifesto aprovado pendente |
| CA-03 | As 12 URLs públicas responderam HTTP 200 com JPEG 800×600 sem login; 7 fotos publicadas foram reprovadas na triagem visual | BLOQUEADO por substituição das 7, aprovação humana final e nova conferência das URLs |
| CA-04 | Três migrations aplicadas no PostgreSQL isolado em `localhost:5433`; seed executado três vezes com manifesto de teste temporário: 12 itens no `suporte_ti` (3 manutenção, 9 disponíveis), zero empréstimos; equipamentos de outros tenants permaneceram 108 antes/depois | ATENDIDO localmente; aplicação em produção pendente |
| CA-05 | Convite, vínculo e login real não executados | BLOQUEADO por ação humana em produção |
| CA-06 | `src/features/catalogo/catalog-view.test.tsx` e `src/features/catalogo/equipment-detail.test.tsx` cobrem foto/crédito Pixabay e ocultação de foto antiga com URL de teste | PARCIAL: não há fotos reais no catálogo remoto |

`npm test`: 6 arquivos, 26 testes passaram após a atualização para exibir
somente fotos Pixabay. `npm run lint`, `npm run typecheck`, `node --check` nos
scripts de fotos e `npm run build` passaram. Em 2026-11-09, Docker passou a
funcionar: o PostgreSQL isolado em `localhost:5433` recebeu as três migrations.
O manifesto usado no seed foi uma fixture local ignorada pelo Git, com URLs
fictícias; **não equivale a fotos aprovadas ou Storage publicado**. Uma role
não proprietária, sujeita às policies RLS, viu zero registros em tenants,
equipamentos e empréstimos. As cinco tabelas de domínio têm RLS habilitado.
O verificador-spec independente repetiu a análise em 2026-11-09 e concluiu
**NÃO PRONTA**: CA-02/03/05/06 ainda carecem de evidência completa; CA-04
precisa da aplicação protegida em produção antes da entrega final.
