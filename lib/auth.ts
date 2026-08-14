import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { passwordFor, staff } from "@/config/staff";
import type { StaffUser } from "@/lib/types";

/**
 * Sessão de equipe: cookie HttpOnly assinado com HMAC, sem dependência externa.
 *
 * Suficiente para o protótipo. **Para produção**, troque por um provedor de
 * identidade (Clerk, Auth.js, Supabase Auth): senha por usuário, 2FA,
 * recuperação e revogação de sessão não estão resolvidos aqui.
 */

const COOKIE_NAME = "barbearia_session";
const SESSION_HOURS = 8;

function secret() {
  const fromEnv = process.env.AUTH_SECRET;
  if (fromEnv) return fromEnv;
  if (process.env.NODE_ENV === "production") {
    throw new Error("Defina AUTH_SECRET para assinar as sessões em produção.");
  }
  return "dev-secret-nao-use-em-producao";
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

/** Confere usuário e senha. Retorna `null` sem dizer qual dos dois falhou. */
export function verifyCredentials(username: string, password: string): StaffUser | null {
  const user = staff.find(
    (item) => item.username.toLowerCase() === username.trim().toLowerCase(),
  );
  if (!user) return null;

  const expected = passwordFor(user);
  if (!expected || !safeEqual(password, expected)) return null;

  return user;
}

export async function createSession(user: StaffUser) {
  const expiresAt = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  const payload = `${user.id}.${expiresAt}`;
  const store = await cookies();

  store.set(COOKIE_NAME, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(expiresAt),
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE_NAME);
}

export async function getSession(): Promise<StaffUser | null> {
  const raw = (await cookies()).get(COOKIE_NAME)?.value;
  if (!raw) return null;

  const separator = raw.lastIndexOf(".");
  if (separator === -1) return null;

  const payload = raw.slice(0, separator);
  const signature = raw.slice(separator + 1);
  if (!safeEqual(signature, sign(payload))) return null;

  const [userId, expiresAt] = payload.split(".");
  if (!userId || Number(expiresAt) < Date.now()) return null;

  return staff.find((user) => user.id === userId) ?? null;
}

/** Barbeiro só enxerga a própria agenda; a administração enxerga tudo. */
export function scopeOf(user: StaffUser): string | null {
  return user.role === "barber" ? user.barberId : null;
}
