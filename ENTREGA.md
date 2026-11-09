# Entrega da prática

## Links

- Repositório: https://github.com/Ruan-Lourenco/Emprest_TI
- PR da prática incorporado: https://github.com/Ruan-Lourenco/Emprest_TI/pull/19
- PR da correção de produção incorporado: https://github.com/Ruan-Lourenco/Emprest_TI/pull/27
- Produção informada pelo responsável: https://emprest-ti-coral.vercel.app/login
- Estado em 2026-11-09: **produção validada pelo responsável; specs ainda
  NÃO PRONTAS no parecer independente**. As 12 fotos no Storage foram conferidas
  por URL e hash; workflows protegidos de migration, dois seeds e vínculo
  concluíram com sucesso. O responsável informou ter conferido login, catálogo,
  empréstimo, recarga, limite e conta do professor com zero empréstimos na
  Vercel após o PR #27. Não há captura da repetição final: a fonte dessa parte
  é o relato do responsável. O verificador pediu captura da contagem remota,
  prova da conta do professor com zero empréstimos e duas coberturas locais;
  os dois testes foram adicionados e passaram, mas exigem novo parecer.
  A tag `entrega-pratica` depende do veredito PRONTA das duas specs e da
  versão final deste documento em `main`.

## 1. Conflitos: pedido versus fontes vigentes

| Pedido | Contrariava | Decisão e motivo | Registro | Commit |
| --- | --- | --- | --- | --- |
| Limite de cinco empréstimos | PRD: três | Mantidos três; só Operações altera regra aprovada | `docs/specs/solicitar-emprestimo/spec.md`, CA-04 | `b8aeee3` |
| Prazo de 14 dias úteis | PRD: 14 dias sem definir úteis/corridos; implementação anterior: 14 corridos | Mantidos 14 corridos na spec aprovada; a unidade foi explicitada para não atribuí-la indevidamente ao PRD | `docs/specs/solicitar-emprestimo/spec.md`, CA-03 | `b8aeee3` |
| Catálogo sem crédito | Diretrizes da API e contrato da skill | Exibir link "Fotos: Pixabay" conforme orientação atualizada; o HTML original citava Pexels | ADR-004, CA-02/CA-06 | `603adad` |
| Fonte das fotos atualizada | HTML original: Pexels exclusivamente | Responsável confirmou em 2026-11-09 que Pixabay é a orientação vigente da prática; skill, specs e ADR-004 seguem essa fonte | ADR-004, specs revisadas | `603adad` |
| Senha no seed | `rules/secrets.md`, `AGENTS.md` e outra seção do enunciado | Não registrar senha; convite Auth, vínculo por UUID e definição administrativa da senha na conta existente, executada pelo responsável | `docs/specs/dados-iniciais/spec.md`, CA-05 | `b8aeee3`; atualização desta entrega |
| Apenas dois itens em manutenção | Lista canônica de 12 inclui TI-0010 em manutenção | Três em manutenção, nove disponíveis | `data/equipamentos-iniciais.json`, CA-01 | `b8aeee3` |
| Verificador corrigir teste | Independência exigida para o papel | Verificador só aponta; agente principal corrige | `agents/verificador-spec.md` e seção 6 | `4501a76`, `dbf4abf` |
| Agente publicar dados | Regra geral da própria prática e `rules/operacao.md` | Agente prepara; pessoa executa no deploy | `docs/specs/dados-iniciais/spec.md` | `b8aeee3` |

## 1b. Lacunas decididas

| Spec | Faltava | Alternativas e decisão | Motivo | Commit |
| --- | --- | --- | --- | --- |
| Dados iniciais | Série e localização | Placeholders técnicos `SEED-TI-xxxx` e `Acervo de TI` | Schema exige os campos; não inventa série real. Corrigir antes de operar. | `b8aeee3` |
| Dados iniciais | Categoria `cabo` fora do enum atual | Mapear para `Acessório` | Preserva contrato da aplicação sem categoria nova. | `b8aeee3` |
| Dados iniciais | Papel da conta do professor | `collaborator` | Precisa solicitar e ver apenas os próprios itens; sem acesso de Operações. | `b8aeee3` |
| Fotos | Onde guardar origem e crédito | Colunas opcionais em `equipment` | Registro verificável, compatível com dados existentes. | `b8aeee3` |
| Solicitação | Aprovação ou fila | Nenhuma; cria imediatamente | Decisão explícita do briefing, sem conflito com PRD. | `b8aeee3` |
| Conta do professor | Convite exigiria que ele concluísse um e-mail por projeto | Manter Supabase Auth e definir senha na conta convidada existente pela API administrativa, após conferir UUID/e-mail; não criar segunda tabela de login | Permite o login previsto sem expor senha em seed, Git, workflow ou documentação | Atualização desta entrega |

