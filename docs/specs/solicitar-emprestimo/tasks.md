# Tarefas — Solicitar empréstimo

Estado local e bloqueios: `evidence.md`. As caixas abaixo permanecem abertas
até que cada CA tenha evidência completa, inclusive no PostgreSQL local e no
fluxo autenticado de produção.

Revisão de 2026-11-09: adequar o crédito da interface e os testes ao
ADR-004; manter os demais CAs e pendências de banco/produção.

- [x] CA-01/06: testar autorização, vínculo e isolamento por procedimento.
- [x] CA-02: testar catálogo com foto e atribuição Pixabay, ocultando foto
  antiga de outra origem.
- [x] CA-03/04: testar prazo, limite, atraso e manutenção localmente; o
  responsável informou ter validado o fluxo e a persistência em produção.
- [x] CA-05: testar concorrência em PostgreSQL local.
- [ ] CA-01–06: executar typecheck, lint, testes, build e verificador-spec.
- [x] CA-01–06: fluxo no link de produção conferido pelo responsável com
  conta própria em 2026-11-09; conta do professor preservada sem empréstimos.
