# Spec — Alinhamento do harness e da documentação

Status: APROVADA.

## Objetivo

Fazer as instruções do repositório apontarem para arquivos reais, permitir que a
skill e o verificador de spec sejam encontrados no Codex e no Cursor, e deixar
o estado do produto e da validação descrito sem contradições.

## Vínculo

- PRD: `docs/PRD.md`, sem mudança de comportamento do produto.
- Arquitetura: `docs/adr/001-stack.md`.
- Regras: `rules/restrictions.md`, `rules/checks.md` e `rules/migration.md`.

## Regras

1. Spec de comportamento é exigida para feature ou mudança de comportamento.
   Trabalho de documentação e operação usa escopo e verificação proporcionais.
2. Instruções não devem apontar para arquivos ausentes nem afirmar que uma
   decisão pendente ou validação não executada foi concluída.
3. A skill de isolamento tem uma fonte versionada no projeto; arquivos próprios
   de cada ferramenta podem apontar para essa fonte, sem manter cópias do corpo.
4. O verificador de spec opera em contexto separado, sem editar, e informa
   critérios sem teste ou com evidência parcial.
5. A ativação remota continua pendente. O responsável decidiu usar apenas
   `suporte_ti` nesta versão; nenhuma alteração remota faz parte desta entrega.

## Critérios de aceitação

- CA-01: todos os caminhos locais citados pelo fluxo SDD resolvem para arquivos
  existentes ou estão claramente marcados como opcionais/futuros.
- CA-02: a regra de testes descreve as ferramentas e comandos atuais, exige
  rastreabilidade dos CAs novos e diferencia teste unitário de prova com banco.
- CA-03: a skill de isolamento tem `SKILL.md` válido, uma fonte no repositório
  e instrução de descoberta tanto para Codex quanto para Cursor.
- CA-04: o subagente verificador tem configuração para Codex e Cursor, recebe
  a spec e o escopo da verificação e não declara pronta uma spec sem evidência.
- CA-05: `AGENTS.md`, handoff e documentação de status concordam sobre o que
  está implementado localmente e o que ainda depende de ambiente remoto.
- CA-06: o comportamento atual de tenant único está registrado como decisão
  aprovada no ADR-002, sem alegar troca entre vínculos nesta versão.
- CA-07: verificações locais aplicáveis são executadas e seus resultados reais
  registrados, incluindo eventuais bloqueios de ambiente.

## Fora de escopo

- Mudanças em comportamento de produto, schema, políticas RLS ou ambiente remoto.
- Deploy, migration remota, bootstrap de usuário e cadastro de segredos. O
  responsável autorizou posteriormente commit e push desta correção na branch
  atual; isso não autoriza merge nem publicação de ambiente remoto.
- Aprovar automaticamente a spec `persistencia-auth`, que ainda contém tarefas
  abertas e validações remotas pendentes.

## Contrato afetado

Instruções e documentação do repositório. Nenhum endpoint ou tabela muda.
