# Spec — Autenticação e persistência

Status: APROVADO em 2026-10-19, após aprovação do DDL e das decisões de
migration e provisionamento pelo responsável.

## Objetivo

Substituir a demonstração local por dados persistidos no PostgreSQL do Supabase e
login real por e-mail e senha, mantendo os fluxos e as regras aprovadas no PRD.

## Comportamento

- Usuários convidados entram com Supabase Auth. Usuários sem vínculo ativo com o
  tenant não acessam dados do sistema.
- O catálogo exibe equipamentos do tenant do usuário, incluindo situação real.
- Um colaborador vê seus empréstimos e pode solicitar item disponível e devolver
  item sob sua responsabilidade.
- A solicitação grava empréstimo e altera a disponibilidade de forma atômica.
  Respeita limite de três itens abertos, prazo de 14 dias e bloqueio por atraso.
- Operações vê os empréstimos do tenant, registra devoluções recebidas e cadastra
  equipamentos. O servidor verifica o papel em cada operação.
- Recarregar a página mantém os dados gravados. Erros de autenticação, permissão,
  conflito de solicitação e indisponibilidade do banco são mostrados sem vazar
  detalhes sensíveis.
- Dados de demonstração não são importados automaticamente.

## Segurança e dados

- `tenant_id` vem da sessão e do vínculo armazenado no banco, nunca do cliente.
- Todas as consultas e mutações filtram pelo tenant. RLS fica habilitado e fechado
  por padrão para as tabelas de domínio.
- A API usa tRPC, serviços e Prisma conforme ADR-001. A chave de serviço do
  Supabase não vai ao navegador.
- Mutações críticas registram ator, tenant, ação e recurso em auditoria.

## Decisões

- Prisma Migrate é o único dono do schema, conforme ADR-001 e decisão do
  responsável. A regra conflitante de migration será alinhada.
- O primeiro usuário é criado no Supabase Auth e vinculado ao tenant
  `suporte_ti` com papel `operations` pelo seed idempotente aprovado no ADR.
- Nome e departamento são opcionais no vínculo. Na falta deles, a interface
  mostra um identificador reduzido do usuário, sem inventar dados pessoais.
- O DDL de tenants, memberships, equipment, loans e audit_logs apresentado ao
  responsável foi aprovado. Os dados demonstrativos não serão importados.

## Critérios de aceitação

1. Login com conta convidada válida abre o catálogo; credencial inválida não
   abre sessão; logout encerra a sessão.
2. Acesso sem sessão e sem vínculo é recusado na interface e em todo procedimento.
3. Equipamento cadastrado continua no catálogo após recarga e nova sessão.
4. Solicitação e devolução persistem após recarga e preservam consistência entre
   equipamento e empréstimo mesmo sob duas solicitações simultâneas.
5. Limite de três itens, bloqueio por atraso e manutenção são impostos no servidor.
6. Um usuário não vê empréstimos de outro; Operações vê apenas seu tenant.
7. Um tenant não lê nem modifica registros de outro, em cada procedimento.
8. Colaborador não cadastra equipamentos nem registra devoluções de terceiros.
9. Typecheck, lint, testes, build e testes dos fluxos críticos passam.

## Fora de escopo

- Reserva futura, notificações por e-mail e importação da planilha.
- Publicação na Vercel e configuração de segredos remotos.
