# Contador de Baús

Aplicação React e TypeScript para a comunidade Fortnite Brasil. O Dashboard, rankings, estatísticas e páginas de jogadores consomem dados observados disponibilizados pela API FNBR.

## Desenvolvimento

```sh
npm run dev
npm run build
```

O código é organizado por funcionalidade em `src/features`. O layout, os componentes reutilizáveis, as rotas e os providers ficam em `src/components` e `src/app`. Os recursos gráficos públicos são referenciados em `src/constants/assets.ts`.

A fonte de títulos é local; Roboto é carregada pelo Google Fonts, com fontes de sistema como alternativa. Os avatares do Dashboard reutilizam imagens ilustrativas disponíveis no projeto.

O roteamento usa a History API. Em produção, configure o servidor para encaminhar rotas desconhecidas a `index.html`, preservando o acesso direto aos arquivos existentes. Para hospedar em um subdiretório, configure também a opção `base` do Vite.

## API

Configure `VITE_API_BASE_URL` com a URL base da API. Na ausência dessa variável, a aplicação usa `https://api.fortcards.me/api/v1/`. As consultas do Dashboard usam `GET /analytics/screens/home`; as telas de jogadores e estatísticas usam os endpoints `/analytics/screens/*`.

O perfil público consulta `GET /analytics/players/{player_id}/summary`, `/history`, `/teammates` e `/treasures`. Histórico, companheiros e eventos de tesouro usam paginação (`page`, `page_size`); cada seção carrega e trata erros independentemente. A API pode retornar métricas nulas ou dados sem classificação. Interações de contêiner não são necessariamente baús abertos, e eventos de tesouro não são classificados como recompensas.

As rotas públicas de Analytics não enviam tokens. Consulte o contrato OpenAPI atualizado do projeto FNBR API para parâmetros, schemas e disponibilidade; `reference/openapi.yaml` neste repositório pode não refletir as rotas mais recentes.
