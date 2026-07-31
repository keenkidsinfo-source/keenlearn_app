import { defineConfig, devices } from '@playwright/test'

// E2E tests run against a real deployed URL (Vercel preview/staging/prod) using
// dedicated CI test accounts seeded by scripts/seed-test-accounts.mjs — NOT
// against a local dev server, since the app talks to Supabase Postgres.
//
// Required env vars (see .env.playwright.example):
//   BASE_URL, CI_TEACHER_EMAIL, CI_TEACHER_PASSWORD,
//   CI_CLASSROOM_CODE, CI_STUDENT_LASTNAME, CI_STUDENT_PIN
const baseURL = process.env.BASE_URL ?? 'http://localhost:3000'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['html', { open: 'never' }], ['github']] : 'list',
  timeout: 30_000,
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
})
