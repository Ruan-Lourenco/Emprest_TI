# Tarefas — Autenticação e persistência

Status: APROVADO em 2026-10-19.

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
