/**
 * AuthContext — front‑end only auth backed by localStorage.
 * Passwords are NOT validated (this is a demo). The default admin account is
 * always seeded on first run so admin features can be explored immediately.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const USERS_KEY = 'gogro_users';
const SESSION_KEY = 'gogro_session';

const DEFAULT_ADMIN = {
  email: 'admin@gogro.com',
  name: 'Admin',
  isAdmin: true,
};

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota / private mode errors */
  }
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const existing = readJson(USERS_KEY, null);
    if (Array.isArray(existing) && existing.some((u) => u.email === DEFAULT_ADMIN.email)) {
      return existing;
    }
    const seeded = Array.isArray(existing) ? [...existing, DEFAULT_ADMIN] : [DEFAULT_ADMIN];
    writeJson(USERS_KEY, seeded);
    return seeded;
  });

  const [currentUser, setCurrentUser] = useState(() => readJson(SESSION_KEY, null));

  useEffect(() => {
    writeJson(USERS_KEY, users);
  }, [users]);

  useEffect(() => {
    if (currentUser) writeJson(SESSION_KEY, currentUser);
    else localStorage.removeItem(SESSION_KEY);
  }, [currentUser]);

  /** Demo login: any password works as long as the email exists. */
  const login = useCallback(
    (email, _password) => {
      const trimmed = String(email || '').trim().toLowerCase();
      const user = users.find((u) => u.email.toLowerCase() === trimmed);
      if (!user) {
        return { ok: false, error: 'No account found for that email.' };
      }
      setCurrentUser(user);
      return { ok: true, user };
    },
    [users]
  );

  /** Add a new user, then auto‑login. Email must be unique. */
  const register = useCallback(
    (name, email, _password) => {
      const trimmedEmail = String(email || '').trim().toLowerCase();
      const trimmedName = String(name || '').trim();
      if (!trimmedName) return { ok: false, error: 'Please enter your name.' };
      if (!trimmedEmail) return { ok: false, error: 'Please enter your email.' };
      if (users.some((u) => u.email.toLowerCase() === trimmedEmail)) {
        return { ok: false, error: 'An account with that email already exists.' };
      }
      const newUser = { email: trimmedEmail, name: trimmedName, isAdmin: false };
      setUsers((prev) => [...prev, newUser]);
      setCurrentUser(newUser);
      return { ok: true, user: newUser };
    },
    [users]
  );

  const logout = useCallback(() => setCurrentUser(null), []);

  /** One‑click admin login for demo / presentation. */
  const loginAsAdmin = useCallback(() => {
    const admin = users.find((u) => u.email === DEFAULT_ADMIN.email) || DEFAULT_ADMIN;
    setCurrentUser(admin);
    return { ok: true, user: admin };
  }, [users]);

  const value = useMemo(
    () => ({
      currentUser,
      users,
      isAdmin: !!currentUser?.isAdmin,
      login,
      register,
      logout,
      loginAsAdmin,
    }),
    [currentUser, users, login, register, logout, loginAsAdmin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
