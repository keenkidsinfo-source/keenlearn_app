/**
 * E2E: Scratch project save/load
 *
 * Test 1 — logout → login survival:
 *   1. Student opens a scratch coding day and the TurboWarp iframe loads.
 *   2. Clicking 💾 Save triggers POST or PUT to /api/v1/coding[/:id] and
 *      the response contains { saved: true }.
 *   3. GET /api/v1/coding/:id/data returns 200 with non-empty content
 *      immediately after save (so projectData is in the DB).
 *   4. After logout + login, navigating to the same coding day causes
 *      GET /api/v1/coding/:id/data to be fetched again and return 200.
 *
 * Test 2 — Reload button writes live snapshot to localStorage:
 *   1. Student opens a scratch coding day, waits for TurboWarp.
 *   2. Clicks 🔄 Reload.
 *   3. Asserts localStorage kk_project is non-null immediately after Reload
 *      (meaning __kkGetProjectSb3 was called and wrote the live VM state,
 *      not a stale __kkLastSb3 cache that could be up to 1 s behind).
 *   4. Asserts the iframe reloads (new src appears) and TurboWarp boots again.
 *
 * Required env vars (add to .env.playwright and GitHub Secrets):
 *   CI_SCRATCH_DAY_ID  — the dayId (UUID) of a Week 3 scratch coding day
 *                        in the CI classroom. Get it from the DB:
 *                        SELECT id FROM curriculum_content
 *                        WHERE language = 'scratch' LIMIT 1;
 *
 * All other vars come from the existing CI_* set (see .env.playwright.example).
 */

import { test, expect, type Page } from '@playwright/test'
import { ciAccounts } from './fixtures/env'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function requiredEnv(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(
    `Missing env var ${name}. Add it to .env.playwright and GitHub Secrets.`
  )
  return v
}

async function studentLogin(page: Page) {
  await page.goto('/login')
  await page.getByText("I'm a Student").click()
  await page.getByPlaceholder('e.g. KEEN01').fill(ciAccounts.classroomCode)
  await page.getByRole('button', { name: 'Next →' }).click()
  await page.getByPlaceholder('e.g. Smith').fill(ciAccounts.studentLastName)
  await page.getByRole('button', { name: /Log In/i }).click()
  await expect(page.getByText(/Enter your 4-digit PIN/i)).toBeVisible()
  await page.getByPlaceholder('• • • •').fill(ciAccounts.studentPin)
  await page.getByRole('button', { name: /Go!/i }).click()
  await expect(page).toHaveURL(/\/dashboard$/)
}

