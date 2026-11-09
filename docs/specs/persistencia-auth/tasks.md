# Tarefas — Autenticação e persistência

Status: PLANO APROVADO em 2026-10-19; EXECUÇÃO PARCIAL. As tarefas abertas
impedem o veredito de spec pronta.

## Correção de estabilidade observada em produção (2026-11-09)

- [x] CA-01/03/04: normalizar `DATABASE_URL` do Supavisor na porta 6543 para
  `pgbouncer=true&connection_limit=1`, sem modificar conexões diretas.
- [x] CA-03/04: exibir carregamento ou erro nas listas quando a consulta falhar;
  não apresentar zero registros como resultado de uma falha de banco.
- [ ] CA-01/03/04/09: validar testes, tipos, lint, build e o fluxo no deploy
  após publicação. O erro observado foi `prepared statement "s3" does not exist`.

Validação local da correção: `npm run typecheck` passou; `npm run lint` passou;
`npm test -- --maxWorkers=4` passou (9 arquivos, 31 testes); `npm run build`
passou. O fluxo remoto continua pendente.

- [x] Resolver decisões pendentes na spec e aprovar a modelagem do banco.
- [x] Criar migration versionada com constraints, RLS e auditoria.
- [ ] Validar migration em banco de teste e aplicar pelo fluxo aprovado. A
      validação local passou; aplicação remota depende do fluxo protegido.
- [x] Integrar login, sessão, proteção de rotas e logout.
- [x] Criar contexto tRPC com identidade, tenant e papel verificados.
- [x] Implementar catálogo e cadastro persistentes.
- [x] Implementar solicitação e devolução transacionais.
- [x] Conectar telas à API e remover mensagens de demonstração.
- [ ] Testar regras, autorização, isolamento, concorrência e recarga. Os testes
      locais passaram; falta validar login real com conta provisionada.
- [x] Executar typecheck, lint, testes e build; documentar resultados.

## Validação local em 2026-10-19

- `npx prisma migrate deploy` em PostgreSQL local limpo com schema Auth mínimo: passou.
- `npm run test:db`: passou (persistência, isolamento, conflito, concorrência,
  paginação e devolução).
- Verificação RLS com papel sem privilégios de dono: leitura direta retornou 0
  registros apesar de haver equipamento no banco.
- `npm run typecheck`: passou.
- `npm run lint`: passou.
- `npm test -- --maxWorkers=1`: 7 testes passaram.
- `npm run test:e2e`: 1 teste passou (redirecionamento sem sessão e validação
  do login).
- `npm run build`: passou após mover o cache `.next` bloqueado pelo OneDrive.

Pendências externas: migration remota pelo workflow protegido, criação da conta
inicial no Supabase Auth, vínculo pelo workflow de bootstrap e variáveis na
Vercel. Login real e persistência remota ainda não foram validados.

Limite aprovado: `src/server/api/trpc.ts` resolve apenas o tenant `suporte_ti`,
conforme `docs/adr/002-selecao-tenant.md`. Troca entre vínculos está fora da v1.
