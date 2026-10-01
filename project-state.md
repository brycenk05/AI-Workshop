# Project state
Last updated: 2026-10-01

## Works
- Next.js site (App Router, TypeScript, plain CSS) is deployed on Vercel at https://ai-workshop-eight-mauve.vercel.app/.
- A Supabase project exists and is linked to the repo.
- Slice 1 (sign up and log in) is built on branch claude/jolly-archimedes-gm3e2u, PR open, not yet checked by Brycen on the preview link.
  - /signup and /signin pages; the home page shows "Signed in as <email>" with Sign out, or Sign in / Sign up links.
  - Uses the official Supabase packages @supabase/supabase-js and @supabase/ssr (Brycen approved both on 2026-10-01). Browser client is in app/lib/supabase.ts.
  - The session is kept in cookies and refreshed by the Supabase library.

## Broken or flaky
- npm audit reports 1 critical vulnerability in next 16.3.5 itself (fix is next 16.3.8). Not caused by this slice; upgrading next needs Brycen's OK.
- npm run lint fails: the script is "next lint", which Next.js 16 no longer has. Fixing it needs ESLint added as a dependency, so it waits for Brycen.

## Environment notes
- NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are set in Vercel (per Brycen). Not set locally in the Claude Code container.
- Supabase email confirmation is turned off (Brycen's decision), so new accounts can sign in straight away.
- No database tables yet.
- Claude Code runs at claude.ai/code with the repo already selected.

## Next session
- Brycen checks slice 1 on the preview link and merges.
- Then start slice 2: tasks that stay.
