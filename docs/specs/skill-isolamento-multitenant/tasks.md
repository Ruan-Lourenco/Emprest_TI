# Tarefas — Skill de verificação de isolamento multitenant

Status: APROVADO e concluído estruturalmente em 2026-11-05. A descoberta
automática em uma nova sessão do Cursor ainda não foi testada.

- [x] Registrar spec e plano desta mudança de tooling.
- [x] Criar instruções de verificação por procedimento, papel e tenant em
      `.agents/skills/verificar-isolamento-multitenant/SKILL.md`.
- [x] Validar a estrutura da skill e revisar o diff.

## Validação

- `quick_validate.py .agents/skills/verificar-isolamento-multitenant`:
  passou (`Skill is valid!`).
- `git diff --cached --check` no worktree isolado: passou.
- Revisão independente: apontou duas lacunas no texto da skill, corrigidas
  antes do commit. O verificador exige teste com ID de CA e registrou ausência
  dessa evidência automatizada; a entrega foi validada estruturalmente e por
  inspeção documental.
- Testes da aplicação: não se aplicam; nenhum código de produção ou teste foi
  alterado.
