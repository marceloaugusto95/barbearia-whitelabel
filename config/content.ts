/**
 * Textos da página. Ficam fora dos componentes para que cada cliente
 * troque a copy sem tocar em JSX. Verbatim do handoff.
 */
export const content = {
  nav: [
    { href: "#servicos", label: "Serviços" },
    { href: "#unidades", label: "Unidades" },
    { href: "#galeria", label: "Galeria" },
    { href: "#depoimentos", label: "Clientes" },
  ],

  hero: {
    eyebrow: "Barbearia · desde 2019",
    title: "Aqui, sua experiência vai além de um corte.",
    text: "Cortes precisos, barba desenhada no detalhe e um ambiente feito para você relaxar. Agende em segundos, direto do celular.",
    primaryCta: "Faça seu agendamento",
    secondaryCta: "Ver serviços",
    stats: [
      { value: "4 unidades", label: "em toda a cidade" },
      { value: "4,9 / 5", label: "+1.200 avaliações" },
    ],
    imageCaption: "foto principal — barbeiro atendendo cliente",
  },

  services: {
    eyebrow: "Nossos serviços",
    title: "Cada serviço com tempo certo e preço claro",
  },

  gallery: {
    eyebrow: "Galeria",
    title: "O trabalho por dentro",
    text: "Ambientes, cortes e detalhes. Substitua cada quadro pelas fotos da sua barbearia.",
  },

  units: {
    eyebrow: "Nossas unidades",
    title: "Escolha a mais perto de você",
    text: "Todas com o mesmo padrão de atendimento, cadeiras reclináveis e café por conta da casa.",
    imageCaption: "fachada",
    cta: "Agendar nesta unidade",
  },

  testimonials: {
    eyebrow: "Clientes satisfeitos",
    title: "Quem senta na cadeira, volta",
  },

  cta: {
    title: "Sua próxima visita está a três toques de distância.",
    button: "Agendar agora",
  },

  footer: {
    tagline: ["Beleza masculina com precisão.", "Seg a Sáb."],
    navTitle: "Navegue",
    contactTitle: "Contato",
    whatsappLabel: "WhatsApp",
    legal: (brandName: string) =>
      `© 2026 ${brandName}. Protótipo white label — todos os textos e imagens são substituíveis.`,
  },

  /** Dashboard da equipe (administração e barbeiros). */
  admin: {
    brandSuffix: "Painel",
    nav: [
      { href: "/admin", label: "Visão geral" },
      { href: "/admin/agendamentos", label: "Agendamentos" },
    ],
    signOut: "Sair",
    backToSite: "Ver o site",

    login: {
      title: "Acesso da equipe",
      text: "Entre com o usuário da barbearia para ver a agenda e os indicadores.",
      username: "Usuário",
      password: "Senha",
      submit: "Entrar",
      submitting: "Entrando…",
      error: "Usuário ou senha inválidos.",
      demo: (password: string) =>
        `Demonstração: admin, rafa, teo ou jonas — senha ${password}.`,
    },

    dashboard: {
      title: "Visão geral",
      subtitle: (name: string, date: string) => `${name} · ${date}`,
      scopedNotice: "Você vê apenas os seus atendimentos.",
      clientsTitle: "Clientes atendidos",
      revenueTitle: "Faturamento",
      cards: {
        attendedTotal: "Total",
        attendedToday: "Hoje",
        attendedMonth: "No mês",
        revenueTotal: "Total",
        revenueToday: "Hoje",
        revenueMonth: "No mês",
        ticket: "Ticket médio do mês",
        cancelled: "Cancelamentos no mês",
        upcoming: "Agendamentos futuros",
      },
      barbersTitle: "Faturamento por barbeiro",
      barbersHint: "Mês corrente, só atendimentos concluídos.",
      barbersEmpty: "Nenhum atendimento concluído neste mês ainda.",
      todayTitle: "Agenda de hoje",
      todayEmpty: "Nenhum agendamento para hoje.",
      seeAll: "Ver todos os agendamentos",
    },

    appointments: {
      title: "Agendamentos",
      filters: {
        period: "Período",
        periodOptions: {
          today: "Hoje",
          upcoming: "Próximos",
          month: "Este mês",
          all: "Tudo",
        },
        status: "Situação",
        statusAll: "Todas",
        unit: "Unidade",
        unitAll: "Todas",
        barber: "Profissional",
        barberAll: "Todos",
        apply: "Filtrar",
        clear: "Limpar",
      },
      count: (shown: number, total: number) =>
        shown === total
          ? `${total} agendamento(s)`
          : `Mostrando ${shown} de ${total} agendamento(s)`,
      empty: "Nenhum agendamento com esses filtros.",
    },

    status: {
      confirmed: "Confirmado",
      completed: "Concluído",
      cancelled: "Cancelado",
    },
    payment: {
      paid: "Pago",
      pending: "Pagamento pendente",
      onsite: "Paga na unidade",
    },
    card: {
      fields: {
        service: "Serviço",
        unit: "Unidade",
        barber: "Profissional",
        contact: "Contato",
      },
      barberAny: "Sem preferência",
      complete: "Marcar como atendido",
      cancel: "Cancelar",
      cancelConfirm: "Cancelar este agendamento?",
      reschedule: "Reagendar",
      rescheduleClose: "Fechar",
      newDate: "Nova data",
      newTime: "Novo horário",
      save: "Salvar",
      saving: "Salvando…",
      loadingTimes: "Carregando horários…",
      noTimes: "Nenhum horário livre nesse dia.",
      timesError: "Não foi possível carregar os horários.",
      rescheduleError: "Não foi possível reagendar. O horário pode ter sido ocupado.",
      actionError: "Não foi possível concluir a ação.",
    },
  },

  booking: {
    openLabel: "Agendar",
    openLabelMobile: "Agendar horário",
    stepLabels: [
      "Passo 1 de 4 · Unidade",
      "Passo 2 de 4 · Serviço",
      "Passo 3 de 4 · Horário",
      "Passo 4 de 4 · Dados",
      "Pagamento",
      "Agendamento confirmado",
    ],
    primaryLabels: [
      "Continuar",
      "Continuar",
      "Continuar",
      "Confirmar agendamento",
      "",
      "Fechar",
    ],
    back: "Voltar",
    close: "Fechar",
    unit: { title: "Onde você quer ser atendido?" },
    service: { title: "Qual serviço?" },
    time: {
      title: "Dia e horário",
      barberLabel: "Profissional",
      barberAny: "Sem preferência",
      dayLabel: "Dia",
      today: "Hoje",
      timeLabel: "Horário",
      /** Estado vazio: não existe no protótipo, foi acrescentado aqui. */
      pickDay: "Escolha um dia para ver os horários livres.",
      loading: "Carregando horários…",
      empty: "Nenhum horário livre neste dia. Tente outro dia ou outro profissional.",
      error: "Não foi possível carregar os horários. Tente de novo.",
      retry: "Tentar de novo",
    },
    confirm: {
      title: "Confirme seus dados",
      rows: {
        unit: "Unidade",
        service: "Serviço",
        barber: "Profissional",
        when: "Quando",
        total: "Total",
      },
      totalFallback: "a combinar",
      namePlaceholder: "Seu nome",
      phonePlaceholder: "WhatsApp (11) 90000-0000",
      sending: "Enviando…",
      error: "Não foi possível concluir o agendamento. Tente de novo.",
      /** Bloco de pagamento — textos novos, não existiam no protótipo. */
      paymentLabel: "Forma de pagamento",
      methods: {
        pix: "Pix",
        debit: "Cartão de débito",
        credit: "Cartão de crédito",
        onsite: "Pagar na hora",
      },
      methodHints: {
        pix: "Você paga agora pelo Pix e a vaga fica garantida.",
        debit: "Cobrança no débito na hora da confirmação.",
        credit: "Cobrança no crédito na hora da confirmação.",
        onsite: "Você paga direto na unidade, no dia do atendimento.",
      },
    },
    /** Tela de checkout — automática depois de confirmar o agendamento. */
    payment: {
      pixTitle: "Escaneie para pagar com Pix",
      cardTitle: "Processando o pagamento",
      waiting: "Aguardando confirmação do pagamento…",
      approved: "Pagamento aprovado",
      qrCaption: "QR code Pix",
      codeLabel: "Pix copia e cola",
      copy: "Copiar código",
      copied: "Código copiado",
      total: "Total",
      simulated:
        "Pagamento simulado: nenhuma cobrança é feita e nenhum dado de cartão é pedido neste protótipo.",
      error: "Não foi possível confirmar o pagamento.",
      retry: "Tentar de novo",
    },
    done: {
      title: "Horário reservado",
      message: (firstName: string, unit: string, date: string, time: string) =>
        `${firstName}, esperamos você na ${unit} em ${date} às ${time}. Enviamos a confirmação no WhatsApp.`,
      paid: (method: string, total: string) => `Pagamento aprovado · ${method} · ${total}`,
      onsite: (total: string) => `${total} na unidade, no dia do atendimento.`,
    },
  },
} as const;
