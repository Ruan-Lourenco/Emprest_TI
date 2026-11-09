# Plano — Alinhamento do harness e da documentação

Status: APROVADO.

Spec: `docs/specs/alinhamento-harness/spec.md`.

1. Corrigir caminhos, escopo e gatilhos de `rules/spec-flow.md`; completar as
   regras de testes, operação e handoff sem duplicar restrições permanentes.
2. Manter a skill de isolamento em `.agents/skills/`, descoberta pelo Codex, e
   anunciar seu uso ao Cursor por `AGENTS.md`.
3. Configurar o verificador de spec em cada harness a partir de uma instrução
   canônica, e ajustar sua resposta para evidência parcial.
4. Alinhar `AGENTS.md`, handoff e status com o código e as pendências remotas;
   registrar a limitação de seleção de tenant sem decidir um fluxo novo.
5. Conferir referências, metadados e diff. Instalar dependências locais se
   necessário e executar typecheck, lint, testes e build sem acesso ao banco
   remoto. Registrar os resultados em `tasks.md`.

Nenhuma etapa altera código de produção ou configuração remota.
