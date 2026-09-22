import { mock } from './mockInstance';

// --- ESTADO DINÂMICO ---
let mockProdutos: any[] = [
  {
    idProduto: 1,
    cdProduto: 100,
    nmProduto: "Inspeção Técnica Star Check",
    dsProduto: "Inspeção completa do caminhão com diagnóstico estrutural, mecânico, eletrônico e laudo digital para a operação.",
    dtCadastro: new Date().toISOString(),
    vlParcela: "189.90",
    vlLiquido: "189.90",
    qtParcelas: "1",
    vlIOF: "0.00",
    vlCapital: "0.00",
    tpProduto: 6,
    cdStatus: 1,
    vlCombo: "0.00",
    tpCategoria: 6,
    tpExibicao: 1,
    tpMoeda: 1,
    idParceiroOwner: 1,
    dsLogo: "/assets/fi_products/connected-assistance.png",
    vlPremio: "189.90",
    tpPermiteCotacao: 0,
    tpPermiteProposta: 1,
    tpPermiteVenda: 1,
    subCategoria: "vistoria"
  },
  {
    idProduto: 2,
    cdProduto: 101,
    nmProduto: "Fleet Connect + Proteção de Carga",
    dsProduto: "Telemetria e rastreamento 24h com alertas, recuperação veicular e cobertura para roubo e furto.",
    dtCadastro: new Date().toISOString(),
    vlParcela: "59.90",
    vlLiquido: "55.00",
    qtParcelas: "12",
    vlIOF: "2.00",
    vlCapital: "80000.00",
    tpProduto: 1,
    cdStatus: 1,
    vlCombo: "0.00",
    tpCategoria: 1,
    tpExibicao: 1,
    tpMoeda: 1,
    idParceiroOwner: 1,
    dsLogo: "/assets/fi_products/connected-assistance.png",
    vlPremio: "718.80",
    tpPermiteCotacao: 1,
    tpPermiteProposta: 1,
    tpPermiteVenda: 1,
    subCategoria: "rastreador"
  },
  {
    idProduto: 3,
    cdProduto: 102,
    nmProduto: "Seguro Caminhão Proteção Total",
    dsProduto: "Cobertura para colisão, roubo, furto, incêndio, terceiros, vidros e assistência especializada para veículos pesados.",
    dtCadastro: new Date().toISOString(),
    vlParcela: "289.90",
    vlLiquido: "275.00",
    qtParcelas: "12",
    vlIOF: "15.00",
    vlCapital: "120000.00",
    tpProduto: 1,
    cdStatus: 1,
    vlCombo: "0.00",
    tpCategoria: 1,
    tpExibicao: 1,
    tpMoeda: 1,
    idParceiroOwner: 1,
    dsLogo: "/assets/fi_products/truck-insurance.png",
    vlPremio: "3478.80",
    tpPermiteCotacao: 1,
    tpPermiteProposta: 1,
    tpPermiteVenda: 1,
    subCategoria: "caminhao"
  },
  {
    idProduto: 4,
    cdProduto: 200,
    nmProduto: "Crédito Mercedes-Benz Caminhões",
    dsProduto: "Financiamento para caminhões novos e seminovos com entrada flexível, carência e planos alinhados ao fluxo da operação.",
    dtCadastro: new Date().toISOString(),
    vlParcela: "0.00",
    vlLiquido: "0.00",
    qtParcelas: "60",
    vlIOF: "0.00",
    vlCapital: "0.00",
    tpProduto: 4,
    cdStatus: 1,
    vlCombo: "0.00",
    tpCategoria: 4,
    tpExibicao: 1,
    tpMoeda: 1,
    idParceiroOwner: 1,
    dsLogo: "/assets/fi_products/truck-financing.png",
    vlPremio: "0.00",
    tpPermiteCotacao: 1,
    tpPermiteProposta: 1,
    tpPermiteVenda: 1,
    subCategoria: "veiculo"
  },
  {
    idProduto: 5,
    cdProduto: 300,
    nmProduto: "Mercedes-Benz Complete F&I",
    dsProduto: "Uma proposta integrada com financiamento, seguro do caminhão e serviços essenciais em uma única jornada digital.",
    dtCadastro: new Date().toISOString(),
    vlParcela: "0.00",
    vlLiquido: "0.00",
    qtParcelas: "60",
    vlIOF: "0.00",
    vlCapital: "0.00",
    tpProduto: 5,
    cdStatus: 1,
    vlCombo: "0.00",
    tpCategoria: 5,
    tpExibicao: 1,
    tpMoeda: 1,
    idParceiroOwner: 1,
    dsLogo: "/assets/fi_products/fleet-solutions.png",
    vlPremio: "0.00",
    tpPermiteCotacao: 1,
    tpPermiteProposta: 1,
    tpPermiteVenda: 1,
    subCategoria: "veiculo"
  },
  {
    idProduto: 6,
    cdProduto: 400,
    nmProduto: "Mercedes Service 24h",
    dsProduto: "Atendimento emergencial para caminhões, suporte mecânico, reboque especializado e cobertura nacional 24 horas.",
    dtCadastro: new Date().toISOString(),
    vlParcela: "29.90",
    vlLiquido: "0.00",
    qtParcelas: "12",
    vlIOF: "0.00",
    vlCapital: "0.00",
    tpProduto: 6,
    cdStatus: 1,
    vlCombo: "0.00",
    tpCategoria: 6,
    tpExibicao: 1,
    tpMoeda: 1,
    idParceiroOwner: 1,
    dsLogo: "/assets/fi_products/connected-assistance.png",
    vlPremio: "0.00",
    tpPermiteCotacao: 0,
    tpPermiteProposta: 1,
    tpPermiteVenda: 1,
    subCategoria: "assistencia"
  },
  {
    idProduto: 7,
    cdProduto: 401,
    nmProduto: "Tag Frota Livre",
    dsProduto: "Gestão centralizada de pedágios e estacionamentos, com relatórios por veículo e conciliação para a frota.",
    dtCadastro: new Date().toISOString(),
    vlParcela: "14.90",
    vlLiquido: "0.00",
    qtParcelas: "12",
    vlIOF: "0.00",
    vlCapital: "0.00",
    tpProduto: 6,
    cdStatus: 1,
    vlCombo: "0.00",
    tpCategoria: 6,
    tpExibicao: 1,
    tpMoeda: 1,
    idParceiroOwner: 1,
    dsLogo: "/assets/fi_products/fleet-solutions.png",
    vlPremio: "0.00",
    tpPermiteCotacao: 0,
    tpPermiteProposta: 1,
    tpPermiteVenda: 1,
    subCategoria: "tag"
  },
  {
    idProduto: 8,
    cdProduto: 201,
    nmProduto: "Plano Frota Flex",
    dsProduto: "Crédito estruturado para renovação e expansão de frotas, com cronograma de pagamento ajustado ao negócio.",
    dtCadastro: new Date().toISOString(),
    vlParcela: "0.00",
    vlLiquido: "0.00",
    qtParcelas: "48",
    vlIOF: "0.00",
    vlCapital: "0.00",
    tpProduto: 4,
    cdStatus: 1,
    vlCombo: "0.00",
    tpCategoria: 4,
    tpExibicao: 1,
    tpMoeda: 1,
    idParceiroOwner: 1,
    dsLogo: "/assets/fi_products/fleet-solutions.png",
    vlPremio: "0.00",
    tpPermiteCotacao: 1,
    tpPermiteProposta: 1,
    tpPermiteVenda: 1,
    subCategoria: "veiculo"
  },
  {
    idProduto: 9,
    cdProduto: 301,
    nmProduto: "Pacote Renovação de Frota",
    dsProduto: "Financiamento, seguro e serviços conectados para múltiplos caminhões com gestão unificada da contratação.",
    dtCadastro: new Date().toISOString(),
    vlParcela: "0.00",
    vlLiquido: "0.00",
    qtParcelas: "48",
    vlIOF: "0.00",
    vlCapital: "0.00",
    tpProduto: 5,
    cdStatus: 1,
    vlCombo: "0.00",
    tpCategoria: 5,
    tpExibicao: 1,
    tpMoeda: 1,
    idParceiroOwner: 1,
    dsLogo: "/assets/fi_products/fleet-solutions.png",
    vlPremio: "0.00",
    tpPermiteCotacao: 1,
    tpPermiteProposta: 1,
    tpPermiteVenda: 1,
    subCategoria: "veiculo"
  }
];

