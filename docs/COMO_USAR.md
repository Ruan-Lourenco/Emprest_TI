# Como executar e usar o EmpresTI

## Pré-requisitos

- Node.js LTS e npm.
- Projeto Supabase ativo com Auth e PostgreSQL.
- `.env` local preenchida a partir de `.env.example`. Nunca versione esse arquivo.
- Migration aplicada pelo fluxo protegido de `docs/DEVOPS.md`.
- Conta criada no Supabase Auth e vinculada ao tenant `suporte_ti`.

## Desenvolvimento

Na raiz do projeto:

```powershell
npm ci
npm run db:generate
npm run dev
```

Abra `http://localhost:3000`. Faça login com sua conta convidada. O catálogo,
as solicitações, devoluções e cadastros usam o banco; alterações persistem após
recarregar a página.

Operações pode ver todos os empréstimos da área e cadastrar equipamentos.
Colaboradores veem seus próprios empréstimos. O servidor aplica limite de três
itens, prazo de 14 dias, bloqueio por atraso e indisponibilidade de itens em
manutenção.

## Primeiro acesso

1. No Supabase Auth, desabilite cadastro público e crie a conta inicial pela
   administração. Não coloque senha ou dados pessoais em arquivos versionados.
2. Configure o UUID da conta como secret `BOOTSTRAP_OPERATIONS_USER_ID` no
   GitHub Environment `production`.
3. Aplique a migration pelo workflow `Migrate production database` após merge
   da branch aprovada.
4. Execute `Bootstrap operations access` com confirmação `APPLY`.
5. Faça login. Se a conta não tiver vínculo, o sistema recusará o acesso.

## Validação local

```powershell
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
```

Para testar persistência e isolamento em um PostgreSQL local com migration
aplicada, sobrescreva `DATABASE_URL` somente no processo do teste e execute
`npm run test:db`. O script recusa URLs que não apontem para `localhost`.

## Problemas comuns

- Erro de conexão: confira a URL do pooler na porta 6543 para `DATABASE_URL` e
  a conexão de migration em `DIRECT_URL`. Senhas com caracteres reservados
  precisam estar codificadas na URL.
- Login aceito pelo Supabase, mas acesso recusado: a conta ainda precisa de
  vínculo em `memberships` pelo fluxo aprovado.
- Alteração de variável na Vercel: faça novo deploy para que ela entre em vigor.
