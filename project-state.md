# Project state
Last updated: 2026-10-01

## Works
- The site is live at https://ai-workshop-eight-mauve.vercel.app/.
- A person can create an account with an email and password on the Sign up page and is signed in straight away.
- Once signed in, the home page shows "Signed in as" followed by their email, and it stays that way when they reload the page.
- A person can click Sign out and see the Sign in and Sign up links again.
- A person can sign back in on the Sign in page; a wrong password shows an error message and keeps them on that page.

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