// --- LAYOUT DO FORMULÇRIO DINÂMICO (ProductFormHook) ---
const mockProductLayout = {
  idProduto: 1,
  tpLayout: 19856,
  chLayout: "19856",
  nmLayout: "Layout Padrão",
  layout: [
    { type: "titulo_subtitulo", sessao: "Dados do Aparelho", dsTitulo: "Dados do Aparelho", dsSubtitulo: "Informe os dados do dispositivo a ser segurado", visual: true },
    { type: "text", sessao: "Dados do Aparelho", nome: "Marca", campoApi: "marca", obrigatorio: true, tamanho: "50", conteudo: "", visual: true },
    { type: "text", sessao: "Dados do Aparelho", nome: "Modelo", campoApi: "modelo", obrigatorio: true, tamanho: "100", conteudo: "", visual: true },
    { type: "text", sessao: "Dados do Aparelho", nome: "IMEI", campoApi: "imei", obrigatorio: true, tamanho: "15", mask: "numeros", conteudo: "", visual: true },
    { type: "titulo_subtitulo", sessao: "Dados do Segurado", dsTitulo: "Dados do Segurado", dsSubtitulo: "Confirme os dados pessoais", visual: true },
    { type: "text", sessao: "Dados do Segurado", nome: "Nome Completo", campoApi: "nome", obrigatorio: true, tamanho: "200", conteudo: "", visual: true },
    { type: "text", sessao: "Dados do Segurado", nome: "CPF", campoApi: "cpf", obrigatorio: true, tamanho: "14", mask: "cpf", conteudo: "", visual: true },
    { type: "text", sessao: "Dados do Segurado", nome: "Data de Nascimento", campoApi: "dataNascimento", obrigatorio: true, tamanho: "10", mask: "data", conteudo: "", visual: true },
    { type: "text", sessao: "Dados do Segurado", nome: "Email", campoApi: "email", obrigatorio: true, tamanho: "100", conteudo: "", visual: true },
    { type: "text", sessao: "Dados do Segurado", nome: "Celular", campoApi: "celular", obrigatorio: true, tamanho: "15", mask: "celular", conteudo: "", visual: true },
    { type: "titulo_subtitulo", sessao: "Endereço", dsTitulo: "Endereço", dsSubtitulo: "Informe o endereço do segurado", visual: true },
    { type: "text", sessao: "Endereço", nome: "CEP", campoApi: "cep", obrigatorio: true, tamanho: "9", mask: "cep", conteudo: "", visual: true },
    { type: "text", sessao: "Endereço", nome: "Logradouro", campoApi: "logradouro", obrigatorio: true, tamanho: "200", conteudo: "", visual: true },
    { type: "text", sessao: "Endereço", nome: "NÇºmero", campoApi: "numero", obrigatorio: true, tamanho: "10", conteudo: "", visual: true },
    { type: "text", sessao: "Endereço", nome: "Bairro", campoApi: "bairro", obrigatorio: true, tamanho: "100", conteudo: "", visual: true },
    { type: "text", sessao: "Endereço", nome: "Cidade", campoApi: "cidade", obrigatorio: true, tamanho: "100", conteudo: "", visual: true },
    { type: "text", sessao: "Endereço", nome: "UF", campoApi: "uf", obrigatorio: true, tamanho: "2", conteudo: "", visual: true },
  ]
};

