# Spec — Solicitar empréstimo

Status: APROVADA pelo responsável nesta conversa em 2026-11-06.
Verificação integral: pendente conforme `tasks.md`.

## Objetivo e vínculo

Colaborador autenticado solicita imediatamente um equipamento disponível,
sem aprovação ou fila, e vê seus empréstimos. Segue PRD, ADR-001/002 e a spec
aprovada de persistência/autenticação.

## Decisões

- Máximo de **três** empréstimos abertos e prazo de **14 dias corridos**,
  conforme PRD e implementação existente. O briefing de cinco e 14 dias úteis
  conflita com o PRD; mudar isso exige decisão de Operações e revisão do PRD.
- Atraso é `dueAt < now` no servidor. Item em manutenção, emprestado ou fora
  de uso não pode ser solicitado. A resposta deve informar o motivo da recusa.
- `tenant_id` e usuário vêm do contexto, não do cliente. Solicitação usa uma
  transação serializable, atualização condicional de equipamento e constraint
  de um empréstimo aberto por equipamento.
- O catálogo exibe foto, nome, categoria e situação; o crédito Pexels é
  obrigatório conforme ADR-003, apesar do briefing pedir sua remoção.
- A conta do professor não é usada para testes que criem empréstimos.

## Critérios de aceitação

- CA-01: Sem sessão ou vínculo no tenant ativo, solicitar é recusado.
- CA-02: Catálogo mostra foto, nome, categoria, situação e crédito Pexels.
- CA-03: Solicitar item disponível cria um empréstimo com vencimento 14 dias
  depois e muda o item para emprestado em uma operação atômica.
- CA-04: Três abertos impedem nova solicitação; atraso também impede, com
  motivo visível; manutenção e item já emprestado são recusados.
- CA-05: Sob duas solicitações simultâneas ao mesmo item, exatamente uma
  cria empréstimo; o outro recebe conflito.
- CA-06: A lista pessoal mostra apenas empréstimos da pessoa e do tenant,
  com vencimento, e persiste após recarga.

## Fora de escopo desta mudança

Reserva, aprovação, fila, e-mail e renovação. Devolução e tela de Operações
já existem por outra spec e não serão removidas.
