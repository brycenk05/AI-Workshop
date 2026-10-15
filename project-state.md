# Project state
Last updated: 2026-10-15

## Works
- The site is live at https://ai-workshop-eight-mauve.vercel.app/.
- A person can create an account with an email and password on the Sign up page and is signed in straight away.
- Once signed in, the home page shows "Signed in as" followed by their email, and it stays that way when they reload the page.
- A person can click Sign out and see the Sign in and Sign up links again.
- A person can sign back in on the Sign in page; a wrong password shows an error message and keeps them on that page.
- Once signed in, a person sees a "My tasks" box on the home page, can type a task and click Add, and sees it appear in their list.
- A person's tasks are still there after they sign out and sign back in.
- A person only ever sees their own tasks; a different account starts with an empty list.
- New tasks need a due date. A task due before today that is not done shows in red with the word Overdue.
- A person can tick Done on a task, or delete it.

## Broken or flaky
- npm audit reports 1 critical vulnerability in next 16.3.5 itself (fix is next 16.3.8). Not caused by this slice; upgrading next needs Brycen's OK.
- npm run lint fails: the script is "next lint", which Next.js 16 no longer has. Fixing it needs ESLint added as a dependency, so it waits for Brycen.

## Environment notes
- NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are set in Vercel (per Brycen). Not set locally in the Claude Code container.
- Supabase email confirmation is turned off (Brycen's decision), so new accounts can sign in straight away.
- One database table: public.tasks (id, user_id, title, created_at), Row Level Security on, select and insert only for the row owner. Brycen creates it by pasting the SQL from the slice 2 pull request into the Supabase SQL Editor; there is no migration file in the repo.
- public.tasks also has due_date (date) and done (true/false) columns, plus update and delete rules and grants for the row owner (slice 3, run by Brycen).
- Slice 4 adds a repeat column (daily, weekly, or empty) to public.tasks. Brycen runs that SQL from the slice 4 pull request in the Supabase SQL Editor.
- The home page no longer shows Brycen's name or bio; it is just the task list.
- Claude Code runs at claude.ai/code with the repo already selected.

## Next session
- Brycen runs the slice 4 SQL in Supabase, checks repeating tasks on the preview link, and merges.
- Then mark slice 4 DONE in roadmap.md and start slice 5: shared course list.