const mockProductLayoutFinanciamento = {
  idProduto: 4, // Layout genérico para financiamento/combo/seguro caminhão
  tpLayout: 19857,
  chLayout: "19857",
  nmLayout: "Layout Financiamento",
  layout: [
    { type: "titulo_subtitulo", sessao: "Dados Iniciais do Cliente", dsTitulo: "Dados Iniciais", dsSubtitulo: "Informações básicas para simulação", visual: true },
    { type: "text", sessao: "Dados Iniciais do Cliente", nome: "Nome Completo", campoApi: "nome", obrigatorio: true, tamanho: "200", conteudo: "", visual: true },
    { type: "text", sessao: "Dados Iniciais do Cliente", nome: "CPF", campoApi: "cpf", obrigatorio: true, tamanho: "14", mask: "cpf", conteudo: "", visual: true },
    { type: "titulo_subtitulo", sessao: "Dados do Caminhão", dsTitulo: "Dados do Caminhão", dsSubtitulo: "Informe os dados do caminhão e as condições da compra", visual: true },
    { type: "text", sessao: "Dados do Caminhão", nome: "Placa", campoApi: "placa", obrigatorio: true, tamanho: "8", conteudo: "", visual: true },
    { type: "text", sessao: "Dados do Caminhão", nome: "Ano de Fabricação", campoApi: "anoFabricacao", obrigatorio: true, tamanho: "4", mask: "numeros", conteudo: "", visual: true },
    { type: "text", sessao: "Dados do Caminhão", nome: "Valor do Caminhão", campoApi: "valorVeiculo", obrigatorio: true, tamanho: "20", mask: "brl", conteudo: "", visual: true },
    { type: "text", sessao: "Dados do Caminhão", nome: "Valor da Entrada", campoApi: "valorEntrada", obrigatorio: true, tamanho: "20", mask: "brl", conteudo: "", visual: true },
    { type: "date", sessao: "Dados do Caminhão", nome: "Primeiro Vencimento", campoApi: "dataVencimento", obrigatorio: true, tamanho: "10", conteudo: "", visual: true, dateConfig: "minTodayMax45" }
  ]
};

