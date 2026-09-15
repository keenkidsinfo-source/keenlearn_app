# Deploy Checklist

Run these checks before merging any PR that touches:
- `src/app/api/v1/coding/**`
- `src/app/coding/**` (CodingSandbox, page)
- `public/scratch/js/editor.js` or `editor.html`
- `src/lib/scratch-storage.ts`

---

## Automated (run in CI on every PR)

```bash
npm run test:e2e
```

The `coding-save.spec.ts` test verifies the critical path:
student saves → logs out → logs back in → project is still there.

If this test is red, **do not merge**.

---

## Manual smoke test (2 minutes, run after deploy to Vercel)

Do this as a real student in the deployed app, not localhost.

**1. Open a scratch coding day**
- Log in as a student → go to Week 3 → open the Pokémon game coding day
- Confirm TurboWarp loads (no blank iframe, no spinner stuck)

**2. Make a visible change**
- In TurboWarp, drag any new block onto a sprite (e.g. add a `say Hello` block to Pikachu)
- You should see the block appear in the script area

**3. Save**
- Click 💾 Save
- Confirm the button shows a saved state or no error toast appears
- Open DevTools → Network → filter for `/api/v1/coding` → confirm the PUT returned 200 with `{"saved":true}`

**4. Log out and log back in**
- Click Log Out
- Log back in as the same student
- Navigate back to the same coding day

**5. Confirm the block is still there**
- TurboWarp should load with your saved script intact
- The `say Hello` block you added should still be visible on Pikachu

**If step 5 fails:** the save pipeline is broken. Do not ship. Check:
- PUT `/api/v1/coding/:id` response body — did it return `saved: true`?
- The `projectData` column in the DB for that project — is it non-null?
- GET `/api/v1/coding/:id/data` — does it return 200 with content?

---

## Files that require a cache-bust when changed

If you modify `public/scratch/js/editor.js`, bump the version in `public/scratch/editor.html`:

```html
<script src="js/editor.js?v=15"></script>
```

Increment by 1 each time. Without this, students' browsers serve the old cached file.
