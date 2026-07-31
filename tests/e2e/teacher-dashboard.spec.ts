import { test, expect } from '@playwright/test'
import { ciAccounts } from './fixtures/env'

async function loginAsCiTeacher(page: import('@playwright/test').Page) {
  await page.goto('/login')
  await page.getByText("I'm a Teacher").click()
  await page.getByPlaceholder('Email address').fill(ciAccounts.teacherEmail)
  await page.getByPlaceholder('Password').fill(ciAccounts.teacherPassword)
  await page.getByRole('button', { name: /Sign In/i }).click()
  await expect(page).toHaveURL(/\/teacher$/)
}

test.describe('Teacher dashboard', () => {
  test('shows the access code for the teacher\'s OWN classroom, not some other one', async ({ page }) => {
    // Regression guard for the "Teacher2 assigned to G3-4/Mattos but dashboard
    // shows Class 1B" bug: the dashboard used to pick a classroom by
    // `ORDER BY name LIMIT 1` for a teacherId, which could surface a stale
    // second classroom row instead of the teacher's real one. The access
    // code shown here is a 1:1 fingerprint of which classroom loaded, so if
    // this ever drifts from CI_CLASSROOM_CODE, the wrong classroom loaded.
    await loginAsCiTeacher(page)

    await expect(page.getByText('Class Access Code')).toBeVisible()
    await expect(page.getByText(ciAccounts.classroomCode, { exact: true })).toBeVisible()
  })

  test('renders the roster and student management section', async ({ page }) => {
    await loginAsCiTeacher(page)

    await expect(page.getByText(/^Students/)).toBeVisible()
  })
})
