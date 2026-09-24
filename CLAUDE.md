# CLAUDE.md

## Stack
- Next.js with the App Router, TypeScript, plain CSS
- Supabase for sign-in and the database
- Deployed on Vercel from the main branch of brycenk05/AI-Workshop
- Live site: https://ai-workshop-eight-mauve.vercel.app/

## Commands
- npm install: install dependencies
- npm run dev: run the site locally
- npm run build: production build; must pass before any pull request
- npm run lint: lint check; must pass before any pull request
- If a script is missing, check package.json and tell Brycen instead of adding one.

## Never
- Add a dependency without asking first.
- Edit .env or any environment variable, locally, in Vercel, or in Supabase.
- Change auth configuration without saying what is changing and why.
- Create new top-level folders.
- Put passwords, API keys, or connection strings in code, commits, or chat.
- Use real personal data. Fake names and fake content only.
- Commit or merge without showing Brycen the changes first, unless the prompt explicitly says to.
- Work on anything outside the ACTIVE slice.

## Conventions
- Explain every change in plain language, not only in code.
- Plain CSS only. No CSS frameworks or UI component libraries.
- TypeScript everywhere. Avoid the any type; if it is unavoidable, explain why.
- Every Supabase table has Row Level Security turned on, so each user can read and write only their own rows. The shared courses table is read-only for signed-in users.
- Before the first database change, propose where the SQL will live and wait for approval.
- One slice per pull request. Keep pull requests small.
- When a slice is finished, update project-state.md and the slice status in roadmap.md.

## Current focus
See roadmap.md, work only on the slice marked ACTIVE.
