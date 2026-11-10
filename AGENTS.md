<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->


# Project Instructions

## Stack
- Next.js App Router
- TypeScript
- React
- Tailwind CSS

## Architecture
- Configuration-driven design system.
- Reusable components.
- Keep business logic separate from presentation.
- Prefer Server Components.
- Use Client Components only when necessary.
- Keep SEO metadata close to route configuration.

## Quality
- Avoid `any`.
- Validate external inputs.
- Handle errors explicitly.
- Keep components focused.
- Write tests for business logic and important user flows.

## Validation
Before completing a task, run the relevant:
- TypeScript checks
- ESLint
- Unit tests
- Integration tests
- Build

Use the package manager and scripts already established in the repository.

## Completion
Report:
- Implementation summary
- Files changed
- Tests executed
- Test results
- Remaining risks

## Git Workflow

### Branch Management
- Never implement directly on main or master.
- Create a dedicated branch for every independent task.
- Use descriptive branch names:
  - feature/<description>
  - fix/<description>
  - refactor/<description>
  - chore/<description>
- Before creating a branch, inspect the current Git status.
- Never discard or overwrite existing user changes.
- Do not reuse branches for unrelated tasks.

### Implementation
- Keep changes scoped to the assigned task.
- Create logical commits with descriptive messages.
- Do not commit unrelated files.
- Do not amend or rewrite existing commits without permission.

### Pull Requests
- Create a pull request for every completed task.
- Target the repository's designated base branch.
- Include:
  - Summary of changes
  - Problem being solved
  - Implementation details
  - Tests executed
  - Potential risks
- Link relevant issues when available.
- Never merge a PR without explicit user approval.

### Validation
Before creating a PR:
- Run lint.
- Run TypeScript checks.
- Run relevant automated tests.
- Run the production build when appropriate.
- Inspect the final diff.
- Ensure no secrets or unrelated changes are included.

### Safety
- Never force push.
- Never delete branches without permission.
- Never push directly to main.
- Never merge without approval.
- Ask before performing destructive Git operations.
