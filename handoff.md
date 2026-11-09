# Handoff

## Estado

Branch `feat/pratica-sdd-subagentes`, PR #19 em rascunho. Specs de dados
iniciais e empréstimo aprovadas, mas **não prontas** para conclusão: faltam
revisão e publicação das fotos, migration/seed protegidos,
conta convidada e login autenticado na Vercel.

Em 2026-11-09 o responsável confirmou que a orientação atualizada da prática
exige Pixabay; o HTML original citava Pexels. ADR-004 e specs registram essa
mudança. Código, migration incremental,
skill, scripts, créditos e testes foram adaptados. A chave está somente no
`.env.local` ignorado pelo Git, com placeholder em `.env.example`; não deve ir
à Vercel. Não exibir a chave nem URL de requisição com query.

O script `node scripts/prepare-equipment-photos.mjs` gerou 12 candidatas
locais em `.photo-prep/`. O responsável publicou 12 URLs no bucket `EmprestTi`;
todas responderam HTTP 200 como JPEG 800×600 e são idênticas às candidatas
daquele momento. Sete fotos publicadas foram rejeitadas na triagem visual,
cinco aguardam aprovação humana. As URLs e os pareceres estão em
`docs/specs/dados-iniciais/urls-publicadas-pendentes.json`; os metadados de
origem estão em `.photo-prep/publicadas-pendentes.json`; IDs rejeitados em
`.photo-prep/rejected.json`. O manifesto `data/fotos-aprovadas.json` não existe
e não deve ser criado antes da substituição das fotos reprovadas.

## Próximos passos

1. Finalizar 12 fotos adequadas em `.photo-prep/`; a seleção automática ainda
   produziu resultados inadequados para alguns itens.
2. Seguir `docs/OPERACAO-PRATICA.md` para substituir no bucket `EmprestTi` as
   fotos rejeitadas, aprovar visualmente todas e criar manifesto aprovado.
3. PostgreSQL local isolado em `localhost:5433` recebeu as três migrations;
   `npm run test:db` passou após correção de `P2028`, e o seed idempotente foi
   verificado com fixture ignorada pelo Git. Aplicar migrations/seed de produção
   somente pelos workflows protegidos; convite Auth e teste autenticado na Vercel.
4. Atualizar evidências, PR e status das specs antes de merge/tag.

A porta 5432 pertence a outro aplicativo. O teste atual usou contêiner isolado
em 5433; não usar o banco do outro aplicativo ou o Supabase remoto em testes.
