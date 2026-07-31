# Testing & CI/CD

## Layers

- **Unit tests** (`tests/unit/`, Vitest) — pure logic only: date helpers, progress
  calculations, and API route handlers with the DB layer mocked. No network, no
  DB, runs in ~1s.
- **E2E tests** (`tests/e2e/`, Playwright) — real browser against a real
  deployed URL (Vercel preview or prod), using dedicated CI fixture accounts.
  This app talks directly to Supabase Postgres, so there's no "local dev
  server + throwaway DB" mode; e2e always runs against a real deployment.

## Running locally

```bash
npm run test           # unit tests, once
npm run test:watch     # unit tests, watch mode
npm run test:coverage  # unit tests with coverage report → coverage/

npm run lint
npm run typecheck

# e2e — copy .env.playwright.example → .env.playwright and fill in values
# matching your seeded CI accounts (see below), then:
BASE_URL=https://your-preview-url.vercel.app \
CI_TEACHER_EMAIL=ci-teacher@keenkids.test \
CI_TEACHER_PASSWORD=... \
CI_CLASSROOM_CODE=CITEST \
CI_STUDENT_LASTNAME=Student \
CI_STUDENT_PIN=9999 \
npm run test:e2e
```

## CI fixture accounts

`scripts/seed-test-accounts.mjs` creates a dedicated school/classroom/teacher/
student purely for automated testing (`KeenKids CI` school, access code
`CITEST`). It's idempotent — safe to re-run against staging or prod.

```bash
CI_TEACHER_PASSWORD=SomeSecret node scripts/seed-test-accounts.mjs
```

Run it once against whatever environment `BASE_URL` points at in CI (staging
recommended), then store the printed values as GitHub Actions secrets (see
below).

## GitHub Actions (`.github/workflows/ci.yml`)

Runs on every PR and push to `main`/`staging`:

1. **lint-and-typecheck** — `next lint` + `tsc --noEmit`.
2. **unit-tests** — Vitest with coverage, uploaded as an artifact.
3. **build** — `next build` using real secrets (mirrors the Vercel build).
4. **e2e** — waits for the Vercel preview deployment for the PR, then runs
   Playwright against it. Runs against prod on pushes to `main`.

### Required repository secrets

| Secret | Used by |
|---|---|
| `DATABASE_URL`, `JWT_SECRET`, `R2_*`, `OPENAI_API_KEY`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_TURBOWARP_URL` | `build` job (same values as `.env.local`) |
| `CI_TEACHER_EMAIL`, `CI_TEACHER_PASSWORD`, `CI_CLASSROOM_CODE`, `CI_STUDENT_LASTNAME`, `CI_STUDENT_PIN` | `e2e` job — must match `seed-test-accounts.mjs` output |
| `STAGING_URL` | fallback `BASE_URL` for `e2e` if the Vercel preview-wait step doesn't resolve a URL (e.g. non-Vercel PR contexts) |

The e2e job depends on the [Vercel GitHub integration](https://vercel.com/docs/deployments/git) posting deployment
statuses for PRs — this is already implied by "deployed on Vercel" but confirm
it's enabled for this repo/branch if the `wait-for-vercel-preview` step ever
times out.

## What's covered vs. not

- The teacher-classroom assignment bug (`assign-classroom` clearing a
  teacher's old classroom before assigning a new one) has both a unit
  regression test (`tests/unit/assign-classroom.test.ts`, verified to fail
  against the pre-fix code) and an e2e smoke check
  (`tests/e2e/teacher-dashboard.spec.ts`) that asserts the access code shown
  matches the seeded CI classroom.
- There isn't yet an e2e test that reproduces the exact "two classrooms
  pointing at one teacher" data state end-to-end (it'd need a second seeded
  classroom + an admin CI account to drive the reassignment through the UI).
  Worth adding if this class of bug recurs.
- `coding-keenkids/` is a vendored third-party project (TurboWarp/Scratch),
  not part of this app's test or CI scope.
