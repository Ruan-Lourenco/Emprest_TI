# Operação da prática em produção

Estas etapas são executadas **pela pessoa responsável** no ambiente de
produção, após revisão do PR. O agente não faz upload nem escreve no deploy.

Estado em 2026-11-09: o bucket informado é `EmprestTi` e os 12 objetos já
respondem sem login. Cinco foram confirmadas pelo responsável como corretas;
sete ainda precisam ser substituídas. As candidatas de substituição estão em
`.photo-prep/para-revisar-7/` (ou `para-revisar-7.zip`), com prévia em
`.photo-prep/replacements/contact-sheet.jpg` e metadados em
`.photo-prep/replacements/candidatas.json`. Examine-as antes do upload. Consulte
`docs/specs/dados-iniciais/urls-publicadas-pendentes.json`. Não use o rascunho
local `.photo-prep/publicadas-pendentes.json` como `fotos-aprovadas.json`.
O responsável aprovou visualmente as sete substitutas em 2026-11-09; o upload
e a conferência das novas URLs ainda não ocorreram.

1. A chave Pixabay já está no `.env.local` ignorado pelo Git. Não enviar a
   chave por chat nem colocá-la no Git ou no deploy. Examinar as sete
   candidatas em `.photo-prep/para-revisar-7/` e seus metadados em
   `candidatas.json`. Confirmar ausência de pessoa, logo legível, texto e
   tela com conteúdo, além da correspondência com cada equipamento.
   Se alguma for reprovada, registrar seu `sourceId` em
   `.photo-prep/rejected.json` e selecionar outra pela API Pixabay.
2. Usar o bucket público `EmprestTi` no Supabase Storage. Fazer upload humano
   apenas de `TI-0003.jpg`, `TI-0005.jpg`, `TI-0006.jpg`, `TI-0007.jpg`,
   `TI-0009.jpg`, `TI-0011.jpg` e `TI-0012.jpg` de
   `.photo-prep/para-revisar-7/`, após aprovação visual. Substituir os objetos
   existentes nos mesmos caminhos, sem duplicar arquivos. Confirmar com
   navegador sem login que as URLs públicas abrem e mostram as fotos novas.
   Depois dessa conferência, copiar o rascunho de 12 entradas
   `.photo-prep/manifesto-apos-upload.json` para `data/fotos-aprovadas.json`.
   O rascunho combina os metadados das cinco publicadas confirmadas com os
   das sete substitutas; ainda não pode ser usado pelo seed. Rodar
   `node scripts/validate-equipment-photos.mjs`. Só então commitar o manifesto.

   Cada entrada do manifesto aprovado tem esta forma (placeholders, sem foto
   real):

   ```json
   {
     "patrimonio": "TI-0001",
     "provider": "Pixabay",
     "sourceId": "<id-da-foto>",
     "creator": "<nome-do-criador>",
     "sourceUrl": "https://pixabay.com/photos/<pagina-da-foto>/",
     "license": "Pixabay Content License",
     "publicUrl": "https://<projeto>.supabase.co/storage/v1/object/public/EmprestTi/TI-0001.jpg"
   }
   ```
3. Concluir revisão do PR, merge em `main` e o workflow manual protegido
   `migrate-production` com confirmação `APPLY`. Verificar o resultado antes de
   abrir o workflow `seed-practice-production`. Executar o seed duas vezes e
   confirmar 12 registros do tenant, 3 em manutenção, 9 disponíveis e nenhum
   empréstimo criado pela rotina.
4. Convidar a conta do professor no Supabase Auth pela administração. Usar o
   workflow protegido `bind-invited-user` com o UUID Auth e papel
   `collaborator`; não registrar senha no GitHub ou no repositório. Confirmar
   login e zero empréstimos. Para testes de solicitação, usar outra conta.
5. Conferir catálogo, fotos, crédito, bloqueios, empréstimo, vencimento e
   lista pessoal em https://emprest-ti-coral.vercel.app/login com conta de
   teste. A conta do professor deve permanecer sem empréstimos.

Se o projeto não tiver bucket, credenciais de CI, environment protegido ou
integração Vercel configurados, resolver isso antes da execução. Não usar o
banco remoto como ambiente de teste.
