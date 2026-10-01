"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "../lib/supabase";

// Shows who is signed in with a Sign out button, or Sign in / Sign up links.
export default function AuthStatus() {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
      setLoading(false);
    });
  }, []);

  async function handleSignOut() {
    await createClient().auth.signOut();
    setEmail(null);
  }

  if (loading) {
    return <div className="auth-bar" aria-busy="true" />;
  }

  if (email) {
    return (
      <div className="auth-bar">
        <span>
          Signed in as <strong>{email}</strong>
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
