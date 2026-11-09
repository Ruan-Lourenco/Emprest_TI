# Spec — Dados iniciais e fotos de equipamentos

Status: APROVADA em 2026-11-06; revisão da origem para Pixabay APROVADA pelo
responsável em 2026-11-09. A revisão diverge do enunciado Pexels da prática.
Implementação e produção: pendentes até evidência nos itens de `tasks.md`.

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
  tenant como `collaborator`, e começa sem empréstimos. Nenhuma senha fica em
  código, seed, documento ou histórico. O seed não apaga empréstimos existentes.
- Fotos selecionadas exclusivamente pela API Pixabay têm 800×600, IDs únicos,
  metadados de origem/criador/licença e revisão humana. A chave fica apenas
  em `.env.local`, ignorado pelo Git, para a ferramenta local. O agente só
  prepara arquivos locais. O upload ao
  Storage e a aplicação no banco de produção são ações humanas conforme
  `rules/operacao.md` e `docs/DEVOPS.md`.

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
- CA-06: Catálogo e detalhe mostram foto e crédito "Fotos: Pixabay" com link.

## Fora de escopo

Importar planilha, redefinir senha por código, aprovar automaticamente fotos e
executar upload ou escrita no ambiente de produção pelo agente.
