# Operação da prática em produção

Estas etapas são executadas **pela pessoa responsável** no ambiente de
produção, após revisão do PR. O agente não faz upload nem escreve no deploy.

1. Quando tiver tempo, solicitar a própria chave na
   [documentação oficial da API Pexels](https://www.pexels.com/api/documentation/)
   e guardá-la em arquivo local fora do repositório. Não enviar a chave por
   chat nem colocá-la em `.env` ou no Git. Rodar `node scripts/prepare-equipment-photos.mjs
   <caminho-absoluto-do-arquivo>`. Examinar as 12 candidatas em `.photo-prep/`.
   Registrar IDs reprovados em `.photo-prep/rejected.json`, repetir o script,
   registrar quantidade e motivos, e confirmar
   ausência de pessoa, logo legível, texto e tela com conteúdo.
2. Criar bucket público `equipment` no Supabase Storage. Fazer upload humano
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
     "pexelsId": "<id-da-foto>",
     "photographer": "<nome-do-fotografo>",
     "sourceUrl": "https://www.pexels.com/photo/<pagina-da-foto>/",
     "license": "Pexels License",
     "publicUrl": "https://<projeto>.supabase.co/storage/v1/object/public/equipment/TI-0001.jpg"
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