## 2. Onde o agente tentou decidir

A frase do briefing sobre "dois em manutenção" poderia ter sido copiada como
regra, mas a lista específica marca também TI-0010. Contei os estados da lista
e registrei a divergência na spec antes do seed. Não alterei o estado do item
para fazer a contagem do texto bater.

## 3. ADR

O armazenamento dos metadados da foto mereceu ADR-003: havia a alternativa
defensável de manter um manifesto separado. A coluna junto ao equipamento
facilita auditoria e unicidade da foto. A migration adiciona colunas opcionais
para preservar os registros existentes.

O ADR-004 registra a orientação atualizada para Pixabay e a migration
incremental que preserva metadados Pexels anteriores, se existirem. A interface
oculta essas fotos antigas até serem substituídas pelas fotos Pixabay aprovadas.

## 4. Skill `imagens-equipamentos`

O `SKILL.md` contém o procedimento e o ponto de parada humano; `references/`
guarda os links e campos da API; os scripts fazem busca, recorte, detecção de
IDs repetidos e verificação de 800×600. A ausência de pessoas, logos, texto e
telas com conteúdo exige inspeção visual. O script não contém endpoint de
upload nem chave do Supabase. Em 2026-11-09, foram preparadas 12 candidatas
Pixabay locais. A primeira seleção teve 11 fotos visualmente rejeitadas por
conteúdo inadequado ou equipamento incorreto. O responsável confirmou cinco
fotos publicadas e aprovou sete substitutas Pixabay. Após o upload humano das
sete, as 12 URLs públicas do bucket `EmprestTi` responderam HTTP 200 sem login
e coincidiram por SHA-256 com os 12 JPEGs aprovados de 800×600. O manifesto
`data/fotos-aprovadas.json` contém 12 IDs únicos e passou em
`node scripts/validate-equipment-photos.mjs`. URLs e revisão estão em
`docs/specs/dados-iniciais/urls-publicadas-validadas.json`. A chave está no
`.env.local` ignorado pelo Git. Fonte: https://pixabay.com/api/docs/.

Na triagem inicial, TI-0003, 0005, 0006, 0007, 0009, 0011 e 0012 foram
reprovadas e substituídas. A aprovação final das substitutas foi dada pelo
responsável.

## 5. Subagente verificador

`AGENTS.md` e `rules/spec-flow.md` exigem o verificador antes de declarar uma
spec pronta. O adaptador do Cursor é `readonly`; o procedimento canônico
proíbe edição, deploy, migration e escrita no banco. O papel lê rules e os três
arquivos da spec com contexto separado, avalia cada CA e devolve tabela fixa.
O monólito exige checar router, service, Prisma e interface no mesmo escopo.

## 6. Verificador em ação

Primeira rodada independente em 2026-11-06, escopo diff local:

| Spec | CA-01 | CA-02 | CA-03 | CA-04 | CA-05 | CA-06 | Veredito |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Dados iniciais | PARCIAL | PARCIAL | BLOQUEADO | PARCIAL | BLOQUEADO | PARCIAL | NÃO PRONTA |
| Solicitar empréstimo | SEM TESTE | PARCIAL | PARCIAL | PARCIAL | BLOQUEADO | PARCIAL | NÃO PRONTA |

O verificador citou, entre outros, ausência de imagens/Storage/login reais para
dados iniciais e ausência de teste de procedimento, concorrência PostgreSQL e
recarga para empréstimo. O agente principal adicionou testes de procedimento,
contagem e filtro pessoal após a rodada; isso **não substitui nova verificação**.
Na rodada inicial, `npm test` passou com 12 testes, `npm run lint` e
`npm run typecheck` passaram. O agente principal executou `npm run build` com
sucesso. Depois das correções locais, `npm test` passou com **16 testes**,
além de typecheck, lint e build.

