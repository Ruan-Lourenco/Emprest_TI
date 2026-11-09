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

O responsável aprovou cinco fotos já publicadas e sete substitutas Pixabay;
as sete foram enviadas por ele ao bucket `EmprestTi`. As 12 URLs responderam
HTTP 200 sem login e os arquivos remotos coincidiram por SHA-256 com os JPEGs
aprovados 800×600. URLs e pareceres estão em
`docs/specs/dados-iniciais/urls-publicadas-validadas.json`. O manifesto
`data/fotos-aprovadas.json` existe e passou no validador local. As specs
continuam NÃO PRONTAS até evidência de produção dos critérios restantes.

## Próximos passos

1. Revisar o PR #19 com o manifesto versionado, executar os checks e obter a
   revisão exigida antes do merge em `main`.
2. PostgreSQL local isolado em `localhost:5433` recebeu as três migrations;
   `npm run test:db` passou após correção de `P2028`, e o seed idempotente foi
   verificado com fixture ignorada pelo Git. Aplicar migrations/seed de produção
   somente pelos workflows protegidos; convite Auth e teste autenticado na Vercel.
3. Atualizar evidências e status das specs após a verificação real. Criar a tag
   de entrega somente quando os critérios de aceitação estiverem comprovados.

A porta 5432 pertence a outro aplicativo. O teste atual usou contêiner isolado
em 5433; não usar o banco do outro aplicativo ou o Supabase remoto em testes.
