# ADR-004 — Origem Pixabay para as fotos

Status: APROVADO pelo responsável na conversa em 2026-11-09. Supera o ADR-003.

## Contexto

O enunciado da prática exige exclusivamente a API Pexels. O responsável
escolheu explicitamente usar Pixabay e registrar a divergência. Assim, esta
decisão **não atende ao requisito Pexels da avaliação**; o restante das
garantias de foto, crédito e operação permanece.

## Decisão

- Preparar fotos somente pela API Pixabay, com chave local em `.env.local`.
  O script não é usado em build nem runtime e não envia a chave à Vercel.
- Buscar apenas fotos com orientação horizontal, filtro seguro e dimensões
  mínimas; baixar o arquivo para preparo local, sem hotlink permanente.
- Redimensionar cada foto aprovada a 800×600, manter IDs únicos e exigir
  revisão visual humana antes do upload ao bucket público `equipment`.
- Registrar em `equipment` provedor, ID de origem, criador, página da foto,
  licença e URL pública. A unicidade é por provedor + ID. Metadados antigos
  do Pexels, se existirem, são preservados e identificados no backfill.
- Mostrar `Fotos: Pixabay` com link no catálogo e no detalhe, além do nome do
  criador e link da foto quando disponíveis. A API Pixabay pede indicação da
  origem quando resultados são exibidos.

## Alternativas

- Manter Pexels: aderiria ao enunciado, mas o responsável escolheu Pixabay.
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
