# Tarefas — Solicitar empréstimo

Estado local e bloqueios: `evidence.md`. As caixas abaixo permanecem abertas
até que cada CA tenha evidência completa, inclusive no PostgreSQL local e no
fluxo autenticado de produção.

Revisão de 2026-11-09: adequar o crédito da interface e os testes ao
ADR-004; manter os demais CAs e pendências de banco/produção.

- [ ] CA-01/06: testar autorização, vínculo e isolamento por procedimento.
- [ ] CA-02: testar catálogo com foto e atribuição Pixabay, ocultando foto
  antiga de outra origem.
- [ ] CA-03/04: testar prazo, limite, atraso, manutenção e persistência.
- [ ] CA-05: testar concorrência em PostgreSQL local.
- [ ] CA-01–06: executar typecheck, lint, testes, build e verificador-spec.
- [ ] CA-01–06: conferir fluxo no link de produção com conta própria.
