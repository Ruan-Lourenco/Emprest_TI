# Handoff

## Onde parei

A prática de SDD está implementada **parcialmente** na branch
`feat/pratica-sdd-subagentes`: specs, ADR-003, skill Pexels, migration,
seed, interface, testes e workflows manuais foram preparados. Fotos reais,
Storage, migration/seed remoto, conta convidada e teste autenticado em produção
seguem sem evidência; as duas specs permanecem NÃO PRONTAS.

## Decisões não óbvias

Conflitos e lacunas estão em `ENTREGA.md`; ADR-003 decide metadados das fotos.
A chave Pexels é lida de arquivo local fora do repositório, sem nova variável
de ambiente. O professor deve ser vinculado como `collaborator`.

## O que tentei e não funcionou

A página de login Vercel respondeu HTTP 200, mas não houve login real. A
automação do Chrome parou por não conseguir confirmar a URL atual; não foi
usada para criar PR. Sem chave Pexels local não foi possível gerar imagens.
Não há PostgreSQL local comprovado para `npm run test:db`.

## Próximo passo exato

Depois de reunir uma chave Pexels em arquivo local fora do repositório,
executar `node scripts/prepare-equipment-photos.mjs <caminho-absoluto>`;
conferir visualmente as 12 fotos, produzir `data/fotos-aprovadas.json` e
validar com `node scripts/validate-equipment-photos.mjs` antes do upload humano.
Para o restante da sequência protegida, seguir `docs/OPERACAO-PRATICA.md`.

## Arquivos relevantes

- `ENTREGA.md`
- `docs/specs/dados-iniciais/`
- `docs/specs/solicitar-emprestimo/`
- `.agents/skills/imagens-equipamentos/`
- `docs/OPERACAO-PRATICA.md`
