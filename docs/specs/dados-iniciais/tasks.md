# Tarefas — Dados iniciais

Estado local e bloqueios: `evidence.md`. As caixas abaixo permanecem abertas
até que cada CA tenha evidência completa, inclusive no ambiente de produção.

Revisão de 2026-11-09: trocar Pexels por Pixabay em skill, scripts, migration,
seed, créditos, testes e operação antes de preparar fotos. Registrar no
`ENTREGA.md` a diferença entre o HTML original e a orientação atualizada
para Pixabay, confirmada pelo responsável.

- [x] CA-01/02/03: skill, script de preparação, manifesto e revisão visual; verificar 12 arquivos 800×600 e URLs públicas. Evidência em `evidence.md`.
- [x] CA-04: migration e seed em PostgreSQL local; workflows de produção
  concluídos, com seed executado duas vezes. Contagem de 12 itens e ausência
  de duplicatas comprovadas por captura do Supabase e constraint de unicidade.
- [x] CA-05: conta Auth vinculada, senha definida administrativamente pelo
  responsável sem versioná-la; login e zero empréstimos conferidos por ele,
  com captura da Vercel entregue para revisão independente.
- [x] CA-06: catálogo/detalhe e testes da atribuição Pixabay e ocultação da
  origem antiga; fotos em produção conferidas pelo responsável.
- [x] CA-01–06: testes específicos, lint e build do CI passaram; typecheck foi
  coberto pelo build do CI. Verificador-spec final executado após as capturas;
  evidências registradas em `evidence.md`.
- [x] CA-03/04/05: execução humana em produção e conferência no link Vercel,
  conforme relato do responsável em 2026-11-09 e workflows em `evidence.md`.
