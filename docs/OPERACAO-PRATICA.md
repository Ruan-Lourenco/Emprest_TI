# Operação da prática em produção

Estas etapas são executadas **pela pessoa responsável** no ambiente de
produção, após revisão do PR. O agente não faz upload nem escreve no deploy.

Estado em 2026-11-09: as 12 fotos Pixabay foram aprovadas pelo responsável e
estão no bucket público `EmprestTi`. As 12 URLs abriram sem login e os hashes
remotos coincidiram com os arquivos aprovados. O manifesto
`data/fotos-aprovadas.json` passou no validador. URLs e pareceres estão em
`docs/specs/dados-iniciais/urls-publicadas-validadas.json`.

1. Concluir revisão do PR #19, tirar do rascunho e, após a aprovação exigida e
   os checks, fazer merge em `main`. Então executar o workflow manual protegido
   `migrate-production` com confirmação `APPLY`. Verificar o resultado antes de
   abrir o workflow `seed-practice-production`. Executar o seed duas vezes e
   confirmar 12 registros do tenant, 3 em manutenção, 9 disponíveis e nenhum
   empréstimo criado pela rotina.
2. Convidar a conta do professor no Supabase Auth pela administração. Usar o
   workflow protegido `bind-invited-user` com o UUID Auth e papel
   `collaborator`; não registrar senha no GitHub ou no repositório. Confirmar
   login e zero empréstimos. Para testes de solicitação, usar outra conta.
3. Conferir catálogo, fotos, crédito, bloqueios, empréstimo, vencimento e
   lista pessoal em https://emprest-ti-coral.vercel.app/login com conta de
   teste. A conta do professor deve permanecer sem empréstimos.

Se o projeto não tiver bucket, credenciais de CI, environment protegido ou
integração Vercel configurados, resolver isso antes da execução. Não usar o
banco remoto como ambiente de teste.