const mockProductLayoutAuto = {
  idProduto: 8,
  tpLayout: 19858,
  chLayout: "19858",
  nmLayout: "Layout Auto",
  layout: [
    { type: "titulo_subtitulo", sessao: "Dados Iniciais do Cliente", dsTitulo: "Dados Iniciais", dsSubtitulo: "Informações básicas para simulação", visual: true },
    { type: "text", sessao: "Dados Iniciais do Cliente", nome: "CPF", campoApi: "cpf", obrigatorio: true, tamanho: "14", mask: "cpf", conteudo: "", visual: true },
    { type: "text", sessao: "Dados Iniciais do Cliente", nome: "Nome Completo", campoApi: "nome", obrigatorio: true, tamanho: "200", conteudo: "", visual: true },
    { type: "titulo_subtitulo", sessao: "Dados do Veículo", dsTitulo: "Dados do Veículo", dsSubtitulo: "Informe os dados do veículo e as condições da compra", visual: true },
    { type: "text", sessao: "Dados do Veículo", nome: "Placa", campoApi: "placa", obrigatorio: true, tamanho: "8", conteudo: "", visual: true },
    { type: "text", sessao: "Dados do Veículo", nome: "Modelo", campoApi: "modelo", obrigatorio: false, tamanho: "100", conteudo: "", visual: true },
    { type: "text", sessao: "Dados do Veículo", nome: "Ano de Fabricação", campoApi: "anoFabricacao", obrigatorio: true, tamanho: "10", conteudo: "", visual: true },
    { type: "text", sessao: "Dados do Veículo", nome: "Valor do Veículo", campoApi: "valorVeiculo", obrigatorio: true, tamanho: "20", mask: "brl", conteudo: "", visual: true },
    { type: "text", sessao: "Dados do Veículo", nome: "Valor da Entrada", campoApi: "valorEntrada", obrigatorio: true, tamanho: "20", mask: "brl", conteudo: "", visual: true },
    { type: "date", sessao: "Dados do Veículo", nome: "Primeiro Vencimento", campoApi: "dataVencimento", obrigatorio: true, tamanho: "10", conteudo: "", visual: true, dateConfig: "minTodayMax45" }
  ]
};

// --- MOCKS DE AUTO-PREENCHIMENTO ---
mock.onGet(/api\/crm\/client\/find\/\d+/).reply(200, {
  sucesso: true,
  data: {
    nome: "Itamar Soares"
  }
});

mock.onGet(/api\/crm\/vehicle\/find\/.+/).reply(200, {
  sucesso: true,
  data: {
    modelo: "Mercedes-Benz Actros 2653 6x4",
    anoFabricacao: "2025",
    valorVeiculo: "78000000"
  }
});

// --- LISTAGEM (Vitrine) ---
mock.onGet(/api\/crm\/product\/find\/operation\/\d+/).reply((config) => {
  const url = config.url || '';
  const params = new URLSearchParams(url.split('?')[1] || '');
  const pageNumber = parseInt(params.get('pageNumber') || '1');
  const pageSize = parseInt(params.get('pageSize') || '12');
  const categoria = params.get('categoria'); // novo filtro
  const subCategoria = params.get('subCategoria');

  let filtered = mockProdutos;
  if (categoria) {
    const catId = parseInt(categoria);
    // catId: 1 = Seguro, 4 = Financiamento, 5 = Combo, 6 = Serviços
    if (catId === 1) {
      filtered = mockProdutos.filter(p => p.tpCategoria === 1 || p.tpCategoria === 2 || p.tpCategoria === 3);
    } else {
      filtered = mockProdutos.filter(p => p.tpCategoria === catId);
    }
  }

  if (subCategoria && subCategoria !== "all") {
    filtered = filtered.filter(p => p.subCategoria === subCategoria);
  }

  return [200, {
    items: filtered.slice((pageNumber - 1) * pageSize, pageNumber * pageSize),
    totalCount: filtered.length,
    pageNumber,
    pageSize
  }];
});