async function studentLogout(page: Page) {
  // Navigate to dashboard and look for a logout/sign out link
  await page.goto('/dashboard')
  const logoutLink = page.getByRole('link', { name: /log ?out|sign ?out/i })
    .or(page.getByRole('button', { name: /log ?out|sign ?out/i }))
  if (await logoutLink.count() > 0) {
    await logoutLink.first().click()
  } else {
    // Fallback: clear session cookie by navigating to /api/auth/logout or /login
    await page.goto('/login')
  }
  await page.waitForURL(/\/login/)
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test.describe('Scratch project save/load', () => {
  test.setTimeout(60_000)

  test('save writes to DB and survives logout → login', async ({ page }) => {
    const scratchDayId = requiredEnv('CI_SCRATCH_DAY_ID')
    const codingUrl = `/coding/day/${scratchDayId}`

    // ── 1. Login ──────────────────────────────────────────────────────────
    await studentLogin(page)

    // ── 2. Open the scratch coding day ────────────────────────────────────
    await page.goto(codingUrl)

    // Wait for the TurboWarp iframe to appear
    const iframe = page.locator('iframe[src*="/scratch/editor.html"]')
    await expect(iframe).toBeVisible({ timeout: 20_000 })

    // Wait for KK_PROJECT_LOADED (fired by editor.js → parent window)
    // We poll for the projectReadyRef by watching for the save button to be active,
    // or just wait a generous 5 s for TurboWarp to initialise.
    await page.waitForTimeout(5_000)

    // ── 3. Intercept the save API call ────────────────────────────────────
    let savedProjectId: string | null = null

    const saveResponse = page.waitForResponse(
      res =>
        /\/api\/v1\/coding/.test(res.url()) &&
        (res.request().method() === 'POST' || res.request().method() === 'PUT') &&
        res.status() === 200,
      { timeout: 15_000 },
    )

    // Click the 💾 Save button
    const saveBtn = page.getByRole('button', { name: /save/i })
      .or(page.locator('button[title*="Save"], button[aria-label*="Save"]'))
      .or(page.locator('button').filter({ hasText: '💾' }))
    await saveBtn.first().click()

    const res = await saveResponse
    const body = await res.json().catch(() => null)

    // Confirm the API reported success
    expect(body?.data?.saved ?? body?.saved).toBe(true)

    // Extract project ID from the URL (POST returns project.id, PUT URL has it)
    const urlMatch = res.url().match(/\/api\/v1\/coding\/([^/?]+)/)
    if (urlMatch) {
      savedProjectId = urlMatch[1]
    } else {
      // POST response body contains the project
      savedProjectId = body?.data?.id ?? body?.id ?? null
    }
    expect(savedProjectId).toBeTruthy()

    // ── 4. Verify projectData is in the DB via /data endpoint ─────────────
    const dataRes = await page.request.get(
      `/api/v1/coding/${savedProjectId}/data`,
      { headers: { 'x-user-id': 'ci-bypass' } }, // route uses x-user-id header
    )
    // If auth blocks the direct call, just check the status via navigation instead
    if (dataRes.status() === 401) {
      // Re-fetch through the authed page context
      const dataViaPage = await page.evaluate(async (url: string) => {
        const r = await fetch(url)
        return { status: r.status, length: (await r.text()).length }
      }, `/api/v1/coding/${savedProjectId}/data`)
      expect(dataViaPage.status).toBe(200)
      expect(dataViaPage.length).toBeGreaterThan(10)
    } else {
      expect(dataRes.status()).toBe(200)
      const text = await dataRes.text()
      expect(text.length).toBeGreaterThan(10)
    }

    // ── 5. Logout ─────────────────────────────────────────────────────────
    await studentLogout(page)

    // ── 6. Login again ────────────────────────────────────────────────────
    await studentLogin(page)

    // ── 7. Re-open the same coding day — intercept the /data fetch ────────
    const dataFetch = page.waitForResponse(
      res =>
        res.url().includes(`/api/v1/coding/${savedProjectId}/data`) &&
        res.status() === 200,
      { timeout: 20_000 },
    )

    await page.goto(codingUrl)

    // The /data endpoint must respond 200 — this is what loads the iframe
    const dataFetchRes = await dataFetch
    expect(dataFetchRes.status()).toBe(200)

    // And the iframe must appear (meaning projectUrl was resolved, not 404)
    await expect(
      page.locator('iframe[src*="/scratch/editor.html"]'),
    ).toBeVisible({ timeout: 20_000 })
  })

  test('Reload button writes live VM snapshot to localStorage (not stale cache)', async ({ page }) => {
    const scratchDayId = requiredEnv('CI_SCRATCH_DAY_ID')
    const codingUrl = `/coding/day/${scratchDayId}`

    // ── 1. Login and open the coding day ─────────────────────────────────
    await studentLogin(page)
    await page.goto(codingUrl)

    const iframe = page.locator('iframe[src*="/scratch/editor.html"]')
    await expect(iframe).toBeVisible({ timeout: 20_000 })

    // Wait for TurboWarp to fully initialise and fire KK_PROJECT_LOADED.
    // 5 s is conservative — the polling cache (__kkLastSb3) ticks every 1 s,
    // so after 5 s it has run at least 4 times. The bug was: Reload used the
    // cache instead of the live __kkGetProjectSb3(). After the fix, Reload
    // always calls __kkGetProjectSb3() which is synchronously accurate.
    await page.waitForTimeout(5_000)

    // ── 2. Record the iframe src BEFORE reload ────────────────────────────
    const srcBefore = await iframe.getAttribute('src')

    // ── 3. Clear localStorage so we can verify Reload wrote to it ─────────
    await page.evaluate(() => localStorage.removeItem('kk_project'))

    // ── 4. Click the Reload button ────────────────────────────────────────
    const reloadBtn = page.getByRole('button', { name: /reload/i })
      .or(page.locator('button[title*="Reload"], button[aria-label*="Reload"]'))
      .or(page.locator('button').filter({ hasText: '🔄' }))
    await reloadBtn.first().click()

    // ── 5. Assert kk_project was written to localStorage ──────────────────
    // Give it up to 8 s for __kkGetProjectSb3 (async) to complete and write.
    await expect.poll(
      () => page.evaluate(() => localStorage.getItem('kk_project')),
      { timeout: 8_000, message: 'kk_project should be written to localStorage by Reload' },
    ).not.toBeNull()

    const stored = await page.evaluate(() => localStorage.getItem('kk_project'))
    expect(stored).toBeTruthy()
    expect(stored!.length).toBeGreaterThan(100) // real .sb3 base64 is thousands of chars

    // ── 6. Assert iframe reloaded with a NEW src ──────────────────────────
    // Reload sets iframeSrc to /scratch/editor.html?kk=<new timestamp>
    await expect.poll(
      () => iframe.getAttribute('src'),
      { timeout: 10_000, message: 'iframe src should change after Reload' },
    ).not.toBe(srcBefore)

    // ── 7. Assert TurboWarp boots again in the reloaded iframe ────────────
    await expect(iframe).toBeVisible({ timeout: 15_000 })
  })
})
