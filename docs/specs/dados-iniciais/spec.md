# Spec — Dados iniciais e fotos de equipamentos

Status: APROVADA em 2026-11-06; revisão da origem para Pixabay APROVADA pelo
responsável em 2026-11-09, conforme orientação atualizada da prática.
Implementação publicada; migração, dois seeds e vínculos têm workflows
concluídos. O responsável informou ter validado o fluxo de produção em
2026-11-09. Verificação final: acompanhar `tasks.md` e `evidence.md`.

## Objetivo e vínculo

Exibir os 12 itens definidos na prática no tenant `suporte_ti`, com fotos
revisadas, sem duplicação, e habilitar a conta convidada do professor sem
registrar credencial no repositório. Segue PRD e ADR-001/002/004.

## Decisões e lacunas

- A lista exata é `data/equipamentos-iniciais.json`. Os estados seguem a própria
  lista: TI-0004, TI-0007 **e TI-0010** em manutenção; nove disponíveis. O
  briefing que diz dois em manutenção/dez disponíveis contradiz a lista.
- Categoria `cabo` da lista mapeia para `Acessório`; `camera` para `Câmera`,
  respeitando o contrato atual da aplicação. Patrimônios `TI-0001` a `TI-0012`
  são reservados ao seed; o cadastro manual mantém seu formato `PAT-0000`.
- Como número de série e local não vieram no pedido, o seed usa identificador
  técnico `SEED-TI-xxxx` e local `Acervo de TI`; isso não afirma localização
  física real. A equipe deve corrigir antes do uso operacional.
- A conta é criada via convite administrativo do Supabase Auth, vinculada ao
  tenant como `collaborator`, e começa sem empréstimos. Como o professor não
  precisa concluir convites individuais para corrigir a turma, o responsável
  pode definir a senha da conta Auth existente pela API administrativa, após
  conferir seu UUID e e-mail; a senha não fica em código, seed, documento,
  workflow ou histórico. O seed não apaga empréstimos existentes.
- Fotos selecionadas exclusivamente pela API Pixabay têm 800×600, IDs únicos,
  metadados de origem/criador/licença e revisão humana. A chave fica apenas
  em `.env.local`, ignorado pelo Git, para a ferramenta local. O agente só
  prepara arquivos locais. O upload ao
  Storage e a aplicação no banco de produção são ações humanas conforme
  `rules/operacao.md` e `docs/DEVOPS.md`.
- As URLs públicas usam o bucket `EmprestTi` informado pelo responsável;
  as 12 fotos publicadas passaram pela revisão visual e constam no manifesto
  aprovado usado pelo seed.
- Fotos antigas de equipamentos de outra origem ficam ocultas na interface
  até serem substituídas pelas fotos Pixabay aprovadas; os metadados antigos
  permanecem no banco para auditoria da migration.

## Critérios de aceitação

- CA-01: O manifesto lista exatamente os 12 patrimônios e nomes pedidos, sem
  repetição; três itens indicados estão em manutenção e nove disponíveis.
- CA-02: A preparação rejeita foto repetida, formato incorreto e manifesto sem
  origem, criador e licença; arquivos resultantes medem 800×600 e a busca usa
  somente a API Pixabay, com cache de 24 horas.
- CA-03: Revisão visual aprova apenas foto sem pessoa, logo legível, texto ou
  tela com conteúdo; cada URL pública do Storage abre sem login.
- CA-04: Executar o seed duas vezes mantém um registro por patrimônio e não
  cria empréstimos; registros de outros tenants não mudam.
- CA-05: A conta convidada do professor entra no login real e inicia com zero
  empréstimos; segredo não consta no repositório.
- CA-06: Catálogo e detalhe mostram apenas foto Pixabay aprovada e crédito
  "Fotos: Pixabay" com link; fotos antigas de outra origem não são exibidas.

## Fora de escopo

Importar planilha, redefinir senha por código, aprovar automaticamente fotos e
executar upload ou escrita no ambiente de produção pelo agente.
