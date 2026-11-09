# ADR-002 — Seleção do tenant ativo

Status: APROVADO pelo responsável nesta conversa em 2026-11-05.

## Contexto

O ADR-001 prevê que uma pessoa possa ter vínculos com mais de um tenant. Hoje
`src/server/api/trpc.ts` busca apenas o vínculo com o tenant `suporte_ti`.
Isso atende ao primeiro tenant do projeto, mas não define como escolher outro
vínculo nem como preservar essa escolha de forma segura entre requests.

## Decisão

Nesta versão, somente o tenant `suporte_ti` fica ativo na aplicação. A conta
precisa ter vínculo com ele para acessar o sistema. Não há escolha de tenant
na interface. O contexto de request mantém a busca por esse vínculo no banco;
um `tenant_id` enviado pelo cliente não concede acesso.

## Alternativa descartada nesta versão

- Oferecer seleção explícita entre vínculos ativos e guardar o identificador
  escolhido na sessão, validando-o novamente em cada request. Adiada porque a
  primeira versão opera somente a área `suporte_ti`.

## Consequências

O sistema não atende usuários vinculados apenas a outros tenants, embora o
schema suporte esses registros. Se outra área entrar no produto, uma nova spec
deverá definir seleção, sessão, autorização e testes antes de alterar o código.
