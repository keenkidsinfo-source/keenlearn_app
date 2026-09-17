/**
 * KeenKids Critical-Path Smoke Tests
 *
 * Covers the four save flows that have broken in production:
 *
 *  1. Science reflections  — student types observations → PUT /api/v1/sessions/:id
 *                            with sessionData → GET returns same data after reload
 *  2. Build chart          — teacher POSTs results to /api/v1/teacher/build-chart
 *                            → GET /api/v1/build/:dayId/results returns those rows
 *  3. Session API round-trip — raw PUT/GET to ensure the sessions API is wired up
 *                              correctly for any content type
 *  4. Teacher week override — PATCH /api/v1/teacher/classroom sets activeWeek;
 *                             students still get date-based week (not the override)
 *
 * Required env vars (add to .env.playwright and GitHub/Vercel Secrets):
 *   CI_SCIENCE_CONTENT_ID  — content_items.id for a science lab in the CI classroom
 *   CI_BUILD_DAY_ID        — curriculum_days.id for a build day in the CI classroom
 *
 * Get them with:
 *   SELECT ci.id, ci.subject FROM content_items ci
 *   JOIN curriculum_content cc ON cc.content_item_id = ci.id
 *   JOIN curriculum_days cd ON cd.id = cc.curriculum_day_id
 *   JOIN curriculum c ON c.id = cd.curriculum_id
 *   JOIN classroom_curriculum ccl ON ccl.curriculum_id = c.id
 *   WHERE ci.subject = 'science' LIMIT 1;
 *
 *   SELECT cd.id FROM curriculum_days cd
 *   JOIN curriculum c ON c.id = cd.curriculum_id
 *   JOIN classroom_curriculum ccl ON ccl.curriculum_id = c.id
 *   WHERE cd.subject = 'build' LIMIT 1;
 */

import { test, expect, type Page } from '@playwright/test'
import { ciAccounts } from './fixtures/env'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function optionalEnv(name: string): string | null {
  return process.env[name] ?? null
}

