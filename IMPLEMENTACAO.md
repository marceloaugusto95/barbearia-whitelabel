# Implementação — Next.js

Recriação das telas do `README.md` em **Next.js 16 (App Router) + TypeScript + CSS Modules**.
O `Barbearia Tech.dc.html` foi usado só como referência visual; nada dele foi copiado e o
`support.js` não foi portado.

## Rodar

```bash
npm install
npm run dev        # site: http://localhost:3000 · painel: http://localhost:3000/admin
npm run build      # build de produção
npm run typecheck  # tsc --noEmit
```

Acesso do painel em desenvolvimento: usuário `admin` (ou `rafa`, `teo`, `jonas`),
senha `barbearia123`.

## Estrutura

```
app/
  layout.tsx            fontes (next/font), tokens de acento vindos da config, <BookingProvider>
  page.tsx              a home: Header, Hero, Serviços, Galeria, Unidades, Depoimentos, CTA, Footer
  globals.css           tokens do design system + keyframes riseIn/fadeIn
  api/availability/     GET  disponibilidade por unidade + profissional + dia
  api/bookings/         POST agendamento (grava na agenda)
  api/payments/         POST intenção de pagamento · GET [id] status
  admin/login/          acesso da equipe
  admin/(dash)/         painel protegido: visão geral e agendamentos
  admin/actions.ts      server actions: entrar, sair, concluir, cancelar, reagendar
config/
  brand.ts              TUDO que muda por cliente: nome, logo, cores, serviços, unidades,
                        profissionais, horários, contatos, formas de pagamento, flag de preços
  content.ts            textos da página e do painel
  staff.ts              quem acessa o painel (admin e barbeiros)
components/
  Header, Hero, Services, Gallery, Units, Testimonials, CtaBand, Footer  (+ *.module.css)
  BookButton.tsx        ilha cliente usada por qualquer "Agendar"
  booking/              modal: provider, sheet, Step* (inclui checkout), useBookingFlow
  admin/                AdminNav, AppointmentCard, RescheduleForm, SubmitButton, admin.module.css
lib/
  types.ts  dates.ts  money.ts  api.ts
  store.ts              repositório de agendamentos (JSON em .data/)
  seed.ts               histórico de demonstração
  availability.ts       grade da unidade menos o que já está agendado
  metrics.ts            indicadores do painel
  auth.ts  payments.ts
styles/shared.module.css  container, section, eyebrow, legenda de placeholder
```

As seções são Server Components; só o header, os botões de agendar e o modal são client.

## White label

Trocar de cliente = editar `config/brand.ts` (e a copy em `config/content.ts`).
Nenhum componente conhece "Barbearia Tech".

- **Cor de acento**: `brand.colors` alimenta `--accent`, `--accent-hover` e `--accent-soft`
  no `<html>`; todo o CSS usa as variáveis.
- **Logo**: `logoLetter` enquanto `logoImage` for `null`.
- **Preços**: `showPrices: false` troca por "sob consulta" (card), "—" (modal) e
  "a combinar" (total).
- **Fotos**: cada item de `gallery` tem `image: null` → placeholder listrado. Ao definir a
  URL, o placeholder some. Hero e fachadas seguem placeholders até o cliente enviar as fotos.

## Agendamento

Fluxo unidade → serviço → profissional/dia/horário → dados → confirmação, com validação por
passo (`useBookingFlow`). Trocar de dia limpa o horário; slot ocupado é inclicável; "Fechar"
no sucesso reseta dia, hora, nome e telefone e volta ao passo 1.

- `GET /api/availability?unitId&date&barberId` — a grade da unidade menos o que já está
  agendado (`lib/availability.ts`, lendo a agenda gravada).
- `POST /api/bookings` — valida, grava na agenda (de onde o painel lê) e devolve
  `{ id, status: "confirmed" }`. **Não envia WhatsApp**: plugue aqui o disparo da confirmação.

## Pagamento (checkout simulado)

No passo 4 o cliente escolhe a forma de pagamento — as opções saem de
`brand.payments` (`pix`, `debit`, `credit`, `onsite`), e escolher é obrigatório para
confirmar. Depois de confirmar:

- **Pix, débito ou crédito** → o modal abre sozinho a tela de checkout, com o total, barra de
  progresso e — no Pix — QR placeholder e código copia e cola. O status é consultado até
  aprovar (Pix 3,5 s · débito 2,2 s · crédito 2,8 s) e a tela avança sozinha para a
  confirmação. Sem rodapé: nada para o cliente clicar.
