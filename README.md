# Reusable Business Website

A Next.js App Router / TypeScript foundation for independent local-service businesses. Includes responsive marketing pages, configurable sections, an inquiry form, a private owner inbox, password login, PWA installation and Web Push. Each business gets its own repository, credentials and database. This is not a multi-tenant SaaS or an automatic appointment booking system.

## Start

Requires Node 24+ and npm. Run `npm ci`, copy `.env.example` to `.env.local`, and run `npm run dev`. Select a public configuration with `NEXT_PUBLIC_CLIENT_PROFILE` before starting or building. Available template profiles are `jeffe` (the retained painting site), `cleaning` (a clearly fictional example) and `starter` (a neutral scaffold).

Owner setup: run `npm run setup:owner -- --username YourOwnerName`, then provide the password on stdin. No real password is bundled or printed. Each fresh client must create its own credentials and VAPID keys. Without owner credentials the login fails honestly; customer requests are stored only when the configured inbox/database is available.

## Create a new client

```powershell
npm run client:new -- --id garden-care --name "Garden Care" --industry landscaping --destination "../garden-care"
```

This creates a separate, empty destination from the neutral blueprint. It copies the application and generic tests, a single new public profile and the assets it references. It excludes Git identity/history, node_modules, builds, private environment files, owner credentials, sessions, requests, databases, logs, and previous client profiles/photos. It refuses existing destinations and never deletes a client folder.

In the new folder: run `npm ci`, customize `src/config/profiles/current.json`, copy `.env.example` to `.env.local`, configure the real origin and a separate owner, then run `npm run client:check`, tests and a build. Do not start a new client by copying `.env.local` or `.local-data` from another site. Initialize a separate Git repository when ready.

## What is configurable

`src/config/schema.ts` validates every business profile at startup/build time. `src/config/client.ts` selects the active public profile. Secrets stay in environment variables and never enter those JSON files.

- Business identity, logo or text mark, contact details, areas, hours, social links and navigation.
- Brand colors, decorative palette, fonts, radius and editorial/compact home composition. Colors are CSS variables rather than repeated client values in components.
- All homepage sections and their order in `home.sections`: hero, trust, services, transformation, projects, process, testimonials and CTA.
- Headings, descriptions, page copy, values, process steps, images and alt text. `content` holds public labels; `privacy` holds policy text requiring review.
- Services with stable IDs, detail bullets and images. The services page and form options use the same data.
- Portfolio and testimonials; disable optional sections and pages with feature flags. Disabled projects return 404 and disappear from navigation/sitemap.
- CTA text/destination. A free claim requires `cta.free: true`. Keep external booking CTAs distinct from an inquiry being accepted.
- Form fields, types, options, labels, required/min/max constraints, contact method, other-service option, loading text and success dialog.
- Owner interface copy, locale, timezone, session duration, device limit and notification text. Credentials are separate for every business.
- SEO titles/descriptions, social image, indexing, canonical URLs, sitemap, robots and branded install icons.

The cleaning fixture intentionally changes services, colors, fonts, section order, contact fields, custom frequency/date questions, CTA and success text. It has no invented credentials or reviews. Supplied illustrations are labeled examples. Verify licenses and provenance before reusing real photos for another client.

## Forms, database and privacy

Visitors do not need accounts. Both JSON and normal HTML form POSTs are supported, so an unhydrated page does not silently swallow submissions. The server validates against the active profile and saves before returning success. A failed save does not report success. Unknown fields are stripped and configured extra answers are visible in the owner dashboard.

Keep a business ID stable after launch; rename the display name rather than changing the ID.

Default development storage: `.local-data/<business-id>/owner.sqlite`, table `inquiries`, JSON column `payload`. Production requires an explicit persistent `OWNER_DATA_DIR`. A database identity guard rejects a database tagged to another business, even if its path is mistakenly reused. A legacy data-bearing database requires explicit adoption; the retained painting profile alone is configured to adopt its original untagged database. Do not change `legacyDatabaseId` casually. No live customer database is copied into this template or any new export.

Existing request payloads remain readable. Stable service IDs are used going forward and a service-label snapshot is stored; legacy title-valued requests still display. Extra form values are stored in `fields`. Maintain retention/access policies and a consistent SQLite backup strategy. Run on one persistent Node host; migrate to a shared database before scaling across hosts.

Login uses salted scrypt hashes and random, revocable server sessions. Cookies are HttpOnly/SameSite=Strict and Secure in production. Password changes and business identity changes invalidate sessions. Mutations check the origin, requests have bounded bodies and persistent quotas, forms have a honeypot, and push endpoints are restricted to known browser providers. Behind a trusted proxy that overwrites forwarded headers, set `TRUST_PROXY=true`; otherwise visitors share a conservative quota. Configure edge protection for a real launch.
The estimate form saves requests directly to the team's protected customer inbox.

