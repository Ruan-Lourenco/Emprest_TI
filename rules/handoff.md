# Handoff de fim de sessão

> Leitor: agente

## Quando

Ao encerrar uma sessão com trabalho em andamento ou quando o responsável pedir
um resumo de retomada. Sobrescreva `handoff.md`; não acumule transcrições.

## Formato

1. **Onde parei:** estado observado em duas ou três frases.
2. **Decisões não óbvias:** somente as ainda não registradas em ADR ou regra;
   para as demais, aponte o arquivo dono.
3. **O que tentei e não funcionou:** falhas e caminhos descartados relevantes.
4. **Próximo passo exato:** uma ação com caminho e condição de conclusão.
5. **Arquivos relevantes:** caminhos, sem copiar o conteúdo.

## Verificação

Compare o handoff com `git status`, specs e checks recentes. Não declare
concluída uma tarefa que `tasks.md` mantém aberta. Não inclua credenciais nem
repita o conteúdo de `AGENTS.md`, rules ou ADRs.
