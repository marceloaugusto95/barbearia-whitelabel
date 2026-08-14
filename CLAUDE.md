# Barbearia Tech — protótipo white label

## O que é este projeto
Site white label para barbearias (marca de exemplo: **Barbearia Tech**): landing de uma página com agendamento em 4 passos. O design de referência está em `Barbearia Tech.dc.html` e a especificação completa em `README.md` (cores, tipografia, medidas, textos, estados, validações).

## Regras de trabalho
- `Barbearia Tech.dc.html` é **referência de design**, não código de produção. Recrie as telas na stack do projeto seguindo o `README.md`; não copie o HTML nem porte `support.js`.
- Fidelidade **alta**: respeite os tokens exatos do README (hex, escalas de fonte, raios, min-heights). Se precisar divergir, diga o porquê.
- Não invente conteúdo. Todos os textos em português estão no README — use verbatim. Placeholders de imagem continuam placeholders até o cliente enviar as fotos.
- **Mobile-first e funcional no celular**: breakpoint único em 860px (nav desktop vs. drawer), resto fluido com `clamp()` e `grid auto-fit/minmax`. Alvos de toque nunca abaixo de 44px. Modal de agendamento é bottom-sheet com scroll interno (`max-height: 92vh`).
- Sem sombras: profundidade vem de superfícies escuras + bordas translúcidas. Máximo de 2 fundos por tela.
- Acessibilidade: `aria-label` em botões de ícone (menu, fechar), foco visível, contraste mantido (`#a29c94` é o cinza mais claro permitido sobre fundos escuros).

## White label
Tudo que é específico da marca deve sair de configuração, não de código espalhado: nome, logo, cor de acento (`#d8a85a`), lista de unidades, serviços com preço e duração, profissionais, horários de funcionamento, links de contato/WhatsApp. Exibição de preços é uma flag (mostrar valor ou "sob consulta").

## Agendamento
Fluxo: unidade → serviço → profissional/dia/horário → dados → confirmação. Validação por passo; trocar de dia limpa o horário. No protótipo a disponibilidade é simulada — na implementação real ela vem da API (disponibilidade por unidade + profissional + dia) e o envio faz `POST` do agendamento com confirmação por WhatsApp.

## Definição de pronto
Fluxo completo navegável em 375px e em desktop, sem erro de console, textos e tokens conforme README, e estados vazio/desabilitado/erro tratados.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
