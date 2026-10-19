# DevOps — Passo 0

## Objetivo

Controlar a entrega da aplicação e as mudanças de banco sem expor credenciais.

## Fluxo de entrega

```text
branch curta → pull request → Architecture checks → revisão → main → Vercel
                                              └→ migrate-production (manual e protegido)
```

## Controles configurados

| Controle | Implementação | Estado no passo 0 |
| --- | --- | --- |
| Verificação de arquitetura | `.github/workflows/architecture.yml` | Ativa em PR e `main` |
| Detecção de segredos | Gitleaks no workflow | Ativa |
| Proteção de `.env` | `.gitignore` + validação no CI | Ativa |
| Atualização de dependências | Dependabot semanal | Preparada |
| Mudança de banco | workflow manual no Environment `production` | Migration Prisma versionada |
| Bootstrap de Operações | workflow manual no Environment `production` | Usuário Auth criado antes do vínculo |
| Deploy de aplicação | Vercel | Configuração do projeto ainda necessária |
| Observabilidade | Sentry | Não conectado; sem DSN |

## Configuração pendente e deliberada

Antes do primeiro deploy, o responsável deve:

1. Conectar o projeto Vercel ao repositório e cadastrar as variáveis do `.env.example` por ambiente.
2. Criar o projeto Supabase em `sa-east-1`, sem versionar credenciais.
3. Criar o Environment `production` no GitHub, restringir aprovação a responsáveis e cadastrar `DATABASE_URL`, `DIRECT_URL` e `BOOTSTRAP_OPERATIONS_USER_ID` como secrets. O último é o UUID de uma conta já criada no Supabase Auth; não o escreva em logs ou documentação.
4. Habilitar proteção de `main`: pull request obrigatório, uma aprovação, conversas resolvidas e status check `Documentation and secret guard`.
5. Configurar a integração do Sentry depois da feature que introduzir o runtime.

O workflow de migrations não dispara automaticamente. Ele só é executável manualmente, com confirmação literal `APPLY`, e usa o Environment protegido. Após a migration, execute o workflow de bootstrap, também manual e protegido. O seed cria `suporte_ti` de forma idempotente e vincula a conta Auth informada como Operações.

No Supabase Auth, desabilite cadastro público e crie a primeira conta pela administração. Crie contas adicionais somente por convite e vincule cada UUID a um tenant e papel por um fluxo administrativo aprovado. Não há cadastro aberto na aplicação.

Na Vercel, cadastre `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `DATABASE_URL` e `DIRECT_URL` em cada ambiente. `DIRECT_URL` é usada na geração do Prisma Client durante o build e nas migrations protegidas; os requests usam `DATABASE_URL`. Faça novo deploy após alterar variáveis.

## Política operacional

- Não há deploy direto a partir de branches de feature.
- Migrations entram somente após uma spec aprovada e são aplicadas uma vez por execução explícita.
- `DATABASE_URL`, `DIRECT_URL`, `SUPABASE_SERVICE_ROLE_KEY` e tokens Sentry são secretos e exclusivos de servidor.
- Uma alteração que necessite novas variáveis deve atualizar `.env.example`, a documentação e o ambiente do provedor na mesma entrega.