## Styling

Start with Tailwind utilities in the component markup. Use the theme tokens in `src/app/globals.css` for shared colors and fonts. Keep shared selector rules, layered gradients, and keyframes in CSS, using `@apply` for utility-backed declarations in those rules.

## Phone installation and notifications

Trusted HTTPS is required on phones. On iPhone/iPad (16.4+), add the HTTPS site to the Home Screen, open the icon, sign in, then explicitly allow notifications. Android can use a supported browser or installed app. Installation alone does not grant permission. The panel explains HTTP, unsupported-browser, installation and denied-permission states.

VAPID keys and the retry secret are generated per client by owner setup. Set a real operator contact in `VAPID_SUBJECT`. Keep the VAPID key pair stable across deployments. Push is disabled when its feature flag is off or server keys are absent. The PWA manifest and icons use the selected business identity automatically.

Requests and per-device notification jobs are saved together. The sender prunes expired devices and retains transient failures for retry. Run `npm run push:worker` alongside the server, or schedule authenticated POSTs to `/api/owner/push/retry` with `Authorization: Bearer <PUSH_RETRY_SECRET>`. `PUSH_RETRY_ORIGIN` can be a server-local localhost URL. Notification receipt depends on device permission/connectivity and the OS; a provider accepting a message does not prove display. Summary payloads are bounded; the full request remains in the authenticated inbox.

## SEO, deployment and maintenance

Set the final `NEXT_PUBLIC_SITE_URL` before building. Only enable indexing for verified, approved client content. Supply a production JPG/PNG social image for crawlers if an example SVG is used. Dynamic icons use the current logo mark and theme. Use a Node 24 HTTPS host with persistent disk; this server-backed site cannot be deployed to static-only hosting or ephemeral storage. Run `npm run build` and `npm start`; no paid integration or permanent hosting is activated by this template.

In development, add exact local origins in `OWNER_DEV_ORIGINS`; Next's `allowedDevOrigins` derives hosts from that list so phone scripts are not blocked. Those exceptions do not weaken production mutation checks.

Validate updates in an isolated branch, back up the database, run the checks below, verify real mobile installation and push, then deploy with the client's approval. Future email/CRM/booking integrations should be separate adapters; an inquiry is not a confirmed reservation or sale.

## Verification

```powershell
npm run client:check
npm run lint
npm run typecheck
npm run test
npm run build
```

`tests/reusability.test.ts` exercises multiple industries and the sanitized exporter. Other tests cover dynamic fields, database identity, persistence, sessions, abuse limits and notification retry behavior. `npm run qa:local` reads a password through stdin and verifies local pages, browser asset requests and owner session flow without creating customer inquiries. Use a separate QA database/environment for integration testing.

Browser automation and physical-device push verification depend on the environment; do not treat HTTP tests as visual accessibility or notification-delivery certification. The dependency installation reported eight moderate advisories in the existing toolchain; review compatible updates before a production launch rather than forcing unrelated downgrades.
## Customer inbox and mobile notifications

Node.js 24+ is required (SQLite is stored on the server). Run `JEFFE_ADMIN_PASSWORD='<chosen password>' node scripts/setup-local.mjs` once to create a private `.env.local`. Open `/login` and use the configured `jef` account. There is no public registration; customer requests do not require login.

The form saves requests to SQLite and only then shows “Information sent / Check your email for updates.” The team replies manually using the inbox email link; automatic customer emails are not configured. The inbox refreshes every 15 seconds and shows the latest 200 requests.

For production, configure the variables from `.env.example` in the hosting environment. Use HTTPS, Node.js 24+, and a **single server with a persistent volume** for `DATABASE_PATH`; ephemeral/serverless filesystems will lose data and must be replaced with a managed database before deploying. Back up the database. Keep the same VAPID keys across deployments and never expose the private key or password hash to browser code.

On iPhone (iOS 16.4+), use Share → Add to Home Screen, open the installed app, sign in and tap Enable notifications. Android can install through the browser menu. Notification permission is requested only by the button. Requests remain saved if push delivery fails. Push messages contain no customer details; opening the inbox requires a valid session. Device subscriptions remain enrolled until permission is revoked in that device's settings; signing out revokes the session, not notification permission.

Checks: `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`. For HTTP integration checks, start the app with a temporary database and test environment credentials, then run `TEST_BASE_URL=http://localhost:3000 TEST_ADMIN_PASSWORD='<test password>' npm run test:integration`. These checks create synthetic requests; never point them at production.
