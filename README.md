# Vozen Helper — Site

Site público do Vozen Helper, com o painel de configuração autenticado, o painel
de dados do Vozen e as páginas legais.

## Estrutura

```
site/
  index.html          painel React do Helper (OAuth + configuração)
  vozen.html          painel de dados do Vozen
  privacidade.html    política de privacidade
  rank-card.html      compatibilidade com o editor antigo
  rank-card-banners/  banners curados para o rank card
  assets/             bundles e fontes publicados
tools/minify-site.mjs site/ -> site-dist/ (minifica HTML/CSS/JS)
.github/workflows/pages.yml  build + deploy para o Pages
```

## Desenvolvimento

```bash
npm install
npm run build:site
```

O painel comunica apenas com `https://api.vozen.org/rust` e inicia o OAuth pelo
endpoint PKCE da API. O callback cria uma sessão HttpOnly e redireciona de volta
para esta página; não há segredos Discord no bundle público.

## Publicação

Cada `push` a `main` que altere `site/**` corre o workflow `pages.yml`, que gera
`site-dist/` e publica-o no GitHub Pages em
`https://rexy40407.github.io/Vozen_Helper/`.

Sem afiliação com a Discord Inc.