Na continuação, testes de contexto tRPC e motivos visíveis elevaram a suíte
para **23 testes aprovados**. `npm run typecheck`, `npm run lint` e
`npm run build` passaram novamente. O roteiro `scripts/test-db.ts` passou a
exigir conflito em tentativa entre tenants e lista pessoal no mesmo tenant,
mas não foi executado: o Docker Desktop não iniciou o daemon e a porta local
5432 pertence a outro aplicativo. As evidências CA a CA estão em
`docs/specs/dados-iniciais/evidence.md` e
`docs/specs/solicitar-emprestimo/evidence.md`.

Segunda rodada independente, antes dos ajustes finais:

| Spec | CA-01 | CA-02 | CA-03 | CA-04 | CA-05 | CA-06 | Veredito |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Dados iniciais | PARCIAL | PARCIAL | BLOQUEADO | SEM TESTE | BLOQUEADO | PARCIAL | NÃO PRONTA |
| Solicitar empréstimo | ATENDIDO local | PARCIAL | PARCIAL | PARCIAL | BLOQUEADO | PARCIAL | NÃO PRONTA |

O verificador de dados apontou que o teste não comparava nomes; o agente
principal acrescentou a lista exata em `src/test/initial-equipment.test.ts`.
O verificador de empréstimo apontou que o teste de concorrência não verificava
o código `CONFLICT`; o agente principal acrescentou essa asserção em
`scripts/test-db.ts`. Também passou a diferenciar na interface os motivos de
manutenção e empréstimo em aberto. Essas correções foram validadas localmente,
mas continuam sem execução em PostgreSQL e produção.

Prova com erro plantado, em dois commits após a baseline `b8aeee3`:

| Rodada | Commit | CA-04 / evidência | Veredito |
| --- | --- | --- | --- |
| Erro plantado | `4501a76` | PARCIAL: o teste de bloqueio por atraso foi removido de `src/server/services/loans.test.ts`; o verificador apontou ausência de exercício de `dueAt < now` | NÃO PRONTA |
| Restauração | `dbf4abf` | O teste voltou em `src/server/services/loans.test.ts:43`; verifica `PRECONDITION_FAILED` e nenhuma criação de empréstimo | NÃO PRONTA pelas demais pendências |

O verificador não corrigiu o teste. A restauração foi feita pelo agente
principal, e o `git show dbf4abf` permite comparar os dois estados.

Rodada mais recente em 2026-11-09, após PostgreSQL isolado e confirmação da
fonte Pixabay. Os resultados abaixo são o estado atual, não substituem as
evidências CA a CA nos diretórios das specs:

| Spec | CA-01 | CA-02 | CA-03 | CA-04 | CA-05 | CA-06 | Veredito |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Dados iniciais | ATENDIDO | PARCIAL | BLOQUEADO | PARCIAL | BLOQUEADO | PARCIAL | NÃO PRONTA |
| Solicitar empréstimo | ATENDIDO | PARCIAL | ATENDIDO local | ATENDIDO local | ATENDIDO local | PARCIAL | NÃO PRONTA |

O verificador apontou ausência de fotos aprovadas e URLs públicas, convite e
login reais, dados de produção e recarga autenticada. A fixture local do seed
comprova idempotência no PostgreSQL, mas não é o manifesto aprovado da prática.

## 7. Regra posta à prova

`rules/secrets.md` foi esclarecido: variáveis de runtime e build vão à Vercel;
`PIXABAY_API_KEY` é exclusiva da preparação local. Existe em `.env.local` e
como placeholder em `.env.example`, sem valor no Git. Não deve ir à Vercel.
O script não imprime a chave nem a URL de requisição, que a contém na query.

