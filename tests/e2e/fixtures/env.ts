// Central place to read + validate the env vars e2e specs depend on.
// Fails fast with a clear message instead of every spec throwing on undefined.

function required(name: string): string {
  const v = process.env[name]
  if (!v) {
    throw new Error(
      `Missing required env var ${name}. See .env.playwright.example — ` +
      `these must be set (e.g. via GitHub Secrets in CI) and match accounts ` +
      `created by scripts/seed-test-accounts.mjs.`
    )
  }
  return v
}

export const ciAccounts = {
  get teacherEmail()    { return required('CI_TEACHER_EMAIL') },
  get teacherPassword() { return required('CI_TEACHER_PASSWORD') },
  get classroomCode()   { return required('CI_CLASSROOM_CODE') },
  get studentLastName() { return required('CI_STUDENT_LASTNAME') },
  get studentPin()      { return required('CI_STUDENT_PIN') },
}
