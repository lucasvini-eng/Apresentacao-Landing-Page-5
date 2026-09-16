/**
 * Tiago Manso Assessoria Contábil - Scripts de Interatividade e Funil de Vendas
 */

// ==========================================================================
// CONFIGURAÇÕES GERAIS (Altere aqui o número do WhatsApp da empresa)
// ==========================================================================
const CONFIG = {
  // Insira o número do WhatsApp com DDI + DDD (apenas números)
  // Exemplo: 5511987654321
  whatsappNumber: '5511999999999',
  
  // Mensagem padrão para CTAs gerais
  defaultMessage: 'Olá Tiago Manso! Vim pelo site e gostaria de saber mais sobre a assessoria contábil para a minha empresa.'
};

/**
 * Função utilitária para gerar links do WhatsApp
 */
function getWhatsAppUrl(customMessage) {
  const msg = customMessage || CONFIG.defaultMessage;
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
}

// ==========================================================================
// ESTADO DO FUNIL INTERATIVO DE DIAGNÓSTICO
// ==========================================================================
const funnelState = {
  objective: 'reduzir_impostos',
  segment: 'servicos',
  faturamento: '20k_80k'
};

const labelsMap = {
  objective: {
    abrir_empresa: 'Abrir uma Nova Empresa (CNPJ rápido e sem burocracia)',
    reduzir_impostos: 'Trocar de Contador & Reduzir Impostos Legalmente',
    bpo_financeiro: 'Terceirização do Financeiro (BPO Financeiro)',
    regularizacao: 'Regularizar CNPJ / Desenquadrar MEI para ME'
  },
  segment: {
    servicos: 'Prestadores de Serviços em Geral',
    comercio: 'Comércio / Varejo Físico ou Online',
    saude: 'Médicos, Clínicas e Profissionais da Saúde',
    tecnologia: 'Tecnologia, TI e Startups',
    outro: 'Outro Segmento Empresarial'
  },
  faturamento: {
    novo: 'Ainda vou começar a faturar',
    ate_20k: 'Até R$ 20.000 / mês',
    '20k_80k': 'Entre R$ 20.000 e R$ 80.000 / mês',
    acima_80k: 'Acima de R$ 80.000 / mês'
  }
};

/**
 * Atualiza o diagnóstico interativo e prepara a mensagem do WhatsApp
 */
function updateFunnelResults() {
  const objLabel = labelsMap.objective[funnelState.objective];
  const segLabel = labelsMap.segment[funnelState.segment];
  const fatLabel = labelsMap.faturamento[funnelState.faturamento];

  // Elementos do DOM de resultado
  const resultTitle = document.getElementById('funnel-result-title');
  const resultDesc = document.getElementById('funnel-result-desc');
  const resultBadge = document.getElementById('funnel-result-badge');
  const funnelCtaBtn = document.getElementById('funnel-whatsapp-btn');

  if (!resultTitle || !resultDesc || !resultBadge || !funnelCtaBtn) return;

  // Lógica de recomendação consultiva
  let recommendationTitle = 'Plano de Gestão Contábil Consultiva';
  let recommendationText = 'Sua empresa se enquadra na nossa consultoria com foco em blindagem fiscal e redução de encargos no Simples Nacional ou Lucro Presumido.';
  let badgeText = 'Potencial de Economia: Alto';
  let badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';

  if (funnelState.objective === 'abrir_empresa') {
    recommendationTitle = 'Abertura Express de CNPJ com Isenção de Honorários';
    recommendationText = 'Cuidamos de todo o processo de registro na Junta Comercial, Receita e Prefeitura em até 48h úteis, escolhendo o melhor CNAE para você pagar menos impostos desde o primeiro dia.';
    badgeText = 'Abertura Rápida & Grátis';
    badgeColor = 'bg-red-100 text-red-800 border-red-300';
  } else if (funnelState.objective === 'bpo_financeiro') {
    recommendationTitle = 'BPO Financeiro + Gestão Contábil Integrada';
    recommendationText = 'Elimine tarefas operacionais de contas a pagar, faturamento e fluxo de caixa. Tenha relatórios gerenciais claros para tomada de decisão semanal.';
    badgeText = 'Gestão 100% Terceirizada';
    badgeColor = 'bg-blue-100 text-blue-800 border-blue-300';
  } else if (funnelState.objective === 'regularizacao') {
    recommendationTitle = 'Diagnóstico e Regularização Fiscal Completa';
    recommendationText = 'Analisamos pendências na Receita Federal, desenquadramento do MEI ou parcelamento de débitos tributários com o menor impacto no seu fluxo de caixa.';
    badgeText = 'Regularização Prioritária';
    badgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
  }

  resultTitle.textContent = recommendationTitle;
  resultDesc.textContent = recommendationText;
  resultBadge.textContent = badgeText;
  resultBadge.className = `inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${badgeColor}`;

  // Montagem da mensagem estruturada de alta conversão para o WhatsApp
  const whatsappMessage = `Olá Tiago Manso! Realizei o diagnóstico no site para a minha empresa e gostaria de atendimento:

🎯 Necessidade: ${objLabel}
🏢 Segmento: ${segLabel}
📊 Faturamento Estimado: ${fatLabel}

Pode me orientar sobre os próximos passos para o meu negócio?`;

  funnelCtaBtn.href = getWhatsAppUrl(whatsappMessage);
}

