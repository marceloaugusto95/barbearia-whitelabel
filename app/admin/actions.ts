"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isSlotAvailable } from "@/lib/availability";
import { createSession, destroySession, getSession, verifyCredentials } from "@/lib/auth";
import { getAppointment, updateAppointment } from "@/lib/store";
import type { Appointment } from "@/lib/types";

export type ActionState = { error?: string } | null;

export async function signIn(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  const user = verifyCredentials(username, password);
  if (!user) return { error: "invalid" };

  await createSession(user);
  redirect("/admin");
}

export async function signOut() {
  await destroySession();
  redirect("/admin/login");
}

/** Barbeiro só mexe na própria agenda; a administração mexe em tudo. */
async function authorize(appointmentId: string): Promise<Appointment> {
  const user = await getSession();
  if (!user) redirect("/admin/login");

  const appointment = await getAppointment(appointmentId);
  if (!appointment) throw new Error("Agendamento não encontrado.");

  if (user.role === "barber" && appointment.barberId !== user.barberId) {
    throw new Error("Sem permissão para este agendamento.");
  }
  return appointment;
}

function refresh() {
  revalidatePath("/admin");
  revalidatePath("/admin/agendamentos");
}

export async function completeAppointment(formData: FormData) {
  const appointment = await authorize(String(formData.get("id") ?? ""));

  await updateAppointment(appointment.id, {
    status: "completed",
    // Pagamento na unidade se liquida no atendimento.
    paymentState: appointment.paymentMethod === "onsite" ? "paid" : appointment.paymentState,
  });
  refresh();
}

export async function cancelAppointment(formData: FormData) {
  const appointment = await authorize(String(formData.get("id") ?? ""));
  await updateAppointment(appointment.id, { status: "cancelled" });
  refresh();
}

export async function rescheduleAppointment(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const appointment = await authorize(String(formData.get("id") ?? ""));
  const date = String(formData.get("date") ?? "");
  const time = String(formData.get("time") ?? "");

  if (!date || !time) return { error: "invalid" };

  const free = await isSlotAvailable({
    unitId: appointment.unitId,
    barberId: appointment.barberId,
    date,
    time,
    ignoreAppointmentId: appointment.id,
  });
  if (!free) return { error: "taken" };

  await updateAppointment(appointment.id, { date, time, status: "confirmed" });
  refresh();
  return null;
}
