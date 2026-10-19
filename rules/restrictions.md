# Restrictions — limites de atuação

Estas restrições valem em toda tarefa neste repositório. Procedimentos em outros
arquivos de `rules/` não podem ampliar a autoridade definida aqui.

## Autoridade

- Não trate decisões marcadas como `RASCUNHO` ou `PENDENTE` como aprovadas.
- Não decida regras de negócio, permissões ou escolhas de arquitetura que o PRD
  e os ADRs não fecharam. Registre a pergunta e as alternativas para decisão do time.
- Não declare um ADR aprovado por conta própria. Uma proposta pode ser redigida
  como rascunho, com as decisões ainda abertas identificadas.
- Não substitua uma escolha arquitetural registrada sem apresentar o conflito e
  atualizar o ADR correspondente antes da implementação.

## Escopo e ritmo

- Não altere arquivos fora do escopo da tarefa sem explicar a dependência.
- Não implemente comportamento de produto sem `spec.md`, `plan.md` e `tasks.md`
  correspondentes. A preparação técnica sem comportamento de produto deve ser
  rastreada ao ADR e a critérios verificáveis.
- Não apresente uma tarefa como concluída se algum critério de aceitação ou
  verificação exigida falhou. Informe o resultado e o que permanece pendente.

## Segredos e dados

- Não invente, solicite, exponha ou versione credenciais, tokens ou senhas.
- Não registre segredos ou dados pessoais em código, documentação, testes, logs,
  mensagens de erro, commits ou respostas. Use apenas placeholders em
  `.env.example`.
- Não versione arquivos `.env` reais nem coloque chaves de serviço em variáveis
  `NEXT_PUBLIC_*` ou em código enviado ao navegador.
- Não contorne uma falha de autorização usando uma credencial mais privilegiada.
  Registre o problema e corrija a política ou o fluxo autorizado.

## Publicação e dados remotos

- Não faça push direto para `main`. Trabalhe em branch e use pull request.
- Não altere schema ou dados do Supabase remoto diretamente pelo painel, CLI ou
  SQL avulso. Mudanças de schema seguem migrations versionadas e o fluxo de
  aplicação definido em `docs/DEVOPS.md`.
- Não execute deploy, migration de produção ou mudança de configuração remota
  como consequência implícita de uma tarefa de documentação ou código. Essas
  ações precisam fazer parte do pedido ou de um plano aprovado.

## Precedência

- Se código e spec divergirem sobre comportamento, siga a spec vigente e
  registre a divergência antes de alterar o código.
- Se spec, ADR e regras entrarem em conflito, exponha o conflito; não escolha
  silenciosamente qual ignorar.
