# Handoff: Barbearia Tech — site white label + agendamento

## Overview
Protótipo de site institucional white label para barbearias, marca de exemplo "Barbearia Tech". Uma página única (home) com seções de hero, serviços, galeria, unidades, depoimentos, CTA e footer, mais um **fluxo de agendamento em 4 passos** dentro de um modal/bottom-sheet. Objetivo: cliente descobre serviços e agenda horário em poucos toques, no desktop ou no celular.

## About the Design Files
Os arquivos deste pacote são **referências de design feitas em HTML** — protótipos que mostram aparência e comportamento pretendidos, **não código de produção para copiar**. A tarefa é **recriar estes designs no ambiente do codebase de destino** (React, Next.js, Vue, SwiftUI, nativo etc.) usando os padrões e bibliotecas já estabelecidos lá. Se ainda não existe codebase, escolha o framework mais adequado (sugestão: Next.js + React, CSS Modules ou Tailwind) e implemente os designs nele.

Arquivos:
- `Barbearia Tech.dc.html` — o protótipo completo (markup + lógica de estado).
- `support.js` — runtime do ambiente de prototipagem; **não portar**, existe só para abrir o HTML no navegador.
- `CLAUDE.md` (na raiz do pacote/projeto) — instruções persistentes de projeto para o Claude Code CLI.

## Fidelity
**Alta fidelidade (hifi).** Cores, tipografia, espaçamentos, raios e interações são finais. Recriar fielmente, adaptando à stack.

## Screens / Views

### 1. Header (sticky)
- **Purpose**: navegação e acesso permanente ao agendamento.
- **Layout**: `position: sticky; top: 0`, fundo `rgba(14,13,12,0.82)` + `backdrop-filter: blur(14px)`, borda inferior `1px solid rgba(245,242,238,0.08)`. Conteúdo em container `max-width: 1180px`, `padding: 14px 20px`, flex `space-between`.
- **Componentes**:
  - Logo: quadrado 34×34, `border-radius: 9px`, fundo `#d8a85a`, letra "B" em `#0e0d0c`, Space Grotesk 700 17px. Ao lado, nome da marca em Space Grotesk 700 16px, `letter-spacing: 0.14em`, uppercase.
  - Nav desktop (≥860px): links "Serviços / Unidades / Galeria / Clientes", DM Sans 15px, `#cfc9c1`; botão "Agendar" pill (`border-radius: 999px`), fundo `#d8a85a`, texto `#0e0d0c`, `padding: 11px 20px`; hover `#f0c884`.
  - Mobile (<860px): botão hambúrguer 46×46, `border-radius: 12px`, borda `rgba(245,242,238,0.16)`, três barras 2px `#f5f2ee`. Ao abrir, drawer inline abaixo do header: links em coluna, 18px, `padding: 14px 4px`, divisórias `rgba(245,242,238,0.07)`, e botão "Agendar horário" full width, `min-height` ~52px, `border-radius: 14px`. Animação `fadeIn 0.18s ease`.

### 2. Hero (`#top`)
- **Layout**: `padding: clamp(56px,9vw,120px) 20px clamp(64px,8vw,110px)`; grid `repeat(auto-fit, minmax(300px,1fr))`, `gap: clamp(32px,5vw,64px)`, `align-items: center` (duas colunas no desktop, empilha no mobile).
- **Componentes**:
  - Eyebrow: IBM Plex Mono 12px, `letter-spacing: 0.22em`, uppercase, `#d8a85a` — "Barbearia · desde 2019".
  - H1: Space Grotesk 700, `clamp(38px,7vw,66px)`, `line-height: 1.03`, `letter-spacing: -0.02em`, `text-wrap: balance` — "Aqui, sua experiência vai além de um corte."
  - Parágrafo: `clamp(16px,2vw,18px)`, `line-height: 1.6`, `#a29c94`, `max-width: 46ch`.
  - Botões: primário pill `#d8a85a` / `#0e0d0c`, 17px, `padding: 16px 28px`; secundário pill outline `1px solid rgba(245,242,238,0.2)`, hover borda `#d8a85a`.
  - Stats: "4 unidades / em toda a cidade" e "4,9 / 5 / +1.200 avaliações" — número Space Grotesk 26px, legenda 14px `#79736c`.
  - Imagem: placeholder `aspect-ratio: 4/5`, `border-radius: 20px`, fundo `repeating-linear-gradient(135deg, #1b1917 0 14px, #171614 14px 28px)`, legenda mono 12px `#6f6862`. **Substituir por foto real.**
  - Entrada da coluna de texto: `riseIn 0.5s ease both` (opacity 0→1, translateY 14px→0).

