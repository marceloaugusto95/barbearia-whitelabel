import type { StaffUser } from "@/lib/types";

/**
 * Quem entra no dashboard. `barberId` amarra a pessoa a um profissional de
 * `brand.barbers` — barbeiro só enxerga a própria agenda e o próprio
 * faturamento; a administração enxerga tudo.
 */
export const staff: StaffUser[] = [
  {
    id: "admin",
    username: "admin",
    name: "Administração",
    role: "admin",
    barberId: null,
  },
  { id: "staff-rafa", username: "rafa", name: "Rafa", role: "barber", barberId: "rafa" },
  { id: "staff-teo", username: "teo", name: "Téo", role: "barber", barberId: "teo" },
  {
    id: "staff-jonas",
    username: "jonas",
    name: "Jonas",
    role: "barber",
    barberId: "jonas",
  },
];

/**
 * Senha de cada acesso, por variável de ambiente: `STAFF_PASSWORD_ADMIN`,
 * `STAFF_PASSWORD_RAFA`, etc.
 *
 * Em desenvolvimento vale a senha de demonstração abaixo. **Em produção, sem a
 * variável definida o login simplesmente não acontece** — nada de senha padrão
 * embutida no código.
 */
export const DEMO_PASSWORD = "barbearia123";

/**
 * A senha de demonstração está mesmo valendo para alguém?
 * A tela de login só mostra a dica quando a resposta é sim — senão ela mentiria
 * para quem já configurou as senhas de verdade.
 */
export function demoPasswordInUse(): string | null {
  return staff.some((user) => passwordFor(user) === DEMO_PASSWORD) ? DEMO_PASSWORD : null;
}

export function passwordFor(user: StaffUser): string | null {
  // `.trim()` porque valor colado no painel costuma vir com espaço ou quebra
  // de linha grudada — e aí o login falha sem explicação.
  const fromEnv = process.env[`STAFF_PASSWORD_${user.username.toUpperCase()}`]?.trim();
  if (fromEnv) return fromEnv;
  return process.env.NODE_ENV === "production" ? null : DEMO_PASSWORD;
}
