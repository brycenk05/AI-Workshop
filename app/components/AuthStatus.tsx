"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSession, signOut, type Session } from "../lib/auth";

// Shows who is signed in with a Sign out button, or Sign in / Sign up links.
export default function AuthStatus() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSession().then((s) => {
      setSession(s);
      setLoading(false);
    });
  }, []);

  async function handleSignOut() {
    await signOut();
    setSession(null);
  }

  if (loading) {
    return <div className="auth-bar" aria-busy="true" />;
  }

  if (session) {
    return (
      <div className="auth-bar">
        <span>
          Signed in as <strong>{session.email}</strong>
        </span>
        <button type="button" className="button" onClick={handleSignOut}>
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="auth-bar">
      <Link href="/signin">Sign in</Link>
      <Link href="/signup">Sign up</Link>
    </div>
  );
}