### 3. Serviços (`#servicos`)
- Fundo `#131211`, borda superior `rgba(245,242,238,0.07)`, `padding: clamp(56px,7vw,100px) 20px`.
- Eyebrow mono + H2 Space Grotesk 700 `clamp(28px,4.4vw,44px)`, `max-width: 22ch`.
- Grid `repeat(auto-fit, minmax(260px,1fr))`, `gap: 16px`.
- **Card**: fundo `#1a1816`, borda `rgba(245,242,238,0.08)`, `border-radius: 18px`, `padding: 26px 24px 24px`, coluna com `gap: 12px`; hover borda `rgba(216,168,90,0.5)`. Conteúdo: duração (mono 11px, `letter-spacing: 0.16em`, `#79736c`), nome (Space Grotesk 21px), descrição (15px/1.55 `#a29c94`, `flex: 1`), rodapé com preço (Space Grotesk 20px `#d8a85a`) e botão "Agendar" outline pill (`min-height: 44px`, hover preenche em `#d8a85a`). Clicar pré-seleciona o serviço e abre o modal.
- **Dados (exatos)**: Corte de cabelo · 45 min · R$ 60 · "Máquina, tesoura e finalização. Consulta rápida de estilo antes de começar." | Barba desenhada · 30 min · R$ 45 · "Toalha quente, navalha e hidratação. Contorno feito no detalhe." | Combo corte + barba · 1h 15min · R$ 95 · "O pacote completo, com pausa para café entre os dois serviços." | Kids e Teens · 35 min · R$ 50 · "Atendimento paciente para crianças e adolescentes, sem pressa."

### 4. Galeria (`#galeria`)
- Header da seção em flex `space-between`, `align-items: end`, wrap; texto auxiliar 15px `#a29c94`, `max-width: 34ch`.
- Grid `repeat(auto-fit, minmax(220px,1fr))`, `gap: 14px`; itens `aspect-ratio: 1/1`, `border-radius: 14px`, borda `rgba(245,242,238,0.09)`, fundo listrado `repeating-linear-gradient(135deg, #1b1917 0 12px, #161513 12px 24px)`, legenda mono 11px.
- Legendas atuais (placeholders): ambiente da loja, corte finalizado, detalhe navalha, pai e filho, cadeira e espelho, equipe.

### 5. Unidades (`#unidades`)
- Fundo `#131211`, bordas superior e inferior `rgba(245,242,238,0.07)`.
- Grid `repeat(auto-fit, minmax(280px,1fr))`, `gap: 16px`. Card `#1a1816`, borda `rgba(245,242,238,0.08)`, `border-radius: 18px`, `overflow: hidden`: faixa de imagem 120px (listrado `#211e1b/#1b1917`, legenda "[ fachada ]"), corpo `padding: 22px 22px 24px` com nome (Space Grotesk 20px), endereço (15px `#a29c94`), horário (mono 12px `#79736c`) e botão "Agendar nesta unidade" full width, `min-height: 46px`, `border-radius: 12px`, hover preenche `#d8a85a`.
- **Dados**: Unidade Centro — Rua das Palmeiras, 120 — Centro — Seg–Sáb · 09h às 20h | Unidade Jardins — Av. Bela Vista, 880 — Jardins — Seg–Sáb · 10h às 21h | Unidade Parque Norte — Alameda Norte, 45 — Parque Norte — Ter–Sáb · 09h às 19h | Unidade Lago Sul — Q. 12, Bloco C, Loja 4 — Lago Sul — Seg–Sex · 09h às 20h.

### 6. Depoimentos (`#depoimentos`)
- Grid `repeat(auto-fit, minmax(280px,1fr))`, `gap: 16px`; card `#161513`, borda `rgba(245,242,238,0.08)`, `border-radius: 18px`, `padding: 28px 24px`; citação Space Grotesk 18px/1.5, autor 14px `#79736c`.
- Textos: "Ambiente descontraído e moderno. Atendimento excelente e profissionais muito qualificados." — Leonardo A. | "Corte feito com bastante cuidado, esteticamente perfeito. Marquei pelo celular em um minuto." — Gustavo L. | "Levo meu filho desde os 4 anos. Paciência e capricho em todo atendimento." — Marcos V.