// --- DETALHE DO PRODUTO ---
mock.onGet(/api\/crm\/product\/find\/\d+$/).reply((config) => {
  const match = config.url?.match(/find\/(\d+)$/);
  const id = match ? parseInt(match[1]) : 1;
  const product = mockProdutos.find(p => p.idProduto === id) || mockProdutos[0];
  return [200, product];
});

// --- LAYOUT DO PRODUTO (ProductFormHook) ---
mock.onGet(/api\/crm\/product\/find\/layouts\/\d+$/).reply((config) => {
  const match = config.url?.match(/find\/layouts\/(\d+)$/);
  const id = match ? parseInt(match[1]) : 1;
  // Retorna layout de financiamento se for financiamento, combo, seguro caminhão ou rastreador
  if (id === 2 || id === 3 || id === 4 || id === 5) {
    return [200, [mockProductLayoutFinanciamento]];
  }
  // Retorna layout de Auto se for Auto
  if (id === 8 || id === 9) {
    return [200, [mockProductLayoutAuto]];
  }
  return [200, [mockProductLayout]];
});

// --- LAYOUT HTML (ProductDialog) ---
mock.onGet(/api\/crm\/product\/find\/layouts\/html\/\d+\/\d+/).reply((config) => {
  const match = config.url?.match(/html\/\d+\/(\d+)/);
  const id = match ? Number(match[1]) : 5;
  const product = mockProdutos.find((item) => item.idProduto === id) || mockProdutos[0];
  const isFinancing = [4, 5, 8, 9].includes(id);
  const details = {
    descricao: product.dsProduto,
    caracteristicas: isFinancing
      ? [
          { nome: "Prazo", valor: "Até 60 meses" },
          { nome: "Entrada", valor: "A partir de 20%" },
          { nome: "Carência", valor: "Até 90 dias" },
          { nome: "Contratação", valor: "Jornada digital" },
          { nome: "Veículos", valor: "Novos e seminovos" },
          { nome: "Análise", valor: "Retorno simulado imediato" }
        ]
      : [
          { nome: "Cobertura", valor: "Nacional" },
          { nome: "Atendimento", valor: "24 horas" },
          { nome: "Contratação", valor: "100% digital" },
          { nome: "Gestão", valor: "Portal unificado" }
        ],
    faq: [
      { question: "A simulação gera compromisso?", answer: "Não. O vendedor pode comparar as alternativas antes de enviar a proposta ao cliente." },
      { question: "Posso combinar crédito, seguro e serviços?", answer: "Sim. O pacote Complete F&I consolida as escolhas em uma única proposta digital." },
      { question: "Os valores são definitivos?", answer: "Nesta demonstração os valores são simulados. Em produção, dependem da análise de crédito e das integrações contratadas." }
    ]
  };
  return [200, [{ idHtml: id, chHtml: 4, dsHtml: JSON.stringify(details) }]];
});

// --- POST genérico de produto ---
mock.onPost(/api\/crm\/product/).reply(200, { data: mockProdutos, total: mockProdutos.length });

