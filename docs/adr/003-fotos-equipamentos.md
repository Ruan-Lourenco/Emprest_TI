# ADR-003 — Fotos do catálogo

Status: SUPERADO pelo ADR-004 em 2026-11-09. Esta foi a decisão original
alinhada ao enunciado da prática; mantém-se para rastrear a divergência.

## Decisão

As fotos de equipamentos vêm exclusivamente da API do Pexels e são preparadas
localmente em 800×600. O binário final é publicado por uma pessoa em um bucket
público do Supabase Storage. A tabela `equipment` guarda URL pública, ID da foto,
fotógrafo, URL de origem e licença. A interface exibe o crédito "Fotos: Pexels"
com link. A seleção de conteúdo impróprio exige revisão visual humana antes de
qualquer upload.

O processamento é executado fora do request e do deploy; não há segundo caminho
de leitura ou mutação de dados de domínio. O seed idempotente associa as fotos
aprovadas pelo patrimônio do equipamento. ID de foto único impede reutilização.

## Alternativas

- Guardar apenas caminhos em um manifesto: mais simples, mas perde metadados
  verificáveis junto ao registro e não impõe unicidade no banco.
- Buscar do Pexels em cada página: depende de chave e rede em runtime, expõe a
  integração ao fluxo de leitura e não garante revisão visual.

## Consequências

Uma migration de `equipment` é necessária. Dados antigos ficam com campos de
foto nulos. Fotos não são declaradas publicadas até o upload humano e a
verificação das URLs. A chave Pexels é usada só na preparação local.
