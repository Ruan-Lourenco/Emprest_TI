# Testes — evidência de comportamento

> Leitor: agente

## Quando

Antes de escrever ou alterar testes e antes de declarar um critério de
aceitação atendido.

## Ferramentas e escopo

- `npm test` executa Vitest para services, procedimentos e componentes; os
  componentes usam Testing Library.
- `npm run test:e2e` executa Playwright para fluxos de interface.
- `npm run test:db` executa o roteiro de integração em PostgreSQL local; o
  script recusa `DATABASE_URL` cujo host não seja `localhost` ou `127.0.0.1`.
  Antes de executá-lo, confirme que o banco local existe e contém o schema de
  teste. Não use o Supabase remoto como ambiente de teste.

## Rastreabilidade

Para specs novas ou alteradas, cada critério recebe um ID `CA-xx`. O nome do
teste ou a seção de evidência deve citar esse ID e o cenário coberto. Um teste
que cobre apenas parte de um CA é evidência parcial, não aprovação do CA.
Critérios antigos sem IDs devem ser identificados quando a spec for revisada;
não renomeie testes apenas para aparentar cobertura.

Teste de service prova a regra isolada. Teste de procedimento com
`appRouter.createCaller` prova middleware e contexto. Constraint, transação,
concorrência e RLS exigem PostgreSQL local ou efêmero real; mocks e inspeção
visual não provam essas propriedades. Teste RLS com papel sujeito às policies,
pois a conexão proprietária pode ignorá-las conforme o ADR-001.

## Conclusão

Relacione cada CA ao teste e à evidência observada. Informe comandos e
resultados; marque `SEM TESTE`, `PARCIAL` ou `BLOQUEADO` quando couber. Siga
`rules/checks.md` para a verificação final.
