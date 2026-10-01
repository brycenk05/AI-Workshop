# Roadmap

## What this is
A task list website for students who want one place to keep their to-dos. People sign in, add tasks, tag each task with a course from a shared course list, and find their tasks still there when they come back.

## What Done means
A stranger opens https://ai-workshop-eight-mauve.vercel.app/, creates an account with an email and password, adds a task, and picks a course for it from a shared list of fake courses. They sign out, sign back in, and see the task still there, labeled with its course. They can filter their list to one course, and they never see anyone else's tasks.

## Slices
1. Sign up and log in | done-criteria: (a) On the live site, click Sign up, enter a new email and password, submit, follow the confirmation email if one arrives, and end up on a page that says "Signed in as" followed by that email. (b) Reload the page and still see "Signed in as" with that email. (c) Click Sign out and see Sign in and Sign up, with no email shown. (d) Sign in with that email and a wrong password and see an error message while staying on the sign-in page. | status: ACTIVE (built, PR open, waiting on Brycen's check of the preview)
2. Tasks that stay | done-criteria: (a) Signed in, type Buy fake groceries in the new-task box, click Add, and see it appear in the list. (b) Sign out, sign back in, and see Buy fake groceries still in the list. (c) Sign in as a second test account and see an empty list with none of the first account's tasks. | status: pending
3. Shared course list | done-criteria: (a) On the new-task form, open the Course dropdown and see at least three fake courses, including FAKE 101. (b) Add a task with FAKE 101 selected and see "FAKE 101" next to it in the list. (c) Choose FAKE 101 in the course filter and see only FAKE 101 tasks; choose All and see every task again. (d) Sign in as the second test account, open the Course dropdown, and see the same courses. | status: pending

## Backlog
- Marking tasks complete
- Editing and deleting tasks
- Due dates and sorting by date
- Letting users add, rename, or delete courses
- Password reset by email
- Sign in with Google or other providers
- Sharing a task or list with another person
- Search
- Visual polish and a mobile-specific layout
