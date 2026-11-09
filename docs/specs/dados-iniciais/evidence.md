# Evidência — Dados iniciais

Atualizado em 2026-11-09. **Spec NÃO PRONTA**; os testes locais não comprovam
dados nem imagens em produção. Em 2026-11-09, 12 candidatas Pixabay foram
preparadas localmente em `.photo-prep/`, com revisão humana e upload pendentes.

| CA | Evidência observada | Estado |
| --- | --- | --- |
| CA-01 | `src/test/initial-equipment.test.ts:6` valida 12 patrimônios, nomes exatos, 3 em manutenção e 9 disponíveis | ATENDIDO no manifesto; seed em banco pendente no CA-04 |
| CA-02 | `scripts/prepare-equipment-photos.mjs` gerou 12 JPEGs 800×600 e IDs distintos; `scripts/validate-equipment-photos.mjs` valida o manifesto | PARCIAL: candidatas inadequadas foram rejeitadas em `.photo-prep/rejected.json`; manifesto aprovado pendente |
| CA-03 | Revisão preliminar rejeitou fotos com pessoa, marca, texto/tela ou item incorreto; nenhuma URL pública conferida | BLOQUEADO por revisão final e upload humano |
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
