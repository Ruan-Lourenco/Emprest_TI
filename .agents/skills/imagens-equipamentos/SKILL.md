---
name: imagens-equipamentos
description: Prepara e valida fotos dos equipamentos do catálogo via API do Pexels. Use ao selecionar, revisar ou atualizar fotos dos 12 itens iniciais; não publica em produção.
---

# Imagens de equipamentos

1. Leia `docs/adr/003-fotos-equipamentos.md`, a spec de dados iniciais e
   `references/pexels.md`. A lista canônica está em `data/equipamentos-iniciais.json`.
2. Execute `node scripts/prepare-equipment-photos.mjs <arquivo-de-chave>` com
   caminho absoluto de um arquivo local **fora do repositório**. Não imprima,
   copie ou versione a chave. Não passe a chave na linha de comando.
   O script consulta somente a API do Pexels, escolhe IDs distintos e gera
   imagens 800×600 em `.photo-prep/`.
3. **Pare antes de aprovar**. Uma pessoa examina cada arquivo e rejeita foto
   com pessoa, marca ou logo legível, texto ou tela com conteúdo. Registre
   rejeições e motivos. Para refazer a busca, coloque os IDs reprovados em
   `.photo-prep/rejected.json` (lista JSON de números) e execute o script de
   novo. A seleção automática não comprova esse critério.
4. Para as 12 aprovadas, registre em `data/fotos-aprovadas.json` ID Pexels,
   fotógrafo, página de origem, licença Pexels e URL pública prevista. Valide
   com `node scripts/validate-equipment-photos.mjs`. A pessoa responsável faz
   upload dos arquivos para o bucket público e confere URLs sem login.
5. Não chame API de escrita do Supabase, não rode migration/seed remoto e não
   use chave de serviço. A preparação é local e idempotente: arquivos com o
   mesmo ID/caminho são substituídos, não duplicados.

Critérios por código: fonte da API, IDs distintos, tamanho e metadados.
Critérios por revisão humana: conteúdo visual, publicação e URL acessível.
