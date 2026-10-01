"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { signIn, signUp } from "../lib/auth";

type Mode = "signin" | "signup";

// One form used by both the Sign in and Sign up pages.
export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isSignUp = mode === "signup";
  const title = isSignUp ? "Sign up" : "Sign in";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setSubmitting(true);

    try {
      if (isSignUp) {
        const session = await signUp(email, password);
        if (!session) {
          setNotice("Check your email to confirm your account, then sign in.");
          return;
        }
      } else {
        await signIn(email, password);
      }
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <h1>{title}</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            autoComplete={isSignUp ? "new-password" : "current-password"}
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        {notice && <p className="form-notice">{notice}</p>}
        <button type="submit" className="button" disabled={submitting}>
          {submitting ? "Please wait…" : title}
        </button>
      </form>
      <p className="auth-switch">
        {isSignUp ? (
          <>
            Already have an account? <Link href="/signin">Sign in</Link>
          </>
        ) : (
          <>
            New here? <Link href="/signup">Sign up</Link>
          </>
        )}
      </p>
      <p className="auth-switch">
        <Link href="/">Back to home</Link>
      </p>
    </div>
  );
}
