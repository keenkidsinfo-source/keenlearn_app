import { test, expect } from '@playwright/test'
import { ciAccounts } from './fixtures/env'

test.describe('Teacher login', () => {
  test('signs in with valid credentials and lands on the teacher dashboard', async ({ page }) => {
    await page.goto('/login')
    await page.getByText("I'm a Teacher").click()

    await page.getByPlaceholder('Email address').fill(ciAccounts.teacherEmail)
    await page.getByPlaceholder('Password').fill(ciAccounts.teacherPassword)
    await page.getByRole('button', { name: /Sign In/i }).click()

    await expect(page).toHaveURL(/\/teacher$/)
    await expect(page.getByText('KeenKids Teacher')).toBeVisible()
  })

  test('shows an error for invalid credentials', async ({ page }) => {
    await page.goto('/login')
    await page.getByText("I'm a Teacher").click()

    await page.getByPlaceholder('Email address').fill(ciAccounts.teacherEmail)
    await page.getByPlaceholder('Password').fill('definitely-wrong-password')
    await page.getByRole('button', { name: /Sign In/i }).click()

    await expect(page.getByText(/Invalid email or password/i)).toBeVisible()
    await expect(page).toHaveURL(/\/login/)
  })
})

test.describe('Student login', () => {
  test('logs in with access code, last name, and PIN', async ({ page }) => {
    await page.goto('/login')
    await page.getByText("I'm a Student").click()

    await page.getByPlaceholder('e.g. KEEN01').fill(ciAccounts.classroomCode)
    await page.getByRole('button', { name: 'Next →' }).click()

    await page.getByPlaceholder('e.g. Smith').fill(ciAccounts.studentLastName)
    await page.getByRole('button', { name: /Log In/i }).click()

    // Single match for the CI fixture student goes straight to the PIN step.
    await expect(page.getByText(/Enter your 4-digit PIN/i)).toBeVisible()
    await page.getByPlaceholder('• • • •').fill(ciAccounts.studentPin)
    await page.getByRole('button', { name: /Go!/i }).click()

    await expect(page).toHaveURL(/\/dashboard$/)
  })

  test('rejects an invalid access code', async ({ page }) => {
    await page.goto('/login')
    await page.getByText("I'm a Student").click()

    await page.getByPlaceholder('e.g. KEEN01').fill('ZZZZZZ')
    await page.getByRole('button', { name: 'Next →' }).click()

    await page.getByPlaceholder('e.g. Smith').fill(ciAccounts.studentLastName)
    await page.getByRole('button', { name: /Log In/i }).click()

    await expect(page.getByText(/Invalid class code/i)).toBeVisible()
  })
})
