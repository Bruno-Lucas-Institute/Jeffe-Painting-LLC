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

The estimate form saves requests directly to the team's protected customer inbox.

## Checks

```bash
npm run lint
npm run build
```

## Customer inbox and mobile notifications

Node.js 24+ is required (SQLite is stored on the server). Run `JEFFE_ADMIN_PASSWORD='<chosen password>' node scripts/setup-local.mjs` once to create a private `.env.local`. Open `/login` and use the configured `jef` account. There is no public registration; customer requests do not require login.

The form saves requests to SQLite and only then shows “Information sent / Check your email for updates.” The team replies manually using the inbox email link; automatic customer emails are not configured. The inbox refreshes every 15 seconds and shows the latest 200 requests.

For production, configure the variables from `.env.example` in the hosting environment. Use HTTPS, Node.js 24+, and a **single server with a persistent volume** for `DATABASE_PATH`; ephemeral/serverless filesystems will lose data and must be replaced with a managed database before deploying. Back up the database. Keep the same VAPID keys across deployments and never expose the private key or password hash to browser code.

On iPhone (iOS 16.4+), use Share → Add to Home Screen, open the installed app, sign in and tap Enable notifications. Android can install through the browser menu. Notification permission is requested only by the button. Requests remain saved if push delivery fails. Push messages contain no customer details; opening the inbox requires a valid session. Device subscriptions remain enrolled until permission is revoked in that device's settings; signing out revokes the session, not notification permission.

Checks: `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`. For HTTP integration checks, start the app with a temporary database and test environment credentials, then run `TEST_BASE_URL=http://localhost:3000 TEST_ADMIN_PASSWORD='<test password>' npm run test:integration`. These checks create synthetic requests; never point them at production.
