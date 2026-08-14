import type { OnlinePaymentMethod, PaymentIntent, PaymentStatus } from "@/lib/types";

/**
 * Pagamento **simulado**. Nenhuma cobrança acontece e nenhum dado de cartão é
 * coletado — numa integração real o cartão vai direto para o PSP (Stripe,
 * Pagar.me, Mercado Pago…) por campos hospedados, nunca por este formulário.
 *
 * O contrato é o de um PSP de verdade: cria-se uma intenção de pagamento e o
 * cliente acompanha o status até sair de `pending`.
 * Para ligar no PSP real basta trocar `createIntent`/`readIntent` — e, em
 * produção, preferir webhook ao polling.
 */

/** Quanto cada meio demora para "aprovar" no protótipo. */
export const PAYMENT_DELAYS_MS: Record<OnlinePaymentMethod, number> = {
  pix: 3500,
  debit: 2200,
  credit: 2800,
};

const PREFIX = "pi";
/** Sem ponto: um "." no fim do path faz o Next tratar a URL como arquivo. */
const SEPARATOR = "_";

/**
 * O id carrega o instante da aprovação, então qualquer instância do servidor
 * responde o status sem estado compartilhado.
 */
export function createIntent(params: {
  method: OnlinePaymentMethod;
  amount: number;
}): PaymentIntent {
  const delay = PAYMENT_DELAYS_MS[params.method];
  const approvesAt = Date.now() + delay;
  const id = [
    PREFIX,
    approvesAt.toString(36),
    params.method,
    params.amount.toString(36),
    Math.floor(Math.random() * 36 ** 6).toString(36),
  ].join(SEPARATOR);

  return {
    id,
    method: params.method,
    status: "pending",
    amount: params.amount,
    pixCode: params.method === "pix" ? pixCode(id) : null,
    expectedDelayMs: delay,
  };
}

export function readIntent(id: string): PaymentIntent | null {
  const [prefix, approvesAt, method, amount] = id.split(SEPARATOR);
  if (prefix !== PREFIX || !approvesAt || !method || !amount) return null;

  const approvesAtMs = Number.parseInt(approvesAt, 36);
  const value = Number.parseInt(amount, 36);
  if (!Number.isFinite(approvesAtMs) || !Number.isFinite(value)) return null;
  if (!isOnlineMethod(method)) return null;

  const status: PaymentStatus = Date.now() >= approvesAtMs ? "approved" : "pending";

  return {
    id,
    method,
    status,
    amount: value,
    pixCode: method === "pix" ? pixCode(id) : null,
    expectedDelayMs: PAYMENT_DELAYS_MS[method],
  };
}

function isOnlineMethod(value: string): value is OnlinePaymentMethod {
  return value === "pix" || value === "debit" || value === "credit";
}

/** Código propositalmente fake — não é um payload Pix EMV válido. */
function pixCode(intentId: string) {
  return `PIX-SIMULADO-${intentId.split(SEPARATOR).pop()?.toUpperCase()}-NAO-PAGAVEL`;
}
