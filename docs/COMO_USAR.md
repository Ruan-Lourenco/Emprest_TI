# Como executar e usar o EmpresTI

Este guia explica como iniciar o frontend do EmpresTI na sua máquina.

> O estado atual do app é demonstrativo. Ele não usa banco, autenticação ou
> dados reais. As alterações são apagadas quando a página é recarregada.

## 1. Pré-requisito

Tenha o Node.js LTS instalado. Para conferir, abra o PowerShell na pasta do
projeto e execute:

```powershell
node --version
npm --version
```

Se os dois comandos mostrarem uma versão, o ambiente está pronto. Se o comando
não for reconhecido logo após instalar o Node.js, feche e abra o PowerShell.

## 2. Abrir a pasta do projeto

No PowerShell, entre na pasta em que este arquivo e o `package.json` estão:

```powershell
cd "C:\Users\ruanlourenco-ieg\OneDrive - Instituto Germinare\Área de Trabalho\3ano\vibe coding\210926\Vibe_Coding_Emprest\empresTI"
```

## 3. Instalar as dependências

Na primeira execução, ou depois de uma mudança no `package.json`, execute:

```powershell
npm install
```

Esse comando cria a pasta `node_modules`. Não é necessário executá-lo toda vez
que o app for iniciado.

## 4. Subir o app para desenvolvimento

Execute:

```powershell
npm run dev
```

Quando o terminal mostrar que o servidor está pronto, abra no navegador:

<http://localhost:3000>

Mantenha o PowerShell aberto enquanto estiver usando o app. Para desligar o
servidor, volte ao terminal e pressione `Ctrl+C`.

## 5. Entrar e navegar

1. A página inicial abre a tela de login demonstrativo.
2. Os campos já vêm preenchidos; clique em **Entrar na demonstração**.
3. Use a navegação para acessar:
   - Catálogo;
   - Meus empréstimos;
   - Empréstimos em aberto;
   - Cadastrar equipamento.
4. Solicitações, devoluções e cadastros alteram somente o estado da sessão.
5. Recarregar a página restaura os dados demonstrativos originais.

## 6. Executar em modo de produção local

Para testar a versão otimizada:

```powershell
npm run build
npm start
```

Depois, abra <http://localhost:3000>. Use `Ctrl+C` para desligar o servidor.

## 7. Validar o projeto

Os comandos de qualidade podem ser executados separadamente:

```powershell
npm run typecheck
npm run lint
npm test
npm run test:e2e
npm run build
```

O teste E2E precisa do Chromium do Playwright. Se ele ainda não estiver
instalado na máquina, execute uma vez:

```powershell
npx playwright install chromium
```

## Problemas comuns

### `node` ou `npm` não é reconhecido

Feche e abra o PowerShell depois da instalação do Node.js. Se continuar, instale
uma versão LTS pelo site oficial do Node.js e reinicie o terminal.

### A porta 3000 já está em uso

Encerre o outro servidor com `Ctrl+C` ou inicie este app em outra porta:

```powershell
npm run dev -- -p 3001
```

Nesse caso, abra <http://localhost:3001>.

### Uma dependência está ausente

Execute novamente:

```powershell
npm install
```

Não coloque credenciais ou valores reais em arquivos versionados. O frontend
demonstrativo atual não precisa de nenhuma variável de ambiente adicional.
