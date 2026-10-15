"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createClient } from "../lib/supabase";

type Task = {
  id: number;
  title: string;
  created_at: string;
  due_date: string | null; // "YYYY-MM-DD", or null for tasks made before due dates existed
  done: boolean;
  repeat: Repeat | null; // null means the task does not repeat
};

// "weekly" repeats on the same weekday as the task's due date,
// so a task due on a Monday repeats every Monday.
type Repeat = "daily" | "weekly";

const TASK_COLUMNS = "id, title, created_at, due_date, done, repeat";

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// A Date as "YYYY-MM-DD" in this person's time zone, the same shape as
// due_date from the database, so the two can be compared directly.
function toDateString(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function todayString(): string {
  return toDateString(new Date());
}

// "2026-10-16" -> a Date at midnight local time. Built from the parts so
// the date does not shift a day because of time zones.
function parseDate(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

// What Done means for a repeating task: this time is finished, so the due
// date moves to the next time it comes round that is after today. Missed
// days are skipped rather than piling up.
function nextDueDate(dueDate: string, repeat: Repeat, today: string): string {
  const step = repeat === "daily" ? 1 : 7;
  const next = parseDate(dueDate);
  do {
    next.setDate(next.getDate() + step);
  } while (toDateString(next) <= today);
  return toDateString(next);
}

function repeatLabel(repeat: Repeat, dueDate: string | null): string {
  if (repeat === "daily") return "every day";
  return dueDate ? `every ${WEEKDAYS[parseDate(dueDate).getDay()]}` : "every week";
}

// The overdue rule: the due date is before today and the task is not done.
// A task due today is not overdue until the day is over.
function isOverdue(task: Task, today: string): boolean {
  return !task.done && task.due_date !== null && task.due_date < today;
}

// "2026-10-16" -> "Oct 16, 2026".
function formatDueDate(dueDate: string): string {
  return parseDate(dueDate).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// The signed-in person's tasks, with a form to add one, a Done box, and a
// Delete button. Repeating tasks are listed first, in their own group. Row Level Security in Supabase makes sure each person
// only gets, changes, and deletes their own rows.
export default function TaskList() {
  const [signedIn, setSignedIn] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [repeat, setRepeat] = useState<Repeat | "">("");
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function loadTasks() {
      const { data, error } = await supabase
        .from("tasks")
        .select(TASK_COLUMNS)
        .order("created_at", { ascending: true });
      if (error) {
        setError(error.message);
        return;
      }
      setTasks(data ?? []);
    }

    // Runs once on load and again whenever someone signs in or out,
    // so the list never shows the previous person's tasks.
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setError(null);
      if (session) {
        setSignedIn(true);
        loadTasks();
      } else {
        setSignedIn(false);
        setTasks([]);
      }
    });

    return () => data.subscription.unsubscribe();
  }, []);

  async function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed || !dueDate) return;

    setError(null);
    setAdding(true);
    const { data, error } = await createClient()
      .from("tasks")
      .insert({ title: trimmed, due_date: dueDate, repeat: repeat || null })
      .select(TASK_COLUMNS)
      .single();
    setAdding(false);

    if (error) {
      setError(error.message);
      return;
    }
    setTasks((current) => [...current, data]);
    setTitle("");
    setDueDate("");
    setRepeat("");
  }

  async function handleToggleDone(task: Task) {
    setError(null);
    // A repeating task never stays done: ticking it moves it to next time.
    const change =
      task.repeat && task.due_date && !task.done
        ? { due_date: nextDueDate(task.due_date, task.repeat, todayString()) }
        : { done: !task.done };
    // Asking for the changed row back means a change that Row Level
    // Security quietly blocks shows up as an error instead of nothing.
    const { data, error } = await createClient()
      .from("tasks")
      .update(change)
      .eq("id", task.id)
      .select(TASK_COLUMNS)
      .single();
    if (error) {
      setError(error.message);
      return;
    }
    setTasks((current) => current.map((t) => (t.id === data.id ? data : t)));
  }

  async function handleDelete(task: Task) {
    setError(null);
    const { data, error } = await createClient()
      .from("tasks")
      .delete()
      .eq("id", task.id)
      .select("id");
    if (error) {
      setError(error.message);
      return;
    }
    if (!data || data.length === 0) {
      setError("That task could not be deleted.");
      return;
    }
    setTasks((current) => current.filter((t) => t.id !== task.id));
  }

  if (!signedIn) return null;

  const today = todayString();
  const repeating = tasks.filter((task) => task.repeat);
  const oneOff = tasks.filter((task) => !task.repeat);

  function renderTask(task: Task) {
    const overdue = isOverdue(task, today);
    const classes = ["task", overdue && "task-overdue", task.done && "task-done"]
      .filter(Boolean)
      .join(" ");
    return (
      <li key={task.id} className={classes}>
        <label className="task-check">
          <input
            type="checkbox"
            checked={task.done}
            onChange={() => handleToggleDone(task)}
          />
          Done
        </label>
        <span className="task-title">{task.title}</span>
        <span className="task-due">
          {task.due_date ? `Due ${formatDueDate(task.due_date)}` : "No due date"}
        </span>
        {task.repeat && (
          <span className="task-repeat">
            Repeats {repeatLabel(task.repeat, task.due_date)}
          </span>
        )}
        {overdue && <span className="task-overdue-label">Overdue</span>}
        <button
          type="button"
          className="task-delete"
          onClick={() => handleDelete(task)}
        >
          Delete
        </button>
      </li>
    );
  }

  return (
    <section className="section tasks">
      <h2>My tasks</h2>
      <form className="task-form" onSubmit={handleAdd}>
        <input
          type="text"
          aria-label="New task"
          placeholder="New task"
          maxLength={200}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="date"
          aria-label="Due date"
          required
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <select
          aria-label="Repeat"
          value={repeat}
          onChange={(e) => setRepeat(e.target.value as Repeat | "")}
        >
          <option value="">Doesn&apos;t repeat</option>
          <option value="daily">Every day</option>
          <option value="weekly">
            {dueDate ? `Every ${WEEKDAYS[parseDate(dueDate).getDay()]}` : "Every week"}
          </option>
        </select>
        <button type="submit" className="button" disabled={adding}>
          {adding ? "Adding…" : "Add"}
        </button>
      </form>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      {tasks.length === 0 && <p className="tasks-empty">No tasks yet.</p>}
      {repeating.length > 0 && (
        <>
          <h3 className="task-group">Repeating</h3>
          <ul className="task-list">{repeating.map(renderTask)}</ul>
        </>
      )}
      {oneOff.length > 0 && (
        <>
          {repeating.length > 0 && <h3 className="task-group">One-off</h3>}
          <ul className="task-list">{oneOff.map(renderTask)}</ul>
        </>
      )}
    </section>
  );
}
