# Operação da prática em produção

Estas etapas são executadas **pela pessoa responsável** no ambiente de
produção, após revisão do PR. O agente não faz upload nem escreve no deploy.

Estado em 2026-11-09: o bucket informado é `EmprestTi` e os 12 objetos já
respondem sem login. Sete fotos publicadas ainda precisam ser substituídas;
as outras cinco aguardam aprovação humana. Consulte
`docs/specs/dados-iniciais/urls-publicadas-pendentes.json`. Não use o rascunho
local `.photo-prep/publicadas-pendentes.json` como `fotos-aprovadas.json`.

1. A chave Pixabay já está no `.env.local` ignorado pelo Git. Não enviar a
   chave por chat nem colocá-la no Git ou no deploy. Rodar
   `node scripts/prepare-equipment-photos.mjs`. Examinar as 12 candidatas em `.photo-prep/`.
   Registrar IDs reprovados em `.photo-prep/rejected.json`, repetir o script,
   registrar quantidade e motivos, e confirmar
   ausência de pessoa, logo legível, texto e tela com conteúdo.
2. Usar o bucket público `EmprestTi` no Supabase Storage. Fazer upload humano
   de `TI-0001.jpg` a `TI-0012.jpg` nos mesmos caminhos; ao repetir, substituir
   o objeto existente para não duplicar arquivos. Confirmar com navegador
   sem login que as URLs públicas abrem. Criar `data/fotos-aprovadas.json`
   com 12 entradas, a partir dos metadados em `.photo-prep/candidatas.json`,
   adicionando `publicUrl`. Rodar
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
