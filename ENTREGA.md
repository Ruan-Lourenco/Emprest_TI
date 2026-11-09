# Entrega da prática

## Links

- Repositório: https://github.com/Ruan-Lourenco/Emprest_TI
- PR em rascunho: https://github.com/Ruan-Lourenco/Emprest_TI/pull/19
- Produção informada pelo responsável: https://emprest-ti-coral.vercel.app/login
- Estado: **entrega parcial**. A página de login respondeu HTTP 200 em
  2026-11-06; fotos, dados, conta convidada e fluxo autenticado no deploy ainda
  não foram comprovados. Não se deve usar a tag `entrega-pratica` como sinal de
  conclusão antes dessas verificações.

## 1. Conflitos: pedido versus fontes vigentes

| Pedido | Contrariava | Decisão e motivo | Registro | Commit |
| --- | --- | --- | --- | --- |
| Limite de cinco empréstimos | PRD: três | Mantidos três; só Operações altera regra aprovada | `docs/specs/solicitar-emprestimo/spec.md`, CA-04 | `b8aeee3` |
| Prazo de 14 dias úteis | PRD e código atual: 14 dias corridos | Mantidos 14 corridos até decisão de Operações | `docs/specs/solicitar-emprestimo/spec.md`, CA-03 | `b8aeee3` |
| Catálogo sem crédito | Diretrizes da API Pexels e contrato da skill | Exibir link "Fotos: Pexels" | ADR-003, CA-02/CA-06 | `b8aeee3` |
| Fonte das fotos após revisão | Enunciado exige Pexels exclusivamente | Responsável escolheu Pixabay; este requisito da avaliação **não será atendido** | ADR-004, specs revisadas em 2026-11-09 | branch atual |
| Senha no seed | `rules/secrets.md`, `AGENTS.md` e outra seção do enunciado | Não registrar senha; convite Auth e vínculo por UUID | `docs/specs/dados-iniciais/spec.md`, CA-05 | `b8aeee3` |
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

O ADR-004 registra a escolha posterior por Pixabay e a migration incremental
que preserva metadados Pexels anteriores, se existirem.

## 4. Skill `imagens-equipamentos`

O `SKILL.md` contém o procedimento e o ponto de parada humano; `references/`
guarda os links e campos da API; os scripts fazem busca, recorte, detecção de
IDs repetidos e verificação de 800×600. A ausência de pessoas, logos, texto e
telas com conteúdo exige inspeção visual. O script não contém endpoint de
upload nem chave do Supabase. Em 2026-11-09, foram preparadas 12 candidatas
Pixabay locais. A primeira seleção teve 11 fotos visualmente rejeitadas por
conteúdo inadequado ou equipamento incorreto. A segunda seleção também tem
fotos inadequadas; a revisão continua aberta. A chave está no `.env.local`
ignorado pelo Git. Fonte: https://pixabay.com/api/docs/.

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
`Production build` também passaram. O PR segue em rascunho pelas pendências
de dados, banco e produção descritas acima.

## 8. Fora de escopo e pendências

- Concluir revisão das candidatas Pixabay, registrar rejeições e motivos;
  upload **humano** para bucket público do Storage.
- Confirmar URLs, criar `data/fotos-aprovadas.json` e executar o validador.
- Aplicar migration pelo workflow protegido e rodar seed inicial duas vezes,
  verificando contagem e nenhuma alteração em empréstimos existentes.
- Criar conta do professor por convite Auth, vincular UUID como `collaborator`
  e confirmar zero empréstimos sem usá-la nos testes.
- Rodar teste de concorrência/RLS em PostgreSQL local e testar fluxo na Vercel
  com outra conta; conferir que as 12 fotos aparecem e links abrem sem login.
- Concluir verificações de banco e produção, atualizar o PR em rascunho,
  fazer merge e criar a tag somente com evidência real.

`EmprestTI.zip` preexistente e não rastreado ficou fora desta entrega.
