---
description: Procedimento para qualquer mudança de schema
globs: ["prisma/schema.prisma", "prisma/migrations/**", "src/server/**"]
alwaysApply: false
---

# Mudança de schema

## Procedimento

1. Antes de gerar migration, apresentar o DDL pretendido e obter aprovação.
2. Usar Prisma Migrate como único dono do schema, conforme ADR-001. Não usar
   Supabase CLI ou SQL avulso no painel para modificar tabelas de domínio.
3. Toda tabela de domínio nasce com `tenant_id`, RLS habilitado e política
   explícita deny-by-default na mesma migration.
4. Preservar dados existentes com backfill ou defaults quando necessário.
5. Validar migrations em banco de teste; aplicar em produção somente pelo
   workflow manual protegido documentado em `docs/DEVOPS.md`.

## Verificação

`prisma migrate deploy` em banco limpo aplica todas as migrations sem passos
manuais. Testes de isolamento e autorização passam.
