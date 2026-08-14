"use client";

import { useActionState } from "react";
import { signIn, type ActionState } from "@/app/admin/actions";
import { content } from "@/config/content";
import styles from "@/components/admin/admin.module.css";

const copy = content.admin.login;

export function LoginForm({ demoPassword }: { demoPassword: string | null }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    signIn,
    null,
  );

  return (
    <form className={styles.loginCard} action={formAction}>
      <h1 className={styles.loginTitle}>{copy.title}</h1>
      <p className={styles.loginText}>{copy.text}</p>

      <div>
        <p className={styles.fieldLabel}>{copy.username}</p>
        <input
          className={styles.input}
          name="username"
          autoComplete="username"
          aria-label={copy.username}
          required
        />
      </div>

      <div>
        <p className={styles.fieldLabel}>{copy.password}</p>
        <input
          className={styles.input}
          name="password"
          type="password"
          autoComplete="current-password"
          aria-label={copy.password}
          required
        />
      </div>

      {state?.error && (
        <p className={styles.error} role="alert">
          {copy.error}
        </p>
      )}

      <button className={styles.loginSubmit} type="submit" disabled={pending}>
        {pending ? copy.submitting : copy.submit}
      </button>

      {demoPassword && <p className={styles.loginNote}>{copy.demo(demoPassword)}</p>}
    </form>
  );
}
