---
name: imagens-equipamentos
description: Prepara e valida fotos dos 12 equipamentos via API Pixabay. Use ao selecionar, revisar ou atualizar fotos do catálogo; não publica em produção.
---

# Imagens de equipamentos

1. Leia `docs/adr/004-origem-fotos-pixabay.md`, a spec de dados iniciais e
   `references/pixabay.md`. A lista canônica é `data/equipamentos-iniciais.json`.
2. Configure `PIXABAY_API_KEY` no `.env.local` ignorado pelo Git, sem imprimir ou
   versionar a chave. Execute `node scripts/prepare-equipment-photos.mjs`.
   O script usa a API Pixabay, cache de 24 horas e gera 12 JPEGs 800×600 em
   `.photo-prep/`.
3. Uma pessoa examina cada arquivo. Rejeite foto com pessoa, marca ou logo
   legível, texto ou tela com conteúdo. Registre os IDs rejeitados em
   `.photo-prep/rejected.json` e execute novamente o script.
4. Após aprovação visual e upload humano no bucket público, registre em
   `data/fotos-aprovadas.json` o provedor, ID, criador, página de origem,
   licença e URL pública. Valide com `node scripts/validate-equipment-photos.mjs`.
5. Não escreva no Supabase, rode migration/seed remoto ou use chave de serviço
   por meio desta skill.

Código comprova fonte da API, IDs únicos, dimensões e metadados. Revisão humana
comprova conteúdo visual, publicação e URL pública acessível.
