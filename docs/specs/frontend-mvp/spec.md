# Spec — Frontend navegável do EmpresTI

Status: APROVADO em 2026-09-28

## Objetivo

Disponibilizar uma interface navegável para validar os fluxos e o sistema visual
do EmpresTI antes da implementação de autenticação, banco e API.

## Escopo

O incremento cobre as seis telas definidas em `docs/layout.md`:

1. Login.
2. Catálogo de equipamentos.
3. Detalhe do equipamento e confirmação de solicitação.
4. Meus empréstimos.
5. Operações — empréstimos em aberto.
6. Operações — cadastro de equipamento.

A interface usa dados locais de demonstração, sem persistência, autenticação ou
acesso ao Supabase. O modo demonstrativo deve estar claramente indicado e não
pode importar cliente de banco nem chave de serviço.

## Comportamento proposto

- A tela de login valida o preenchimento dos campos e permite entrar apenas no
  modo demonstrativo; não afirma que uma sessão real foi criada.
- A navegação entre as seis telas funciona por rotas reais do Next.js.
- O catálogo permite busca por nome ou patrimônio, filtro por categoria e filtro
  de disponibilidade sobre os dados demonstrativos.
- Um equipamento disponível abre o detalhe e o diálogo de confirmação.
- A confirmação simula a solicitação somente no estado em memória da interface
  e informa que a alteração não será persistida.
- Meus empréstimos permite simular uma devolução no estado em memória, mediante
  confirmação.
- Operações permite filtrar os empréstimos exibidos e simular uma devolução.
- O cadastro valida os campos visíveis, atualiza a prévia enquanto o usuário
  digita e simula a inclusão do item na sessão atual.
- Estados vazios, erros de validação e ações desabilitadas são perceptíveis e
  acessíveis por teclado.
- As regras visíveis de limite de três itens, prazo de 14 dias, bloqueio por
  atraso e indisponibilidade em manutenção seguem o PRD. Neste incremento elas
  servem apenas para demonstração; a futura implementação definitiva pertence
  aos services do servidor.

## Requisitos visuais e de acessibilidade

- Reproduzir tokens, componentes, densidade, textos e hierarquia de
  `docs/layout.md` na largura de referência de 1440 px.
- Usar HTML semântico, rótulos associados aos campos, foco visível e diálogo com
  foco controlado.
- Não depender apenas de cor para comunicar estado.
- Respeitar `prefers-reduced-motion`.
- Em larguras menores, preservar leitura e operação sem sobreposição ou corte de
  controles; a composição pode trocar colunas por empilhamento.

## Critérios de aceitação

1. A aplicação inicia localmente por comando documentado e todas as seis rotas
   abrem sem erro.
2. É possível percorrer por teclado o fluxo login demonstrativo → catálogo →
   detalhe → confirmação → meus empréstimos.
3. Busca e filtros do catálogo alteram os itens exibidos e oferecem estado vazio.
4. Solicitação e devolução simuladas atualizam contadores e listas durante a
   sessão, sem chamada de rede e com aviso de não persistência.
5. O formulário de cadastro impede envio inválido, mostra mensagens junto aos
   campos e atualiza a prévia.
6. A área de Operações expõe os empréstimos demonstrativos, filtros e ação de
   devolução simulada.
7. Nenhum segredo, cliente do Supabase, acesso Prisma ou variável exclusiva de
   servidor aparece no bundle do navegador.
8. Testes de componente cobrem busca/filtro, diálogo, validação e atualização do
   estado demonstrativo; um teste E2E cobre a navegação principal.
9. Typecheck, lint, testes e build terminam sem erro.

## Fora de escopo

- Autenticação real, autorização e sessões.
- Banco, schema, migrations, Prisma, Supabase e tRPC.
- Persistência após recarregar a página.
- Deploy e configuração da Vercel.
- Reserva futura, notificações por e-mail e importação de planilha.

## Dependências e decisões pendentes

- O ADR-001, esta spec, o plano e as tarefas foram aprovados em 2026-09-28.
