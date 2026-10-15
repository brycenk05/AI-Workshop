# Roadmap

## What this is
A task list website for students who want one place to keep their to-dos. People sign in, add tasks, tag each task with a course from a shared course list, and find their tasks still there when they come back.

## What Done means
A stranger opens https://ai-workshop-eight-mauve.vercel.app/, creates an account with an email and password, adds a task, and picks a course for it from a shared list of fake courses. They sign out, sign back in, and see the task still there, labeled with its course. They can filter their list to one course, and they never see anyone else's tasks.

## Slices
1. Sign up and log in | done-criteria: (a) On the live site, click Sign up, enter a new email and password, submit, follow the confirmation email if one arrives, and end up on a page that says "Signed in as" followed by that email. (b) Reload the page and still see "Signed in as" with that email. (c) Click Sign out and see Sign in and Sign up, with no email shown. (d) Sign in with that email and a wrong password and see an error message while staying on the sign-in page. | status: DONE
2. Tasks that stay | done-criteria: (a) Signed in, type Buy fake groceries in the new-task box, click Add, and see it appear in the list. (b) Sign out, sign back in, and see Buy fake groceries still in the list. (c) Sign in as a second test account and see an empty list with none of the first account's tasks. | status: DONE
3. Due dates, done, and delete | done-criteria: (a) The tasks table has a new due_date column and a done column, and the new-task form has a Due date field; add Fake essay with tomorrow's date and see it in the list with that due date. (b) The display rule: a task is overdue when its due date is before today and it is not done. Add Fake reading with yesterday's date and see it in red text with the word Overdue next to it; a task due today is not overdue. (c) Tick Done on Fake reading and see the red text and Overdue go away; reload and it is still marked done. (d) Click Delete on Fake essay and see it disappear; reload and it is still gone. (e) Sign in as the second test account and see none of the first account's tasks, and no way to change or delete them. | status: ACTIVE
4. Shared course list | done-criteria: (a) On the new-task form, open the Course dropdown and see at least three fake courses, including FAKE 101. (b) Add a task with FAKE 101 selected and see "FAKE 101" next to it in the list. (c) Choose FAKE 101 in the course filter and see only FAKE 101 tasks; choose All and see every task again. (d) Sign in as the second test account, open the Course dropdown, and see the same courses. | status: NOT STARTED

## Backlog
- Editing tasks
- Sorting by due date
- Letting users add, rename, or delete courses
- Password reset by email
- Sign in with Google or other providers
- Sharing a task or list with another person
- Search
- Visual polish and a mobile-specific layout
