# KeenKids Learn — Setup Guide

## Prerequisites

- Node.js 18+
- A Supabase project (PostgreSQL)
- A Cloudflare R2 bucket
- (Optional) OpenAI API key for generating build/science step images

---

## 1. Install dependencies

```bash
cd keenlearn_app
npm install
```

---

## 2. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.local.example .env.local
```

Open `.env.local` and set:

| Variable | Where to find it |
|---|---|
| `DATABASE_URL` | Supabase → Settings → Database → Connection string (Transaction pooler) |
| `JWT_SECRET` | Generate with: `openssl rand -base64 32` |
| `R2_ACCOUNT_ID` | Cloudflare dashboard → R2 → Overview |
| `R2_ACCESS_KEY_ID` | Cloudflare R2 → Manage R2 API Tokens → Create token |
| `R2_SECRET_ACCESS_KEY` | Same token creation screen |
| `R2_BUCKET_NAME` | Name of your R2 bucket (e.g. `keenkids-assets`) |
| `R2_PUBLIC_URL` | Custom domain or `https://<account>.r2.cloudflarestorage.com` |
| `NEXT_PUBLIC_TURBOWARP_URL` | `https://turbowarp.org` (or your self-hosted URL) |
| `OPENAI_API_KEY` | platform.openai.com → API keys |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` in dev, your domain in production |

> **Supabase note:** Use the **Transaction pooler** connection string (port 6543), NOT the direct connection. In the connection string, set `?pgbouncer=true` is not needed — Drizzle uses `prepare: false` automatically.

---

## 3. Run database migrations

```bash
npm run db:push
```

This will sync the schema to your Supabase database. To generate SQL migration files instead:

```bash
npm run db:generate
# then inspect drizzle/migrations/ and run:
npm run db:migrate
```

---

## 4. Seed initial data (optional)

Create a teacher account and classroom via the Supabase SQL editor or a seed script:

```sql
-- Create a classroom
INSERT INTO classrooms (id, name, grade_level, grade_band, access_code)
VALUES (gen_random_uuid(), 'Mrs. Smith Grade 2', 'Grade 2', 'g1-2', 'KEEN01');

-- Create a teacher (password: 'teacher123')
-- bcrypt hash of 'teacher123' with 10 rounds:
INSERT INTO users (id, classroom_id, name, role, email, password_hash)
VALUES (
  gen_random_uuid(),
  '<classroom-id-from-above>',
  'Mrs. Smith',
  'teacher',
  'smith@school.edu',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhy'
);
```

---

## 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

- **Teacher login:** go to `/login` → "I'm a Teacher" → use the email/password from the seed
- **Student login:** go to `/login` → "I'm a Student" → enter class code → pick avatar → enter PIN

---

## 6. Cloudflare R2 bucket setup

In the Cloudflare dashboard:

1. Create a bucket named `keenkids-assets`
2. Under **Settings → Public access**, enable a public custom domain (or use the R2 public URL)
3. Set CORS policy to allow `GET` from your app's domain:

```json
[
  {
    "AllowedOrigins": ["http://localhost:3000", "https://your-domain.com"],
    "AllowedMethods": ["GET", "PUT"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3600
  }
]
```

---

## 7. R2 asset key structure

Upload step images following this naming convention so the app can find them:

```
build/{content-item-id}/step-1.png
build/{content-item-id}/step-2.png
...
science/{content-item-id}/step-1.png
...
arts/{content-item-id}/step-1.png
```

Set `content_items.content_url` to the prefix (e.g. `build/{id}/`) and `step_count` to the number of steps.

---

## 8. Production deployment (Vercel)

```bash
npm install -g vercel
vercel
```

Add all environment variables from `.env.local` to the Vercel project settings.

For the `NEXT_PUBLIC_APP_URL`, set it to your production URL (e.g. `https://learn.keenkids.app`).

---

## Available npm scripts

| Command | Action |
|---|---|
| `npm run dev` | Start dev server at localhost:3000 |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push schema to database (dev) |
| `npm run db:generate` | Generate SQL migration files |
| `npm run db:migrate` | Run pending migrations |
| `npm run db:studio` | Open Drizzle Studio (visual DB browser) |

---

## Project structure

```
src/
  app/
    api/v1/          ← All REST API routes
    dashboard/       ← Student weekly view
    login/           ← Multi-step login flow
    science/day/[dayId]/
    coding/day/[dayId]/
    build/day/[dayId]/
    math/day/[dayId]/
    arts/day/[dayId]/
    achievements/    ← Badge collection
    teacher/         ← Teacher dashboard
    teacher/curriculum/ ← Assign weeks to class
  components/        ← Shared UI (ProgressBar, SubjectNav)
  lib/
    auth/            ← JWT + bcrypt helpers
    db/              ← Drizzle schema + client
    r2/              ← Cloudflare R2 client + presigned URLs
    utils.ts         ← Subject colors, helpers
  middleware.ts      ← Auth + role enforcement
```
