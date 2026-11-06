# Evidência — Dados iniciais

Atualizado em 2026-11-06. **Spec NÃO PRONTA**; os testes locais não comprovam
dados nem imagens em produção. A chave Pexels ainda não está disponível.

| CA | Evidência observada | Estado |
| --- | --- | --- |
| CA-01 | `src/test/initial-equipment.test.ts:6` valida 12 patrimônios, nomes exatos, 3 em manutenção e 9 disponíveis | PARCIAL: sem seed em banco |
| CA-02 | `scripts/prepare-equipment-photos.mjs` e `scripts/validate-equipment-photos.mjs` validam IDs, metadados, 800×600 e URL; sintaxe Node passou | PARCIAL: não há fotos nem manifesto aprovado |
| CA-03 | Nenhuma foto revisada ou URL pública conferida | BLOQUEADO por chave e revisão/upload humano |
| CA-04 | `prisma/seed.ts` usa upsert por tenant/patrimônio e preserva estado de item já emprestado | SEM TESTE de repetição em PostgreSQL local |
| CA-05 | Convite, vínculo e login real não executados | BLOQUEADO por ação humana em produção |
| CA-06 | `src/features/catalogo/catalog-view.test.tsx:30` e `src/features/catalogo/equipment-detail.test.tsx:17` cobrem foto e crédito com URL de teste | PARCIAL: não há fotos reais no catálogo remoto |

`npm test`: 6 arquivos, 23 testes passaram. `npm run lint`,
`npm run typecheck`, `node --check` nos scripts de fotos e `git diff --check`
e `npm run build` passaram. O banco local não está disponível: Docker
Desktop não iniciou o daemon, e a porta 5432 pertence a outro aplicativo.
