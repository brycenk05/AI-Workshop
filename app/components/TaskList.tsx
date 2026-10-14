"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createClient } from "../lib/supabase";

type Task = {
  id: number;
  title: string;
  created_at: string;
};

// The signed-in person's tasks, with a box to add a new one.
// Row Level Security in Supabase makes sure each person only gets their own rows.
export default function TaskList() {
  const [signedIn, setSignedIn] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function loadTasks() {
      const { data, error } = await supabase
        .from("tasks")
        .select("id, title, created_at")
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
    if (!trimmed) return;

    setError(null);
    setAdding(true);
    const { data, error } = await createClient()
      .from("tasks")
      .insert({ title: trimmed })
      .select("id, title, created_at")
      .single();
    setAdding(false);

    if (error) {
      setError(error.message);
      return;
    }
    setTasks((current) => [...current, data]);
    setTitle("");
  }

  if (!signedIn) return null;

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
        <ul className="list task-list">
          {tasks.map((task) => (
            <li key={task.id}>{task.title}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
