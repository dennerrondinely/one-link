# OneLink Next.js

Nova versao do OneLink migrada para Next.js (App Router), mantendo o comportamento de redirecionamento inteligente para mobile/desktop.

## Funcionalidades

- Deteccao de dispositivo no servidor (iOS, Android, Desktop)
- Rota dinamica /:id para resolver deep links
- Redirecionamento direto para web quando desktop
- Tentativa de abertura de app em mobile com fallback para App Store/Play Store
- Pagina inicial com status de dispositivo e links de teste
- TypeScript com App Router do Next.js

## Requisitos

- Node.js 18+
- npm

## Executar localmente

```bash
npm install
npm run dev
```

Aplicacao em http://localhost:3000

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Rotas

- `/` mostra detalhes do dispositivo e os links disponiveis
- `/:id` resolve o link dinamico configurado

Exemplos:

- `/instagram-demo`
- `/whatsapp-demo`
- `/geru`

## Configuracao de links

Edite `src/lib/links.ts` para adicionar ou remover links.

```ts
export const links = {
  "seu-link": {
    appUrl: "seuapp://path",
    webUrl: "https://seu-site.com",
    name: "Seu App",
    appStore: "https://apps.apple.com/app/id123456",
    playStore: "https://play.google.com/store/apps/details?id=com.seu.app",
  },
};
```

## Estrutura

```text
src/
  app/
    [id]/page.tsx
    layout.tsx
    not-found.tsx
    page.tsx
    globals.css
  components/
    redirect-client.tsx
  lib/
    device.ts
    links.ts
```

## Deploy

Pode ser publicado em Vercel, Railway ou Render usando:

- Build command: `npm run build`
- Start command: `npm run start`