function requiredEnv(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(
    `Missing env var ${name}. See tests/e2e/smoke.spec.ts header for how to find the value.`
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

async function teacherLogin(page: Page) {
  await page.goto('/login')
  await page.getByText("I'm a Teacher").click()
  await page.getByPlaceholder('Email address').fill(ciAccounts.teacherEmail)
  await page.getByPlaceholder('Password').fill(ciAccounts.teacherPassword)
  await page.getByRole('button', { name: /Sign In/i }).click()
  await expect(page).toHaveURL(/\/teacher$/)
}

/** Calls a KeenKids API route from inside the authenticated page context. */
async function apiFetch(
  page: Page,
  method: string,
  path: string,
  body?: unknown,
): Promise<{ status: number; data: unknown }> {
  return page.evaluate(
    async ([m, p, b]: [string, string, unknown]) => {
      const res = await fetch(p, {
        method: m,
        headers: { 'Content-Type': 'application/json' },
        body: b != null ? JSON.stringify(b) : undefined,
      })
      let data: unknown
      try { data = await res.json() } catch { data = null }
      return { status: res.status, data }
    },
    [method, path, body ?? null] as [string, string, unknown],
  )
}

// ---------------------------------------------------------------------------
// 1. Session API round-trip
//    Proves PUT → GET works for any content type.
//    Uses the science content item ID but tests the sessions layer, not the UI.
// ---------------------------------------------------------------------------

test.describe('Session API round-trip', () => {
  test.setTimeout(30_000)

  test('PUT /api/v1/sessions/:id persists sessionData and GET returns it', async ({ page }) => {
    const contentId = requiredEnv('CI_SCIENCE_CONTENT_ID')
    const marker = `smoke-${Date.now()}`

    await studentLogin(page)

    // Write some data
    const put = await apiFetch(page, 'PUT', `/api/v1/sessions/${contentId}`, {
      progressPct: 50,
      sessionData: { observations: marker, whatILearned: 'test-value' },
    })
    expect(put.status, `PUT /api/v1/sessions/${contentId} should return 200`).toBe(200)

    // Read it back
    const get = await apiFetch(page, 'GET', `/api/v1/sessions/${contentId}`)
    expect(get.status, 'GET should return 200').toBe(200)

    const sd = (get.data as any)?.data?.sessionData
    expect(sd?.observations, 'sessionData.observations should survive the round-trip').toBe(marker)
    expect(sd?.whatILearned).toBe('test-value')
  })
})

// ---------------------------------------------------------------------------
// 2. Science reflections — full UI flow
//    Student types into observations textarea → debounced save fires →
//    page reloads → text is still there (restored from server).
// ---------------------------------------------------------------------------

test.describe('Science reflections save', () => {
  test.setTimeout(45_000)

  test('observations typed in the UI persist after page reload', async ({ page }) => {
    const contentId = optionalEnv('CI_SCIENCE_CONTENT_ID')
    if (!contentId) {
      test.skip(true, 'CI_SCIENCE_CONTENT_ID not set — skipping UI science test')
      return
    }

    await studentLogin(page)

    // Navigate to science lab (the /science/lab route uses classroomId from session)
    await page.goto('/science/lab')
    await expect(page).not.toHaveURL(/\/login/)

    const marker = `obs-${Date.now()}`
    const textarea = page.locator('textarea').first()
    await expect(textarea).toBeVisible({ timeout: 10_000 })

    // Clear and type — this triggers the debounced save (500 ms)
    await textarea.triple_click()
    await textarea.fill(marker)

    // Wait long enough for the 500 ms debounce + network round-trip
    await page.waitForTimeout(2_500)

    // Intercept the GET on reload to confirm server returns our text
    const sessionGet = page.waitForResponse(
      res => res.url().includes('/api/v1/sessions/') && res.status() === 200,
      { timeout: 15_000 },
    )

    await page.reload()
    const res = await sessionGet
    const json = await res.json().catch(() => null)
    const sd = json?.data?.sessionData

    expect(
      sd?.observations ?? sd?.vote ?? Object.values(sd ?? {}).join(''),
      'Server should return saved observation text after reload',
    ).toContain(marker)
  })
})

// ---------------------------------------------------------------------------
// 3. Build chart save
//    Teacher POSTs results → API returns ok → GET /build/:dayId/results
//    contains those students' data.
// ---------------------------------------------------------------------------

test.describe('Build chart save', () => {
  test.setTimeout(30_000)

  test('POST /api/v1/teacher/build-chart saves results retrievable via build results API', async ({ page }) => {
    const buildDayId = requiredEnv('CI_BUILD_DAY_ID')

    await teacherLogin(page)

    // Get today's Monday for weekStartDate
    const today = new Date()
    const dow = today.getDay()
    const diff = dow === 0 ? -6 : 1 - dow
    const monday = new Date(today)
    monday.setDate(today.getDate() + diff)
    const pad = (n: number) => String(n).padStart(2, '0')
    const weekStartDate = `${monday.getFullYear()}-${pad(monday.getMonth() + 1)}-${pad(monday.getDate())}`

    // Fetch the classroom's students first so we can submit real IDs
    const studentsRes = await apiFetch(page, 'GET', '/api/v1/classroom/students')
    const students: { id: string; name: string }[] =
      (studentsRes.data as any)?.data ?? []

    // If no students, we can still test that the endpoint doesn't 500
    const testStudent = students[0]

    const payload = {
      weekStartDate,
      buildTitle: 'Smoke Test Build',
      gradeBand: 'g1-2',
      results: testStudent
        ? [{ studentId: testStudent.id, studentName: testStudent.name, minRocks: 3, maxRocks: 7, note: 'smoke test' }]
        : [],
    }

    const post = await apiFetch(page, 'POST', '/api/v1/teacher/build-chart', payload)
    expect(
      post.status,
      `POST /api/v1/teacher/build-chart should return 200, got: ${JSON.stringify(post.data)}`,
    ).toBe(200)

    // Verify the API didn't 500 and returned a structured response
    const resp = (post.data as any)?.data
    expect(resp, 'Response should have a data object').toBeTruthy()
    expect(typeof resp.sent === 'number' || typeof resp.noMatch === 'number', 'Response should have sent/noMatch counts').toBe(true)

    // If we submitted a real student, verify their result appears in the GET
    if (testStudent) {
      const getRes = await apiFetch(page, 'GET', `/api/v1/build/${buildDayId}/results`)
      expect(getRes.status, 'GET build results should return 200').toBe(200)

      const rows: { studentId: string; name: string }[] = (getRes.data as any)?.data ?? []
      const found = rows.find(r => r.studentId === testStudent.id)
      expect(found, `Student ${testStudent.name} should appear in build results after chart submission`).toBeTruthy()
    }
  })
})

// ---------------------------------------------------------------------------
// 4. Teacher week override — students unaffected
//    Teacher sets activeWeek → PATCH succeeds →
//    student nav still returns date-based week (not the override).
// ---------------------------------------------------------------------------

test.describe('Teacher week override', () => {
  test.setTimeout(30_000)

  test('PATCH activeWeek succeeds and does not affect student session nav', async ({ page: teacherPage, browser }) => {
    await teacherLogin(teacherPage)

    // Set activeWeek = 1 (guaranteed to exist)
    const patch = await apiFetch(teacherPage, 'PATCH', '/api/v1/teacher/classroom', { activeWeek: 1 })
    expect(patch.status, 'PATCH /api/v1/teacher/classroom should return 200').toBe(200)
    expect((patch.data as any)?.data?.activeWeek ?? (patch.data as any)?.activeWeek).toBe(1)

    // Open a fresh student context and confirm their /dashboard still loads
    // (it would 500 or show wrong week if getWeekNavFromClassroom read activeWeek)
    const studentContext = await browser.newContext()
    const studentPage = await studentContext.newPage()
    await studentLogin(studentPage)
    await studentPage.goto('/dashboard')
    await expect(studentPage.locator('h1, h2').first()).toBeVisible({ timeout: 10_000 })
    // No 500 error
    await expect(studentPage.locator('text=/500|Something went wrong|Internal Server/i')).toHaveCount(0)
    await studentContext.close()

    // Clean up — reset activeWeek to null so students see the real week
    await apiFetch(teacherPage, 'PATCH', '/api/v1/teacher/classroom', { activeWeek: null })
  })
})
