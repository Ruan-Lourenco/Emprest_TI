# Plano — Autenticação e persistência

Status: APROVADO em 2026-10-19.

## Correção de estabilidade observada em produção (2026-11-09)

- Garantir no runtime Prisma os parâmetros do Supavisor transaction pooler
  definidos no ADR-001, mesmo se a URL de deploy omitir os parâmetros.
- Mostrar falha de carregamento no catálogo e em Meus empréstimos sem expor
  detalhes internos, em vez de apresentar uma lista vazia como dado verdadeiro.
- Verificar os dois casos localmente e repetir o fluxo autenticado no deploy
  após a publicação pelo processo aprovado.

1. Resolver a divergência de ferramenta de migration e fechar o provisionamento
   do primeiro usuário de Operações.
2. Modelar tenant, vínculo de usuário, equipamento, empréstimo e auditoria em
   migration versionada, com índices, constraints e RLS na mesma migration.
3. Aplicar a migration pelo fluxo aprovado, sem SQL avulso no painel.
4. Integrar Supabase Auth ao Next.js e resolver sessão, tenant e papel no
   contexto de cada request.
5. Implementar serviços transacionais e procedimentos tRPC para catálogo,
   empréstimos, devoluções e cadastro de equipamentos.
6. Substituir o estado demonstrativo pelas consultas e mutações da API nas telas
   existentes. Manter estados de loading, erro e vazio.
7. Testar autenticação, autorização, isolamento entre tenants, concorrência e
   persistência. Atualizar documentação operacional.

## Dependências

- `DATABASE_URL` e `DIRECT_URL` válidas no ambiente onde a migration será
  executada; nunca registrá-las na documentação ou em logs.
- Conta convidada e procedimento definido para o primeiro acesso de Operações.
- Corrigir o fluxo de migration conflitante antes de alterar schema remoto.
