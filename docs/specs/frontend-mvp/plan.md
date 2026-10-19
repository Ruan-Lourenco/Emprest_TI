# Plano — Frontend navegável do EmpresTI

Status: APROVADO em 2026-09-28

Spec relacionada: `docs/specs/frontend-mvp/spec.md`

## Estratégia

1. Registrar a aprovação do ADR-001 e da stack de apresentação.
2. Inicializar o monólito Next.js com TypeScript estrito, App Router e os
   controles de qualidade previstos no ADR.
3. Criar tokens, estilos globais mínimos e componentes reutilizáveis a partir de
   `docs/layout.md`, sem incorporar recursos externos em runtime.
4. Criar um provedor de demonstração exclusivamente no cliente, com fixtures
   tipadas e aviso explícito de ausência de persistência.
5. Implementar shell, navegação e as seis rotas em incrementos pequenos.
6. Adicionar interações locais de busca, filtros, diálogos, solicitação,
   devolução e cadastro demonstrativos.
7. Cobrir os critérios de aceitação com Vitest, Testing Library e Playwright.
8. Executar typecheck, lint, testes, build, `git diff --check` e revisão visual
   nas dimensões de referência.

## Organização prevista

- `src/app/`: rotas e layouts.
- `src/components/`: componentes visuais e de navegação.
- `src/features/demo/`: fixtures, tipos e estado efêmero da demonstração.
- `src/features/catalogo/`: apresentação e filtros do catálogo.
- `src/features/emprestimos/`: apresentação das solicitações e devoluções.
- `src/features/operacoes/`: telas e formulário de Operações.
- `tests/e2e/`: jornada principal no navegador.

Esses caminhos são uma proposta e só serão materializados depois da aprovação.
Nenhuma camada deste incremento acessará dados remotos.

## Validação

- Comparação visual com as seis páginas de `docs/layout.md`.
- Testes dos comportamentos enumerados na spec.
- Busca estática por imports de Supabase, Prisma e termos de chave de serviço em
  módulos alcançáveis pelo cliente.
- Registro dos comandos e resultados de validação ao concluir.

## Riscos e contenções

- **Demo confundida com produto real:** aviso persistente e textos que dizem
  claramente que não há persistência.
- **Regras duplicadas no cliente:** lógica demonstrativa isolada e descartável;
  regras definitivas serão implementadas em services quando houver spec própria.
- **Divergência visual:** componentes e tokens centralizados, com revisão por
  captura de tela.
- **ADR ainda não aprovado:** nenhuma inicialização ou dependência será criada
  antes da decisão explícita.
