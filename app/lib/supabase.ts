import { createBrowserClient } from "@supabase/ssr";

// One Supabase client for code that runs in the browser. It keeps the
// sign-in session in cookies and refreshes it on its own.
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error("Sign-in is not set up on this site yet.");
  }
  return createBrowserClient(url, key);
}
