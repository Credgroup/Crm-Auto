const translations = {
  "pt-BR": {
    "product.simulateNow": "Simular Agora",
    "product.buyNow": "Comprar Agora",
    "product.cancel": "Cancelar",
    "product.back": "Voltar",
    "product.advance": "Avançar",
    "product.finish": "Finalizar",
    "product.overview": "Visão Geral",
    "product.quotations": "Cotações",
    "product.summary": "Resumo",
    "product.payment": "Pagamento",
    "product.availablePlans": "Planos disponíveis",
    "product.seeAll": "Ver todos",
    "product.allPlans": "Todos os Planos",
    "product.prevPlan": "Plano anterior",
    "product.nextPlan": "Próximo plano",
    "product.features": "Características",
    "product.faq": "Perguntas Frequentes",
    "product.success": "Dados enviados com sucesso!",
    "product.successDesc": "Obrigado por utilizar nosso sistema de vendas! Seus dados foram enviados com sucesso.",
    "product.backToProducts": "Voltar para produtos",
    "product.errorLoadingLayout": "Erro ao carregar o layout do produto",
    "product.loadQuotations": "Analisando dados e gerando cotações...",
    "product.noQuotations": "Nenhuma cotação disponível para este perfil.",
    "product.financingQuotes": "Cotações de Financiamento",
    "product.insuranceQuotes": "Cotações de Seguro Auto",
    "product.valueInstallment": "Valor Parcela",
    "product.monthlyRate": "Taxa Mensal",
    "product.downPayment": "Entrada",
    "product.cashPayment": "Prêmio à vista",
    "product.deductible": "Franquia",
    "product.recommended": "Recomendado Systemcred",
    "product.recommendedDesc": "Taxa de juros reduzida e aprovação facilitada.",
    "product.commission": "Comissão",
    "commission.available": "Comissões disponíveis",
    "commission.processed": "Comissões processadas",
    "product.status": "Status",
    "product.date": "Data",
    "product.selected": "Selecionado",
    "product.unselected": "Não selecionado",
    "product.partnerBV": "Banco BV",
    "product.partnerSantander": "Santander",
    "product.partnerPan": "Banco Pan",
    "product.quoteDetails": "Detalhes das Cotações",
    "validation.requiredFields": "Preencha todos os campos obrigatórios. (*)",
    "validation.maxLength": "Campo {name} deve ter no máximo {tamanho} caracteres",
    "validation.invalidDate": "Data inválida",
    "validation.dateFormat": "Campo {name} deve ter 8 caracteres (DD-MM-YYYY)",
    "validation.requiredField": "Campo {name} é obrigatório",
    "sales.storefront": "Vitrine de Soluções F&I",
    "sales.insurance": "Seguros",
    "sales.financing": "Financiamento",
    "sales.combo": "Combo",
    "sales.services": "Serviços",
    "sales.sub.all": "Todos",
    "sales.sub.auto": "Seguro Auto",
    "sales.sub.truck": "Seguro Caminhão",
    "sales.sub.prestamista": "Proteção Financeira",
    "sales.sub.garantia": "Garantia Estendida",
    "sales.sub.tracker": "Rastreador + Seguro",
    "sales.sub.heavy": "Pesados / Caminhões",
    "sales.sub.towing": "Assistência Guincho",
    "sales.sub.tag": "Tag de Pedágio",
    "sales.sub.inspection": "Vistoria Cautelar"
  },
  "en-US": {
    "product.simulateNow": "Simulate Now",
    "product.buyNow": "Buy Now",
    "product.cancel": "Cancel",
    "product.back": "Back",
    "product.advance": "Next",
    "product.finish": "Finish",
    "product.overview": "Overview",
    "product.quotations": "Quotations",
    "product.summary": "Summary",
    "product.payment": "Payment",
    "product.availablePlans": "Available plans",
    "product.seeAll": "See all",
    "product.allPlans": "All Plans",
    "product.prevPlan": "Previous plan",
    "product.nextPlan": "Next plan",
    "product.features": "Features",
    "product.faq": "FAQ",
    "product.success": "Data sent successfully!",
    "product.successDesc": "Thank you for using our sales system! Your data has been successfully sent.",
    "product.backToProducts": "Back to products",
    "product.errorLoadingLayout": "Error loading product layout",
    "product.loadQuotations": "Analyzing data and generating quotes...",
    "product.noQuotations": "No quotes available for this profile.",
    "product.financingQuotes": "Financing Quotes",
    "product.insuranceQuotes": "Auto Insurance Quotes",
    "product.valueInstallment": "Installment Value",
    "product.monthlyRate": "Monthly Rate",
    "product.downPayment": "Down Payment",
    "product.cashPayment": "Cash Premium",
    "product.deductible": "Deductible",
    "product.recommended": "Recommended by Systemcred",
    "product.recommendedDesc": "Reduced interest rate and facilitated approval.",
    "product.commission": "Commission",
    "commission.available": "Available commissions",
    "commission.processed": "Processed commissions",
    "product.status": "Status",
    "product.date": "Date",
    "product.selected": "Selected",
    "product.unselected": "Not selected",
    "product.partnerBV": "Banco BV",
    "product.partnerSantander": "Santander",
    "product.partnerPan": "Banco Pan",
    "product.quoteDetails": "Quotes Details",
    "validation.requiredFields": "Please fill in all required fields. (*)",
    "validation.maxLength": "Field {name} must have at most {tamanho} characters",
    "validation.invalidDate": "Invalid date",
    "validation.dateFormat": "Field {name} must have 8 characters (DD-MM-YYYY)",
    "validation.requiredField": "Field {name} is required",
    "sales.storefront": "F&I Solutions Showcase",
    "sales.insurance": "Insurance",
    "sales.financing": "Financing",
    "sales.combo": "Combo",
    "sales.services": "Services",
    "sales.sub.all": "All",
    "sales.sub.auto": "Auto Insurance",
    "sales.sub.truck": "Truck Insurance",
    "sales.sub.prestamista": "Credit Protection",
    "sales.sub.garantia": "Extended Warranty",
    "sales.sub.tracker": "Tracker + Insurance",
    "sales.sub.heavy": "Heavy / Trucks",
    "sales.sub.towing": "Towing Assistance",
    "sales.sub.tag": "Toll Tag",
    "sales.sub.inspection": "Inspection"
  }
};

export type Locale = "pt-BR" | "en-US";

let currentLocale: Locale = (localStorage.getItem("locale") as Locale) || "pt-BR";

export function getLocale(): Locale {
  return currentLocale;
}

export function setLocale(locale: Locale) {
  currentLocale = locale;
  localStorage.setItem("locale", locale);
  window.dispatchEvent(new Event("localeChange"));
}

export function t(key: keyof typeof translations["pt-BR"], params?: Record<string, string>): string {
  const dict = translations[currentLocale] || translations["pt-BR"];
  let translation = dict[key] || translations["pt-BR"][key] || key;
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      translation = translation.replace(`{${k}}`, v);
    });
  }
  return translation;
}
