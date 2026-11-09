# Handoff

## Estado

Branch `feat/pratica-sdd-subagentes`, PR #19 em rascunho. Specs de dados
iniciais e empréstimo aprovadas, mas **não prontas** para conclusão: faltam
revisão e publicação das fotos, PostgreSQL local, migration/seed protegidos,
conta convidada e login autenticado na Vercel.

Em 2026-11-09 o responsável escolheu Pixabay, embora o enunciado exija Pexels.
ADR-004 e specs registram a divergência. Código, migration incremental,
skill, scripts, créditos e testes foram adaptados. A chave está somente no
`.env.local` ignorado pelo Git, com placeholder em `.env.example`; não deve ir
à Vercel. Não exibir a chave nem URL de requisição com query.

O script `node scripts/prepare-equipment-photos.mjs` já gerou 12 candidatas
locais em `.photo-prep/`. A seleção automática teve fotos inadequadas; IDs
rejeitados estão em `.photo-prep/rejected.json`. As candidatas ainda não estão
aprovadas. Revisão visual humana, upload e `data/fotos-aprovadas.json` pendem.

## Próximos passos

1. Revisar as fotos em `.photo-prep/`, rejeitar pessoas, logos, texto, telas e
   equipamentos incorretos; repetir a busca com IDs reprovados.
2. Seguir `docs/OPERACAO-PRATICA.md` para upload humano e manifesto aprovado.
3. Executar PostgreSQL local e `npm run test:db`; depois migrations/seed somente
   pelos workflows protegidos, convite Auth e teste autenticado na Vercel.
4. Atualizar evidências, PR e status das specs antes de merge/tag.

O Docker Desktop não iniciou o daemon no teste anterior; a porta 5432 pertence
a outro aplicativo. Não usar esse banco como ambiente de teste.