### 7. Faixa CTA
- Fundo `#d8a85a`, texto `#0e0d0c`; flex wrap `space-between`, `gap: 28px`. H2 Space Grotesk 700 `clamp(26px,4vw,40px)`, `max-width: 22ch` — "Sua próxima visita está a três toques de distância." Botão pill `#0e0d0c` / `#f5f2ee`, `padding: 18px 32px`, hover `#2a2724`.

### 8. Footer
- Fundo `#0b0a09`, `padding: 56px 20px 40px`; grid `repeat(auto-fit, minmax(220px,1fr))`, `gap: 32px`: marca + tagline ("Beleza masculina com precisão. / Seg a Sáb."), coluna "Navegue", coluna "Contato" (@barbeariatech, WhatsApp, contato@barbeariatech.com). Linha final 13px `#5f5952` com borda superior `rgba(245,242,238,0.08)`, `padding-top: 22px`, `margin-top: 40px`.

### 9. Modal de agendamento (4 passos + sucesso)
- **Overlay**: `position: fixed; inset: 0`, `background: rgba(6,6,5,0.72)`, `backdrop-filter: blur(6px)`, `align-items: flex-end` (bottom-sheet, igual em mobile e desktop), `fadeIn 0.2s`.
- **Sheet**: `max-width: 560px`, `max-height: 92vh`, `overflow-y: auto`, fundo `#131211`, borda `rgba(245,242,238,0.12)`, `border-radius: 24px 24px 0 0`, `padding: 22px 22px 28px`, `riseIn 0.28s ease both`.
- **Topo**: rótulo de passo mono 11px `#d8a85a` ("Passo 1 de 4 · Unidade", "… 2 de 4 · Serviço", "… 3 de 4 · Horário", "… 4 de 4 · Dados", "Agendamento confirmado") + botão fechar 44×44 `border-radius: 12px`, glifo ×.
- **Passo 1 — Unidade**: título Space Grotesk 24px "Onde você quer ser atendido?"; lista de opções full width, `padding: 16px 18px`, `min-height: 56px`, `border-radius: 14px`, fundo `#1a1816` / selecionado `rgba(216,168,90,0.12)` com borda `#d8a85a`; nome 17px + endereço 14px `#a29c94`.
- **Passo 2 — Serviço**: mesmas opções; linha superior com nome (17px) e preço (`#d8a85a` 15px) em `space-between`, duração 14px `#a29c94` abaixo.
- **Passo 3 — Dia e horário**: três blocos com label mono/uppercase 13px `#79736c`:
  - Profissional: chips ("Sem preferência", "Rafa", "Téo", "Jonas") — `padding: 12px 16px`, `min-height: 46px`, `border-radius: 12px`, `white-space: nowrap`; selecionado fundo `#d8a85a`, texto `#0e0d0c`.
  - Dia: faixa horizontal com scroll (`overflow-x: auto`), 8 dias a partir de hoje; chip `min-width: 72px`, centralizado, dia da semana 12px uppercase (primeiro = "Hoje") + número Space Grotesk 19px.
  - Horário: grid `repeat(auto-fill, minmax(88px,1fr))`, `gap: 8px`; slots 09:00, 09:45, 10:30, 11:15, 13:00, 13:45, 14:30, 15:15, 16:00, 16:45, 17:30, 18:15. Slots ocupados: `opacity: 0.3`, `line-through`, `cursor: not-allowed`, desabilitados. No protótipo a indisponibilidade é simulada por dia (`TIMES[(i*3)%n]` e `TIMES[(i*5+2)%n]`); **na produção vem da API de disponibilidade**.
- **Passo 4 — Dados**: resumo em card `#1a1816`, `border-radius: 14px`, `padding: 18px`, linhas `space-between` 15px (rótulo `#79736c`): Unidade, Serviço, Profissional, Quando (data longa pt-BR + hora), Total. Dois inputs `min-height: 52px`, fundo `#1a1816`, borda `rgba(245,242,238,0.14)`, `border-radius: 12px`, 16px: "Seu nome" e "WhatsApp (11) 90000-0000".
- **Sucesso**: círculo 62px `#d8a85a` com ✓, título Space Grotesk 26px "Horário reservado", mensagem 16px `#a29c94` `max-width: 34ch` com primeiro nome, unidade, data e hora + aviso de confirmação por WhatsApp.
- **Rodapé do modal**: "Voltar" (outline, aparece do passo 2 em diante, nunca no sucesso) + botão primário `flex: 1`, `min-height: 52px`, `border-radius: 14px`. Habilitado `#d8a85a`/`#0e0d0c`; desabilitado fundo `rgba(245,242,238,0.12)`, texto `#79736c`, `cursor: not-allowed`. Rótulos: "Continuar" nos passos 1–3, "Confirmar agendamento" no 4, "Fechar" no sucesso.

