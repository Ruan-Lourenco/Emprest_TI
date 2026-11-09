# Operação da prática em produção

Estas etapas são executadas **pela pessoa responsável** no ambiente de
produção, após revisão do PR. O agente não faz upload nem escreve no deploy.

Estado em 2026-11-09: as 12 fotos Pixabay foram aprovadas pelo responsável e
estão no bucket público `EmprestTi`. As 12 URLs abriram sem login e os hashes
remotos coincidiram com os arquivos aprovados. O manifesto
`data/fotos-aprovadas.json` passou no validador. O PR #19 foi incorporado;
migration e dois seeds protegidos concluíram com sucesso. O responsável
informou ter validado login e empréstimo na Vercel após o PR #27. Links e
evidências constam no `ENTREGA.md` e nas duas specs da prática.

1. O PR #19, a migration protegida e os dois seeds estão concluídos. Para
   uma nova execução, seguir a ordem: merge revisado em `main`, workflow
   `migrate-production` com `APPLY`, depois `seed-practice-production` duas
   vezes; conferir 12 registros do tenant, 3 em manutenção, 9 disponíveis
   antes dos empréstimos de teste e nenhuma duplicata.
2. A conta do professor foi convidada no Supabase Auth e vinculada pelo
   workflow protegido `bind-invited-user` com papel `collaborator`. O
   responsável definiu a senha na conta existente pela API administrativa,
   após conferir UUID e e-mail; nenhum segredo foi escrito no repositório.
   Para repetir a validação, confirmar login e zero empréstimos. Para testes
   de solicitação, usar outra conta.
3. O responsável informou ter conferido catálogo, fotos, crédito, bloqueios,
   empréstimo, vencimento e lista pessoal em
   https://emprest-ti-coral.vercel.app/login com conta de teste, após a
   correção do PR #27. A conta do professor deve permanecer sem empréstimos.

Se o projeto não tiver bucket, credenciais de CI, environment protegido ou
integração Vercel configurados, resolver isso antes da execução. Não usar o
banco remoto como ambiente de teste.
