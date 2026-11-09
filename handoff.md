# Handoff

## Estado

Branch `feat/pratica-sdd-subagentes`, PR #19 em rascunho. Specs de dados
iniciais e empréstimo aprovadas, mas **não prontas** para conclusão: faltam
revisão e publicação das fotos, migration/seed protegidos,
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
3. PostgreSQL local isolado em `localhost:5433` recebeu as três migrations;
   `npm run test:db` passou após correção de `P2028`, e o seed idempotente foi
   verificado com fixture ignorada pelo Git. Aplicar migrations/seed de produção
   somente pelos workflows protegidos; convite Auth e teste autenticado na Vercel.
4. Atualizar evidências, PR e status das specs antes de merge/tag.

A porta 5432 pertence a outro aplicativo. O teste atual usou contêiner isolado
em 5433; não usar o banco do outro aplicativo ou o Supabase remoto em testes.
