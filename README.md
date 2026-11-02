# Jeffe Painting LLC

Next.js website for Jeffe Painting LLC, serving Danbury and Fairfield County, Connecticut.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Client content

Business details, services, project gallery entries, and reviews are maintained in [`src/config/client.ts`](./src/config/client.ts). Project photography is stored in `public/images`.

The estimate form prepares an email addressed to Jefferson in the visitor's default email app. Connect a form service or server-side email provider if direct website submissions are needed.

## Checks

```bash
npm run lint
npm run build
```