// ==========================================================================
// INICIALIZAÇÃO DE EVENTOS DO DOM
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  // 1. Atualiza todos os links com a classe .dynamic-wa-link
  const dynamicWaLinks = document.querySelectorAll('.dynamic-wa-link');
  dynamicWaLinks.forEach(link => {
    const customText = link.getAttribute('data-wa-text');
    link.href = getWhatsAppUrl(customText);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });

  // 2. Opções Interativas do Funil de Diagnóstico
  const quizOptions = document.querySelectorAll('.quiz-option');
  quizOptions.forEach(option => {
    option.addEventListener('click', () => {
      const stepGroup = option.getAttribute('data-group');
      const value = option.getAttribute('data-value');

      if (!stepGroup || !value) return;

      // Remove a seleção dos irmãos do mesmo grupo
      const siblings = document.querySelectorAll(`.quiz-option[data-group="${stepGroup}"]`);
      siblings.forEach(sib => sib.classList.remove('selected'));

      // Marca o clicado
      option.classList.add('selected');
      funnelState[stepGroup] = value;

      // Atualiza resultado do funil
      updateFunnelResults();
    });
  });

  // Executa uma vez no carregamento para sincronizar
  updateFunnelResults();

  // 3. Acordeão de FAQ (Perguntas Frequentes)
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Fecha todos os outros para manter visual limpo
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });

      // Alterna o atual
      if (isActive) {
        item.classList.remove('active');
      } else {
        item.classList.add('active');
      }
    });
  });

  // 4. Menu Mobile
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.remove('hidden');
    });

    if (mobileMenuClose) {
      mobileMenuClose.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    }

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // 5. Mudança suave na barra de navegação no scroll
  const siteHeader = document.getElementById('main-header');
  if (siteHeader) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        siteHeader.classList.add('shadow-sm', 'bg-white/95');
        siteHeader.classList.remove('bg-white/80');
      } else {
        siteHeader.classList.remove('shadow-sm', 'bg-white/95');
        siteHeader.classList.add('bg-white/80');
      }
    });
  }

  // 6. Notificação amigável no widget do WhatsApp flutuante
  const waFloatingBubble = document.getElementById('wa-floating-bubble');
  if (waFloatingBubble) {
    setTimeout(() => {
      waFloatingBubble.classList.remove('opacity-0', 'pointer-events-none');
      waFloatingBubble.classList.add('opacity-100');
    }, 3500);

    const bubbleClose = document.getElementById('wa-bubble-close');
    if (bubbleClose) {
      bubbleClose.addEventListener('click', (e) => {
        e.stopPropagation();
        waFloatingBubble.classList.add('opacity-0', 'pointer-events-none');
      });
    }
  }

  // 7. Configuração do Modal de Diagnóstico Rápido
  const openModalBtns = document.querySelectorAll('.btn-open-modal');
  const leadModal = document.getElementById('lead-modal');
  const closeModalBtns = document.querySelectorAll('.btn-close-modal');
  const modalForm = document.getElementById('modal-lead-form');

  if (leadModal) {
    openModalBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        leadModal.classList.remove('hidden');
      });
    });

    closeModalBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        leadModal.classList.add('hidden');
      });
    });

    leadModal.addEventListener('click', (e) => {
      if (e.target === leadModal) {
        leadModal.classList.add('hidden');
      }
    });

    if (modalForm) {
      modalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nome = document.getElementById('modal-lead-name')?.value || '';
        const empresa = document.getElementById('modal-lead-company')?.value || '';
        const interesse = document.getElementById('modal-lead-interest')?.value || 'Assessoria Geral';

        const customLeadMsg = `Olá Tiago Manso! Meu nome é ${nome}, da empresa ${empresa || 'em fase de abertura'}. Gostaria de atendimento com prioridade sobre: ${interesse}.`;
        
        window.open(getWhatsAppUrl(customLeadMsg), '_blank');
        leadModal.classList.add('hidden');
      });
    }
  }
});
