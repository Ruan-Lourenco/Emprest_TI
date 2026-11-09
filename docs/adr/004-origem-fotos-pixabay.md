# ADR-004 — Origem Pixabay para as fotos

Status: APROVADO pelo responsável na conversa em 2026-11-09. Supera o ADR-003.

## Contexto

O HTML original da prática indicava exclusivamente a API Pexels. Em
2026-11-09, o responsável esclareceu que a orientação vigente para a
avaliação passou a ser **Pixabay**. Esta decisão atende à orientação atual;
o texto original permanece registrado para rastrear a mudança. As garantias
de foto, crédito e operação continuam aplicáveis.

## Decisão

- Preparar fotos somente pela API Pixabay, com chave local em `.env.local`.
  O script não é usado em build nem runtime e não envia a chave à Vercel.
- Buscar apenas fotos com orientação horizontal, filtro seguro e dimensões
  mínimas; baixar o arquivo para preparo local, sem hotlink permanente.
- Redimensionar cada foto aprovada a 800×600, manter IDs únicos e exigir
  revisão visual humana antes do upload ao bucket público `equipment`.
- Registrar em `equipment` provedor, ID de origem, criador, página da foto,
  licença e URL pública. A unicidade é por provedor + ID. Metadados antigos
  do Pexels, se existirem, são preservados e identificados no backfill para
  auditoria, mas a interface não exibe essas fotos antigas. Elas são
  substituídas pelas fotos Pixabay aprovadas no seed.
- Mostrar `Fotos: Pixabay` com link no catálogo e no detalhe, além do nome do
  criador e link da foto quando disponíveis. A API Pixabay pede indicação da
  origem quando resultados são exibidos.

## Alternativas

- Manter Pexels: aderiria ao HTML original, mas não à orientação atual
  confirmada pelo responsável.
- Hotlink direto ao Pixabay: descartado pela documentação da API, que limita
  URLs de resultado e não permite hotlink permanente.

## Consequências

Uma migration Prisma renomeia `image_pexels_id` para `image_source_id`,
`image_photographer` para `image_creator`, adiciona `image_provider` e troca
o índice único por `(image_provider, image_source_id)`. A preparação local
usa cache de busca por 24 horas, conforme a documentação da API. Nenhuma
migration ou upload de produção é executado pelo agente.

Fontes oficiais: https://pixabay.com/api/docs/ e
https://pixabay.com/service/license-summary/.
