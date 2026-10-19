# Tarefas — Frontend navegável do EmpresTI

Status: CONCLUÍDO em 2026-09-28

Spec relacionada: `docs/specs/frontend-mvp/spec.md`

## Gate de decisão

- [x] Aprovar ou ajustar a spec.
- [x] Aprovar ou ajustar o plano e estas tarefas.
- [x] Aprovar o ADR-001 ou registrar quais decisões dele valem neste incremento.

## Fundação

- [x] Inicializar Next.js, TypeScript estrito e App Router.
- [x] Configurar scripts de typecheck, lint, testes e build.
- [x] Configurar Vitest, Testing Library e Playwright.
- [x] Implementar tokens visuais, tipografia, estilos globais e redução de
  movimento.

## Interface

- [x] Criar componentes compartilhados: shell, sidebar, header, botões, campos,
  pills, cards, tabelas, chips, indicadores e diálogo.
- [x] Implementar `/login` em modo demonstrativo.
- [x] Implementar `/catalogo` com busca e filtros.
- [x] Implementar `/catalogo/[patrimonio]` com confirmação de solicitação.
- [x] Implementar `/meus-emprestimos` com devolução simulada.
- [x] Implementar `/operacoes/emprestimos` com filtros e devolução simulada.
- [x] Implementar `/operacoes/equipamentos/novo` com validação e prévia.
- [x] Adicionar estados vazios, mensagens de erro e indicação persistente de demo.
- [x] Adaptar a composição para larguras menores sem perder operação.

## Evidências

- [x] Testar busca, filtros, diálogo, validação e estado demonstrativo.
- [x] Testar por E2E a jornada principal descrita na spec.
- [x] Revisar teclado, foco, rótulos e comunicação não dependente de cor.
- [x] Verificar ausência de código e chaves exclusivos do servidor no cliente.
- [x] Executar typecheck, lint, testes e build.
- [x] Comparar visualmente as seis rotas com `docs/layout.md`.
- [x] Registrar comandos, resultados e eventuais pendências.

## Resultado da validação

- `npm run typecheck`: passou.
- `npm run lint`: passou sem warnings.
- `npm test`: 2 arquivos e 4 testes passaram.
- `npm run test:e2e`: jornada principal passou no Chromium.
- `npm run build`: passou; oito rotas geradas.
- Revisão visual: login, catálogo, Operações e catálogo móvel conferidos por
  capturas do Playwright.
- `git diff --check` e `git status --short`: não se aplicam porque a pasta
  fornecida não contém metadados de um repositório Git.