Ao atualizar o PR com `main`, a branch principal trouxe uma segunda cópia da
skill em `.cursor/skills/` e `prisma` CLI 7 com `@prisma/client` 6. Mantive a
fonte canônica `.agents/skills/` prevista em `AGENTS.md` e alinhei o CLI à
linha 6 do client para preservar geração e build. As demais atualizações de
dependências de `main` foram mantidas. Após o merge `d4e4ab7`, `npm ci`,
`npm run build`, `npm run lint`, `npm test` (16 testes) e `git diff --check`
passaram. No PR #19, os checks `Documentation and secret guard` e
`Production build` também passaram. Esse parágrafo registra o estado anterior
ao merge do PR #19; as execuções de produção posteriores constam abaixo.

## 8. Fora de escopo e pendências

Atualização de 2026-11-09: Docker voltou a funcionar. Em PostgreSQL isolado
`localhost:5433`, as três migrations aplicaram; `npm run test:db` passou após
tratar `P2028` de espera por transação como conflito ao solicitar empréstimo.
O seed rodou três vezes com fixture local temporária e manteve 12 equipamentos
(3 manutenção, 9 disponíveis), zero empréstimos e 108 equipamentos dos outros
tenants antes/depois. Uma role não proprietária sob RLS viu zero registros.
Essa fixture **não** é aprovação de foto nem substitui a execução protegida em
produção. Os workflows protegidos posteriores são listados na seção 9.

Após a confirmação de que Pixabay é a fonte vigente, catálogo e detalhe
passaram a ocultar fotos antigas de outra origem até sua substituição. A suíte
local passou com 26 testes, além de typecheck, lint e build.

- Fotos Pixabay revisadas, upload **humano** e 12 URLs públicas conferidas;
  `data/fotos-aprovadas.json` validado localmente.
- Conservar a conta do professor com zero empréstimos até a correção.
- Não usar o sistema como inventário operacional definitivo antes de corrigir
  os placeholders de série e localização com dados reais.
- Anexar as provas remotas solicitadas e repetir o verificador independente
  sobre as duas coberturas locais agora testadas. Incorporar esta revisão em `main`
  antes da tag `entrega-pratica`.

`EmprestTI.zip` preexistente e não rastreado ficou fora desta entrega.

## 9. Fechamento de produção em 2026-11-09

- O [PR #19](https://github.com/Ruan-Lourenco/Emprest_TI/pull/19) publicou a
  prática. O [PR #27](https://github.com/Ruan-Lourenco/Emprest_TI/pull/27)
  corrigiu a falha intermitente do Prisma no Supavisor; na branch do PR,
  typecheck, lint, 31 testes e build passaram. O responsável informou que o
  deploy posterior funciona.
- [Migration protegida](https://github.com/Ruan-Lourenco/Emprest_TI/actions/runs/42624490914),
  [seed 1](https://github.com/Ruan-Lourenco/Emprest_TI/actions/runs/42624620235),
  [seed 2](https://github.com/Ruan-Lourenco/Emprest_TI/actions/runs/42625055903)
  e [vínculo Auth](https://github.com/Ruan-Lourenco/Emprest_TI/actions/runs/42626220868)
  concluíram com sucesso. Houve também uma tentativa de vínculo que falhou;
  ela não é contada como evidência de conclusão.
- O responsável informou ter conferido 12 equipamentos sem duplicatas, três
  em manutenção, fotos e crédito, login separado, empréstimo e persistência
  após recarga, recusa pelo limite e zero empréstimos na conta do professor.
  É evidência humana relatada, sem captura anexada. Os testes de concorrência,
  atraso e isolamento entre tenants constam no PostgreSQL local em
  `docs/specs/solicitar-emprestimo/evidence.md`.
- Após o primeiro parecer independente, foram adicionados testes para item
  fora de uso e vencimento exibido na lista pessoal; os dois arquivos de
  teste passaram (8 testes). O verificador ainda precisa reavaliá-los.
- Em nova verificação de 2026-11-09, as 12 URLs de
  `docs/specs/dados-iniciais/urls-publicadas-validadas.json` responderam
  HTTP 200 por HEAD sem autenticação; o validador local confirmou 12 fotos
  únicas com metadados e JPEGs 800×600.
- O HTML original exigia Pexels, mas o responsável informou que a orientação
  atualizada da turma é Pixabay. ADR-004, skill, manifesto e interface seguem
  a decisão registrada; a confirmação externa dessa mudança não está anexada.
