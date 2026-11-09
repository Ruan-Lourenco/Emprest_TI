# Evidência — Dados iniciais

Atualizado em 2026-11-09. **Spec NÃO PRONTA**; os testes locais não comprovam
dados nem imagens em produção. Em 2026-11-09, 12 candidatas Pixabay foram
preparadas localmente em `.photo-prep/`, com revisão humana e upload pendentes.

| CA | Evidência observada | Estado |
| --- | --- | --- |
| CA-01 | `src/test/initial-equipment.test.ts:6` valida 12 patrimônios, nomes exatos, 3 em manutenção e 9 disponíveis | ATENDIDO no manifesto; seed em banco pendente no CA-04 |
| CA-02 | `scripts/prepare-equipment-photos.mjs` gerou 12 JPEGs 800×600 e IDs distintos; `scripts/validate-equipment-photos.mjs` valida o manifesto | PARCIAL: candidatas inadequadas foram rejeitadas em `.photo-prep/rejected.json`; manifesto aprovado pendente |
| CA-03 | Revisão preliminar rejeitou fotos com pessoa, marca, texto/tela ou item incorreto; nenhuma URL pública conferida | BLOQUEADO por revisão final e upload humano |
| CA-04 | `prisma/seed.ts` usa upsert por tenant/patrimônio e preserva estado de item já emprestado | SEM TESTE de repetição em PostgreSQL local |
| CA-05 | Convite, vínculo e login real não executados | BLOQUEADO por ação humana em produção |
| CA-06 | `src/features/catalogo/catalog-view.test.tsx:30` e `src/features/catalogo/equipment-detail.test.tsx:17` cobrem foto e crédito com URL de teste | PARCIAL: não há fotos reais no catálogo remoto |

`npm test`: 6 arquivos, 24 testes passaram. `npm run lint`,
`npm run typecheck`, `node --check` nos scripts de fotos e `git diff --check`
e `npm run build` passaram. O banco local não está disponível: Docker
Desktop não iniciou o daemon, e a porta 5432 pertence a outro aplicativo.
O verificador-spec independente repetiu a análise em 2026-11-09 e concluiu
**NÃO PRONTA**: CA-02/03/04/05/06 ainda carecem de evidência completa.
