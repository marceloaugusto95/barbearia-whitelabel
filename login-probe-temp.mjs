// Temporário: simula o envio do formulário de login como um navegador sem JS faria.
const base = "https://barbeariatech.vercel.app";
const [, , username, password] = process.argv;

const page = await fetch(`${base}/admin/login`).then((response) => response.text());
const hidden = [...page.matchAll(/<input type="hidden" name="([^"]+)"(?: value="([^"]*)")?\/>/g)];

const form = new FormData();
for (const [, name, value] of hidden) {
  form.set(name, (value ?? "").replace(/&quot;/g, '"'));
}
form.set("username", username);
form.set("password", password);

const response = await fetch(`${base}/admin/login`, {
  method: "POST",
  headers: { origin: base },
  body: form,
  redirect: "manual",
});

const cookie = response.headers.getSetCookie?.().join("; ") ?? "";
console.log("login:", response.status, cookie ? "cookie recebido" : "SEM cookie");
if (!cookie) {
  const body = await response.clone().text();
  console.log("  mostra erro de credencial:", body.includes("Usuário ou senha inválidos"));
  console.log("  location:", response.headers.get("location") ?? "(nenhum)");
}

if (cookie) {
  const session = cookie.split(";")[0];
  const dash = await fetch(`${base}/admin`, { headers: { cookie: session } });
  const html = await dash.text();
  const kpis = [...html.matchAll(/kpiValue[^"]*">([^<]+)</g)].map((match) => match[1]);
  console.log("dashboard:", dash.status, "| KPIs:", kpis.join(" | "));
}