- **Pagar na hora** → não há o que cobrar, vai direto para a confirmação, que mostra o valor
  a pagar na unidade.

Como funciona a simulação (`lib/payments.ts`):

- `POST /api/payments` abre a intenção. **O valor vem do catálogo no servidor**, nunca do
  cliente.
- O id da intenção carrega o instante da aprovação (`pi_<quando>_<meio>_<valor>_<aleatório>`),
  então `GET /api/payments/:id` responde o status sem estado compartilhado — funciona com
  várias instâncias e sobrevive a restart.
- **Nenhuma cobrança é feita e nenhum dado de cartão é pedido.** Num PSP real (Stripe,
  Pagar.me, Mercado Pago…) o cartão vai por campos hospedados do provedor e a confirmação
  chega por webhook, não por polling. Troque `createIntent`/`readIntent` e o contrato do
  front continua igual.
- Sem preço na tela (`showPrices: false`) não há valor a cobrar antecipado: `availablePayments()`
  deixa só "Pagar na hora".

## Dashboard da equipe (`/admin`)

Acesso em `/admin/login`. Usuários em `config/staff.ts`: **admin** (vê tudo) e **rafa**,
**teo**, **jonas** (cada um vê só a própria agenda e o próprio faturamento). Em
desenvolvimento a senha de todos é `barbearia123`; em produção cada acesso precisa da sua
variável (`STAFF_PASSWORD_ADMIN`, `STAFF_PASSWORD_RAFA`, …) e, sem ela, o login não acontece.
Defina também `AUTH_SECRET` — sem ele o app se recusa a assinar sessões em produção.

Sessão: cookie HttpOnly assinado com HMAC (`lib/auth.ts`), 8 horas, verificado no layout do
grupo `(dash)`. **Para produção, troque por um provedor de identidade** (Clerk, Auth.js,
Supabase Auth): 2FA, recuperação de senha e revogação de sessão não estão resolvidos aqui.

Indicadores (`lib/metrics.ts`) — contam **só atendimentos concluídos**, porque agendamento
futuro não é receita e cancelado não conta:

- clientes atendidos: total, hoje e no mês;
- faturamento: total, hoje e no mês;
- ticket médio do mês, cancelamentos do mês e agendamentos futuros;
- faturamento por barbeiro no mês, com barra proporcional, contagem e ticket.

Ações em cada agendamento: **marcar como atendido** (o que também liquida quem paga na
unidade), **reagendar** (data + horários realmente livres, validados de novo no servidor) e
**cancelar**. Barbeiro só age na própria agenda — a checagem é no servidor, dentro da action.
A tela de agendamentos filtra por período, situação, unidade e profissional.

## Persistência

`lib/store.ts` grava os agendamentos em `.data/appointments.json`. Serve para o protótipo
rodar local com dados de verdade; **não é para produção** (sem transação, e em serverless o
disco é efêmero e não é compartilhado). Troque este arquivo por Postgres/Supabase mantendo as
funções — o resto do app só conhece essa interface.

Na primeira leitura, a base é semeada com ~220 agendamentos de demonstração (60 dias de
histórico + próximos dias), determinísticos. Desligue com `SEED_DEMO_DATA=false` e apague
`.data/appointments.json` ao ligar a base real.

Com a agenda gravada, a disponibilidade deixou de ser simulada: o horário some quando o
profissional já tem atendimento, "sem preferência" só some quando todos estão ocupados, e
horário que já passou hoje não aparece.

## Divergências conscientes do protótipo

1. **Breakpoint por CSS, não por JS.** O estado `width` do protótipo saiu; nav desktop vs.
   drawer é `@media (min-width: 860px)`, como o próprio README recomenda para produção.
2. **Disponibilidade assíncrona e real.** Como vem de uma API que lê a agenda, o passo 3
   ganhou estados de carregando, erro (com "Tentar de novo") e vazio. A frase "Escolha um dia
   para ver os horários livres." não existia no protótipo.
3. **Trocar de profissional limpa o horário**, porque a disponibilidade é por profissional.
4. **Envio real no passo 4**: o botão mostra "Enviando…" e trata falha com mensagem de erro.
5. **Checkout**: o protótipo original não tinha pagamento. A tela de pagamento, os rótulos das
   formas de pagamento e os textos do checkout são novos, e o modal passou a ter 6 telas
   (4 passos numerados + checkout + sucesso).
6. **Acessibilidade**: `Esc` fecha o modal, clique no overlay fecha, foco volta para o botão
   que abriu, `aria-pressed` nas opções/chips e `aria-label` nos botões repetidos
   ("Agendar" dos cards). Nada disso muda o visual.
