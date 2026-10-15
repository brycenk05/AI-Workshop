"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createClient } from "../lib/supabase";

type Task = {
  id: number;
  title: string;
  created_at: string;
  due_date: string | null; // "YYYY-MM-DD", or null for tasks made before due dates existed
  done: boolean;
};

const TASK_COLUMNS = "id, title, created_at, due_date, done";

// Today's date on this person's computer, as "YYYY-MM-DD" so it can be
// compared directly with due_date from the database.
function todayString(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

// The overdue rule: the due date is before today and the task is not done.
// A task due today is not overdue until the day is over.
function isOverdue(task: Task, today: string): boolean {
  return !task.done && task.due_date !== null && task.due_date < today;
}

// "2026-10-16" -> "Oct 16, 2026". Built from the parts so the date
// does not shift a day because of time zones.
function formatDueDate(dueDate: string): string {
  const [year, month, day] = dueDate.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// The signed-in person's tasks, with a form to add one, a Done box, and a
// Delete button. Row Level Security in Supabase makes sure each person
// only gets, changes, and deletes their own rows.
export default function TaskList() {
  const [signedIn, setSignedIn] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
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
      .insert({ title: trimmed, due_date: dueDate })
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
  }

  async function handleToggleDone(task: Task) {
    setError(null);
    // Asking for the changed row back means a change that Row Level
    // Security quietly blocks shows up as an error instead of nothing.
    const { data, error } = await createClient()
      .from("tasks")
      .update({ done: !task.done })
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
        <button type="submit" className="button" disabled={adding}>
          {adding ? "Adding…" : "Add"}
        </button>
      </form>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      {tasks.length === 0 ? (
        <p className="tasks-empty">No tasks yet.</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => {
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
          })}
        </ul>
      )}
    </section>
  );
}
