# Owner account, requests and notifications

Each client owns its own repository, private environment and database. No customer data or passwords are bundled in a new client export.

1. Copy `.env.example` to `.env.local` and set the selected profile/site origin.
2. Run `npm run setup:owner -- --username YourOwnerName` and supply a strong password through stdin. Only a salted hash is saved. Choose a distinct account for each business.
3. Open `/login` or the configurable owner entry in navigation. The private inbox is `/owner`.
4. Visitors submit `/contact` without accounts. Requests appear only after validation and storage succeeds; all configured extra questions are available in the inbox.
5. On a phone, use a trusted HTTPS site. Install it to the Home Screen where required, open the installed icon, sign in and explicitly allow notifications. Use the test button. HTTP addresses do not support phone push.

Configuration of owner copy, timezone, locale, session days and device limits lives in the public profile. Secrets are exclusively environment values. Production uses Secure/HttpOnly cookies; expired or revoked sessions require another login. Logout disables the current device subscription, and a control can revoke all devices.

Set `OWNER_DATA_DIR` to a dedicated persistent volume in production. Default development data is `.local-data/<business-id>/owner.sqlite`. The database records its business identity and rejects reuse by another business. Legacy data adoption must be deliberate. Keep consistent backups; do not open or edit the binary database as plain text.

Set stable VAPID public/private keys, a real `VAPID_SUBJECT` contact and a private `PUSH_RETRY_SECRET`. Run `npm run push:worker` beside the website. Alternatively, schedule authenticated POSTs to `/api/owner/push/retry`. `PUSH_RETRY_ORIGIN` may point at localhost on the server. Do not put secrets in URLs.

Push acceptance is not guaranteed visible delivery. The OS, permissions, focus settings and connectivity affect alerts. The panel remains the source of saved request details. Credentials, SQLite data, sessions and notification endpoints must never be committed to Git.