## Interactions & Behavior
- Navegação por âncoras com `scroll-behavior: smooth`; links do drawer fecham o menu ao clicar.
- Qualquer botão "Agendar" abre o modal no passo 1; "Agendar" de um card de serviço pré-seleciona o serviço; "Agendar nesta unidade" pré-seleciona a unidade. Abrir o modal fecha o drawer.
- Validação por passo (botão primário desabilitado até cumprir): passo 1 unidade escolhida; passo 2 serviço escolhido; passo 3 dia **e** horário escolhidos; passo 4 nome com >1 caractere e telefone com >5 caracteres.
- Trocar de dia limpa o horário selecionado. Slot ocupado é inclicável.
- "Fechar" no sucesso reseta dia, hora, nome e telefone e volta ao passo 1.
- Animações: `fadeIn` 0.18–0.2s ease; `riseIn` 0.28–0.5s ease (opacity + translateY 14px).
- Responsivo: breakpoint único em **860px** (nav desktop vs. hambúrguer). Todo o resto é fluido via `clamp()` e `auto-fit/minmax` — sem media queries adicionais. Alvos de toque ≥44px.

## State Management
Estado local da página (nenhum backend no protótipo):
- `width` (listener de `resize`; ≥860 = desktop) — na produção prefira CSS media queries e dispense esse estado.
- `menuOpen`, `bookingOpen`, `step` (0–4: unit, service, time, confirm, done).
- `unit` (índice|null), `service` (índice|null), `barber` (índice, default 0), `dayIndex` (índice|null), `time` (string|null), `name`, `phone`.
Dados de serviços, unidades, barbeiros e horários estão hardcoded em arrays. Na produção: `GET` de unidades/serviços/profissionais, `GET` de disponibilidade por unidade+profissional+dia, `POST` do agendamento com resposta de confirmação e envio de WhatsApp.

## Design Tokens
- **Cores**: fundo base `#0e0d0c`; superfícies `#131211`, `#161513`, `#1a1816`, `#1b1917`, `#211e1b`; footer `#0b0a09`; texto `#f5f2ee`, secundário `#cfc9c1`, mudo `#a29c94`, mais mudo `#79736c`, `#6f6862`, `#5f5952`; acento `#d8a85a`, acento hover `#f0c884`; bordas `rgba(245,242,238,0.07|0.08|0.09|0.10|0.12|0.14|0.16|0.18|0.20)`; overlay `rgba(6,6,5,0.72)`; header `rgba(14,13,12,0.82)`; seleção suave `rgba(216,168,90,0.12)`.
- **Tipografia**: Space Grotesk 500/700 (títulos, números); DM Sans 400/500 (corpo, UI); IBM Plex Mono 400 (eyebrows, metadados, legendas de placeholder). Escalas: H1 `clamp(38px,7vw,66px)`/1.03/-0.02em; H2 `clamp(28px,4.4vw,44px)`/1.1/-0.015em; H3 20–26px; corpo 15–18px/1.5–1.6; eyebrow 12px/0.22em uppercase; meta 11–13px.
- **Espaçamento**: 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 32, 36, 40, 44, 56px; seções `clamp(56px,7–9vw,100–120px)`; container `1180px` com `padding: 0 20px`.
- **Raios**: 9, 12, 14, 18, 20, 24 (sheet: `24px 24px 0 0`), 999 (pill).
- **Sombras**: nenhuma — profundidade vem de superfícies e bordas. Blur: header 14px, overlay 6px.
- **Alturas mínimas**: chips 46, botões de card 44–46, inputs e CTA de modal 52, opções de lista 56.

## Assets
Nenhum asset real. Todas as imagens são **placeholders listrados** com legenda em monospace: foto principal do hero (4:5), 6 quadrados de galeria (1:1), 4 faixas de fachada (120px). A logo é um quadrado com a letra "B" — substituir pela marca do cliente. Fontes: Google Fonts (Space Grotesk, DM Sans, IBM Plex Mono).

## Files
- `Barbearia Tech.dc.html` — protótipo completo: markup no `<x-dc>` (estilos inline) e lógica em `class Component` (dados, estado, handlers, estilos dinâmicos de chips/opções).
- `support.js` — runtime de prototipagem; ignorar na implementação.
