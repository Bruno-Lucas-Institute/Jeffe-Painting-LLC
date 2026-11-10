# Reusability verification

- Template configuration/asset checks: passed for painting and fictional cleaning profiles.
- Template strict TypeScript and ESLint: passed.
- Template automated tests: 19 passed, including dynamic field validation, database identity, session isolation, sanitized export and push retry behavior.
- Production builds: painting and cleaning passed using the same application with different profiles; final default build passed.
- Standalone sanitized landscaping starter: dependency installation, configuration/asset check, 14 generic tests and production build passed independently.
- HTTP integration: both profiles served their own pages, icons, manifests and metadata. Disabled projects returned 404 in the cleaning profile. JSON/native submissions saved successfully; custom cleaning answers appeared in its owner inbox. Missing required fields and untrusted origins were rejected. Owner login, mark-as-read, logout and revoked-session checks passed. Cross-business cookies were rejected.
- Test accounts, request fixtures and databases were synthetic and isolated in ignored QA directories. No live customer data or owner credentials were copied. The existing live website was not deployed or modified by this refactor.
- Native/browser automation hosts were unavailable. Visual desktop/mobile behavior, installation and real-device notification receipt are not claimed as verified. Web Push transport retry tests use a stub provider.
- Existing dependency installation reported eight moderate toolchain advisories; no unrelated dependency downgrade was applied.

Main files: `src/config/schema.ts` and `profiles/` define validated business data; `src/components/business-sections.tsx` composes reusable sections; `src/lib/validation/estimate.ts` handles configurable forms; `src/lib/owner/database-identity.ts` protects client data boundaries; `scripts/new-client.mjs` creates sanitized independent client repositories.
