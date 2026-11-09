# Handoff

## Onde parei

Em 2026-11-09, os PRs #19 e #27 já estavam incorporados em `main`. Os
workflows protegidos de migration, dois seeds e vínculo Auth concluíram com
sucesso; o responsável informou que validou o fluxo da Vercel após a correção
do pooler, mantendo a conta do professor sem empréstimos. Esta branch
`codex/finalize-practice-docs` atualiza specs, evidências e `ENTREGA.md`.
Dois testes foram adicionados e passaram; o responsável forneceu as duas
capturas remotas. A revisão independente final aceitou CA-01 a CA-06 nas duas
specs, agora **PRONTAS**. O lint e os testes específicos passaram; o typecheck
foi repetido fora do OneDrive e terminou com código zero; o build do PR #28
também passou.

## Decisões não óbvias

- A orientação atualizada da turma usa Pixabay apesar de o HTML original
  mencionar Pexels; ver ADR-004 e `ENTREGA.md`.
- O responsável definiu senha na conta Auth existente pela API administrativa
  após convite e conferência de UUID/e-mail. O segredo não está versionado;
  ver `docs/specs/dados-iniciais/spec.md`.
- As verificações remotas de catálogo, limite e zero empréstimos foram
  informadas pelo responsável. Links de workflow e evidência local estão nos
  diretórios das specs; não existe captura da repetição bem-sucedida.

## O que tentei e não funcionou

O primeiro teste autenticado do responsável encontrou falha intermitente
`prepared statement "s3" does not exist`; o PR #27 corrigiu o runtime e o
responsável informou que o deploy posterior funciona. A tentativa anterior
de vínculo Auth que falhou não foi usada como evidência de conclusão.

## Próximo passo exato

Incorporar a documentação final em `main` e criar a tag `entrega-pratica` no
commit final. Não reabrir as specs sem nova mudança de comportamento.

## Arquivos relevantes

- `ENTREGA.md`
- `docs/OPERACAO-PRATICA.md`
- `docs/specs/dados-iniciais/{spec,tasks,evidence}.md`
- `docs/specs/solicitar-emprestimo/{spec,tasks,evidence}.md`
- `docs/specs/persistencia-auth/{spec,tasks,evidence}.md`

`EmprestTI.zip` preexistente e não rastreado permanece fora da entrega.
