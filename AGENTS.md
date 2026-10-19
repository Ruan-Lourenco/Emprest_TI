# AGENTS.md — Como trabalhar neste repositório

## Objetivo

O EmpresTI é um sistema interno para controlar o empréstimo de equipamentos de
TI. Este repositório utiliza SDD repo-native/manual: decisões e comportamento
devem ser registrados antes da implementação.

## Fontes de verdade

Consulte os documentos nesta ordem, conforme o tipo de decisão:

1. `rules/` — restrições permanentes, especialmente segurança e segredos.
2. `docs/PRD.md` — problema, público, escopo e regras de negócio aprovadas.
3. `docs/adr/` — decisões arquiteturais e suas consequências.
4. `docs/specs/<feature>/spec.md` — comportamento e critérios de aceitação da
	 feature.
5. `docs/layout.md` — referência visual do produto.
6. Código e testes — implementação e evidências do comportamento especificado.

Se houver conflito, não esconda a divergência: registre-a e peça a decisão
apropriada. Uma decisão marcada como `RASCUNHO`, `PENDENTE` ou equivalente não
deve ser tratada como aprovada.

## Fluxo obrigatório de mudança

Toda feature deve seguir:

`SPEC → PLAN → TASKS → CODE → TESTS`

1. Criar ou atualizar `docs/specs/<feature>/spec.md`.
2. Definir `plan.md` e `tasks.md` na mesma pasta.
3. Obter aprovação antes de escrever código de produção.
4. Implementar somente o que a spec e as decisões aprovadas exigem.
5. Validar cada critério de aceitação com testes ou outra evidência verificável.
6. Atualizar documentação afetada e registrar os comandos de validação no PR.

Não implemente uma feature apenas a partir de uma issue, conversa ou ideia
solta. Se a mudança alterar comportamento, comece pela spec. Se alterar uma
decisão técnica, atualize ou crie um ADR antes do código.

## Regras de implementação

- Não invente regras de negócio, permissões, estados ou valores padrão.
- Preserve as fronteiras definidas pela arquitetura aprovada: monólito Next.js,
	tRPC, services, Prisma e PostgreSQL no Supabase.
- Valide entradas na fronteira do procedimento e mantenha regras de negócio em
	services testáveis.
- Centralize sessão, `tenant_id` e `role` no contexto de request; nunca confie
	apenas em dados enviados pelo cliente.
- Toda operação que acessar dados deve respeitar o isolamento entre tenants e as
	políticas RLS deny-by-default.
- Não crie um segundo caminho de mutação ou acesso a dados sem atualizar o ADR.
- Preserve o sistema visual definido em `docs/layout.md`.

## Segurança e configuração

- Nunca invente, solicite ou versione credenciais, tokens, senhas ou dados
	pessoais.
- Nunca versione `.env`; use somente placeholders em `.env.example`.
- Variáveis `NEXT_PUBLIC_*` podem chegar ao navegador. Chaves de serviço,
	URLs privadas e tokens são exclusivos do servidor.
- Não inclua segredos em specs, PRDs, ADRs, issues, logs ou mensagens de erro.
- Uma nova variável de ambiente exige atualização de `.env.example`, da
	documentação afetada e da configuração do provedor na mesma entrega.

## Qualidade e revisão

- Mantenha mudanças pequenas, rastreáveis à spec e compatíveis com o ADR.
- Adicione ou atualize testes proporcionais ao risco da mudança.
- Valide tipos, lint, testes e critérios de aceitação antes de abrir o PR.
- Considere explicitamente autorização, isolamento entre tenants, estados de
	erro, concorrência e dados sensíveis em mudanças de servidor.
- Não faça refatorações ou correções não relacionadas no mesmo PR.
- O PR deve informar a spec relacionada, os comandos executados e seus
	resultados.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