// --- SIMULAÇ‡ÇO DE COTAÇ‡Ç•ES (Financiamento / Combo) ---
mock.onPost(/api\/crm\/financing\/simulate/).reply((config) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        const body = JSON.parse(config.data || '{}');
        const rawValorVeiculo = body.valorVeiculo ? String(body.valorVeiculo) : "0";
        const rawValorEntrada = body.valorEntrada ? String(body.valorEntrada) : "0";
        
        const valorVeiculo = parseFloat(rawValorVeiculo.replace(/\D/g, '')) / 100 || 110000;
        const valorEntrada = parseFloat(rawValorEntrada.replace(/\D/g, '')) / 100 || 0;
        const valorFinanciadoBase = valorVeiculo - valorEntrada;
        
        // Função realista para simular o CET de mercado
        const getPmt = (pvBase: number, rateMonth: number, n: number) => {
          const tarifas = 2315.54; 
          const iof = pvBase * 0.0368; 
          const pvReal = pvBase + tarifas + iof;
          const r = rateMonth / 100;
          return (pvReal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        };

        const response: any = {
          sucesso: true,
          simulacoes: [
            // Santander
            { idCotacao: 1, banco: "Santander", logo: "https://logo.clearbit.com/santander.com.br", parcelas: 60, valorParcela: getPmt(valorFinanciadoBase, 2.57, 60).toFixed(2), taxa: "2.57%", entrada: valorEntrada, justificativa: "Melhor taxa baseada no CET real pelo perfil Santander Auto." },
            { idCotacao: 2, banco: "Santander", logo: "https://logo.clearbit.com/santander.com.br", parcelas: 48, valorParcela: getPmt(valorFinanciadoBase, 2.45, 48).toFixed(2), taxa: "2.45%", entrada: valorEntrada },
            { idCotacao: 3, banco: "Santander", logo: "https://logo.clearbit.com/santander.com.br", parcelas: 36, valorParcela: getPmt(valorFinanciadoBase, 2.39, 36).toFixed(2), taxa: "2.39%", entrada: valorEntrada },
            { idCotacao: 4, banco: "Santander", logo: "https://logo.clearbit.com/santander.com.br", parcelas: 24, valorParcela: getPmt(valorFinanciadoBase, 2.30, 24).toFixed(2), taxa: "2.30%", entrada: valorEntrada },
            
            // Banco BV
            { idCotacao: 5, banco: "Banco BV", logo: "https://logo.clearbit.com/bv.com.br", parcelas: 60, valorParcela: getPmt(valorFinanciadoBase, 2.65, 60).toFixed(2), taxa: "2.65%", entrada: valorEntrada, justificativa: "Retorno de comissionamento elevado para a revenda." },
            { idCotacao: 6, banco: "Banco BV", logo: "https://logo.clearbit.com/bv.com.br", parcelas: 48, valorParcela: getPmt(valorFinanciadoBase, 2.55, 48).toFixed(2), taxa: "2.55%", entrada: valorEntrada },
            { idCotacao: 7, banco: "Banco BV", logo: "https://logo.clearbit.com/bv.com.br", parcelas: 36, valorParcela: getPmt(valorFinanciadoBase, 2.49, 36).toFixed(2), taxa: "2.49%", entrada: valorEntrada },
            { idCotacao: 8, banco: "Banco BV", logo: "https://logo.clearbit.com/bv.com.br", parcelas: 24, valorParcela: getPmt(valorFinanciadoBase, 2.42, 24).toFixed(2), taxa: "2.42%", entrada: valorEntrada },
            
            // Banco Pan
            { idCotacao: 9, banco: "Banco Pan", logo: "https://logo.clearbit.com/bancopan.com.br", parcelas: 60, valorParcela: getPmt(valorFinanciadoBase, 2.75, 60).toFixed(2), taxa: "2.75%", entrada: valorEntrada, justificativa: "Maior flexibilidade para score baixo." },
            { idCotacao: 10, banco: "Banco Pan", logo: "https://logo.clearbit.com/bancopan.com.br", parcelas: 48, valorParcela: getPmt(valorFinanciadoBase, 2.68, 48).toFixed(2), taxa: "2.68%", entrada: valorEntrada },
            { idCotacao: 11, banco: "Banco Pan", logo: "https://logo.clearbit.com/bancopan.com.br", parcelas: 36, valorParcela: getPmt(valorFinanciadoBase, 2.58, 36).toFixed(2), taxa: "2.58%", entrada: valorEntrada },
            { idCotacao: 12, banco: "Banco Pan", logo: "https://logo.clearbit.com/bancopan.com.br", parcelas: 24, valorParcela: getPmt(valorFinanciadoBase, 2.48, 24).toFixed(2), taxa: "2.48%", entrada: valorEntrada }
          ]
        };

        // Se for produto que aceita Seguro
        if ([4, 5, 8, 9].includes(Number(body.idProduto))) {
          response.seguros = [
            { idCotacao: 101, seguradora: "Porto Seguro", cobertura: "Compreensiva (100% FIPE)", valorPremio: 3200.00, valorFranquia: 2500.00 },
            { idCotacao: 102, seguradora: "Suhai", cobertura: "Roubo/Furto + PT (Econômico)", valorPremio: 1850.00, valorFranquia: 0.00 },
            { idCotacao: 103, seguradora: "Allianz", cobertura: "Compreensiva Premium", valorPremio: 3450.00, valorFranquia: 2800.00 }
          ];
        }

        resolve([200, response]);
      } catch (error) {
        resolve([500, { sucesso: false, mensagem: "Erro no mock de simulação" }]);
      }
    }, 1500);
  });
});
