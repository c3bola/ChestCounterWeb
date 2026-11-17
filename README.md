# Contador de Baús

Aplicação React e TypeScript para a comunidade Fortnite Brasil. O Dashboard carrega indicadores, rankings e atividades pela API; as demais páginas são placeholders.

## Desenvolvimento

```sh
npm run dev
npm run build
```

O código é organizado por funcionalidade em `src/features`. O layout, os componentes reutilizáveis, as rotas e os providers ficam em `src/components` e `src/app`. Os recursos gráficos públicos são referenciados em `src/constants/assets.ts`.

A fonte de títulos é local; Roboto é carregada pelo Google Fonts, com fontes de sistema como alternativa. Os avatares do Dashboard reutilizam imagens ilustrativas disponíveis no projeto.

O roteamento usa a History API. Em produção, configure o servidor para encaminhar rotas desconhecidas a `index.html`, preservando o acesso direto aos arquivos existentes. Para hospedar em um subdiretório, configure também a opção `base` do Vite.

## API do Dashboard

Configure `VITE_API_BASE_URL` com a URL base da API. Na ausência dessa variável, a aplicação usa o servidor de desenvolvimento definido no contrato OpenAPI (`http://localhost:3000/api/v1`). As consultas usam `GET /analytics/overview`, `GET /analytics/rankings` e `GET /analytics/feed`.

O contrato aplica autenticação Bearer globalmente e não declara exceções públicas para Analytics. O Dashboard não envia tokens fictícios nem credenciais embutidas; até que o backend libere esses endpoints para leitura pública ou a aplicação tenha um fluxo de autenticação compatível, as consultas podem responder HTTP 401 e a interface exibirá esse erro.
