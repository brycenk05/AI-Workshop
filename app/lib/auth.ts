// Sign-in helpers that talk to Supabase Auth over its HTTP API using fetch.
// No Supabase package is installed, so this file does the few calls we need:
// sign up, sign in, sign out, and keeping the session alive between visits.

export type Session = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // seconds since 1970, when the access token stops working
  email: string;
};

type TokenResponse = {
  access_token?: string;
  refresh_token?: string;
  expires_at?: number;
  expires_in?: number;
  user?: { email?: string };
  email?: string;
};

const STORAGE_KEY = "ai-workshop-session";

function config(): { url: string; key: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error("Sign-in is not set up on this site yet.");
  }
  return { url: url.replace(/\/$/, ""), key };
}

async function authRequest(
  path: string,
  init: { method: string; body?: unknown; accessToken?: string },
): Promise<TokenResponse> {
  const { url, key } = config();
  const headers: Record<string, string> = {
    apikey: key,
    "Content-Type": "application/json",
  };
  if (init.accessToken) {
    headers.Authorization = `Bearer ${init.accessToken}`;
  }

  const res = await fetch(`${url}/auth/v1${path}`, {
    method: init.method,
    headers,
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });

  let data: Record<string, unknown> = {};
  try {
    data = await res.json();
  } catch {
    // Empty or non-JSON body (for example, a successful sign out).
  }

  if (!res.ok) {
    const message =
      data.msg ?? data.error_description ?? data.message ?? data.error;
    throw new Error(
      typeof message === "string" ? message : "Something went wrong. Try again.",
    );
  }
  return data as TokenResponse;
}

function toSession(data: TokenResponse, fallbackEmail: string): Session | null {
  if (!data.access_token || !data.refresh_token) return null;
  const now = Math.floor(Date.now() / 1000);
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: data.expires_at ?? now + (data.expires_in ?? 3600),
    email: data.user?.email ?? fallbackEmail,
  };
}

function save(session: Session | null): void {
  try {
    if (session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Storage can be blocked (for example in some private windows). The user
    // stays signed in for this page view; it just won't survive a reload.
  }
}

function load(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

/**
 * Creates an account. Returns the new session, or null when Supabase wants the
 * person to confirm their email before signing in.
 */
export async function signUp(
  email: string,
  password: string,
): Promise<Session | null> {
  const data = await authRequest("/signup", {
    method: "POST",
    body: { email, password },
  });
  const session = toSession(data, email);
  save(session);
  return session;
}

export async function signIn(email: string, password: string): Promise<Session> {
  const data = await authRequest("/token?grant_type=password", {
    method: "POST",
    body: { email, password },
  });
  const session = toSession(data, email);
  if (!session) throw new Error("Sign-in failed. Try again.");
  save(session);
  return session;
}

export async function signOut(): Promise<void> {
  const session = load();
  save(null);
  if (session) {
    try {
      await authRequest("/logout", {
        method: "POST",
        accessToken: session.accessToken,
      });
    } catch {
      // The local session is already gone, which is what the user sees.
    }
  }
}

/**
 * Returns the saved session, swapping in a fresh access token if the old one
 * has expired. Returns null when nobody is signed in.
 */
export async function getSession(): Promise<Session | null> {
  const session = load();
  if (!session) return null;

  const now = Math.floor(Date.now() / 1000);
  if (session.expiresAt - 60 > now) return session;

  try {
    const data = await authRequest("/token?grant_type=refresh_token", {
      method: "POST",
      body: { refresh_token: session.refreshToken },
    });
    const fresh = toSession(data, session.email);
    save(fresh);
    return fresh;
  } catch {
    save(null);
    return null;
  }
}
