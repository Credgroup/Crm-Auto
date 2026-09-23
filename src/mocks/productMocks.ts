import { mock } from './mockInstance';

// --- ESTADO DINÂMICO ---
let mockProdutos: any[] = [
  {
    idProduto: 10,
    cdProduto: 105,
    nmProduto: "Seguro Auto",
    dsProduto: "Cobertura completa para automóveis e veículos leves: colisão, roubo, furto, incêndio, terceiros, vidros e assistência 24h com cotação multi-seguradora (Porto Seguro, Tokio Marine e Zurich Seguros).",
    dtCadastro: new Date().toISOString(),
    vlParcela: "165.00",
    vlLiquido: "165.00",
    qtParcelas: "12",
    vlIOF: "10.00",
    vlCapital: "150000.00",
    tpProduto: 1,
    cdStatus: 1,
    vlCombo: "0.00",
    tpCategoria: 1,
    tpExibicao: 1,
    tpMoeda: 1,
    idParceiroOwner: 1,
    dsLogo: "/assets/fi_products/seguro-auto.png",
    vlPremio: "1980.00",
    tpPermiteCotacao: 1,
    tpPermiteProposta: 1,
    tpPermiteVenda: 1,
    subCategoria: "auto"
  },
  {
    idProduto: 3,
    cdProduto: 102,
    nmProduto: "Seguro Caminhão",
    dsProduto: "Proteção especializada para veículos pesados e extrapesados Mercedes-Benz: colisão, roubo, furto, carga, terceiros (RCF-V) e guincho 24h sem limite de km com cotação multi-seguradora em tempo real.",
    dtCadastro: new Date().toISOString(),
    vlParcela: "245.80",
    vlLiquido: "245.80",
    qtParcelas: "12",
    vlIOF: "15.00",
    vlCapital: "780000.00",
    tpProduto: 1,
    cdStatus: 1,
    vlCombo: "0.00",
    tpCategoria: 1,
    tpExibicao: 1,
    tpMoeda: 1,
    idParceiroOwner: 1,
    dsLogo: "/assets/fi_products/truck-insurance.png",
    vlPremio: "2950.00",
    tpPermiteCotacao: 1,
    tpPermiteProposta: 1,
    tpPermiteVenda: 1,
    subCategoria: "caminhao"
  },
  {
    idProduto: 11,
    cdProduto: 103,
    nmProduto: "Seguro de Proteção Financeira",
    dsProduto: "Proteção completa para o seu financiamento - Cobertura que garante a quitação da dívida em caso de falecimento (natural ou acidental) ou invalidez permanente total por acidente. Para Pessoa Jurídica, o benefício será conforme a participação societária. Além disso, os beneficiários ou o próprio segurado recebem o saldo remanescente",
    dtCadastro: new Date().toISOString(),
    vlParcela: "79.90",
    vlLiquido: "79.90",
    qtParcelas: "60",
    vlIOF: "0.00",
    vlCapital: "536400.00",
    tpProduto: 260,
    cdStatus: 1,
    vlCombo: "0.00",
    tpCategoria: 1,
    tpExibicao: 1,
    tpMoeda: 1,
    idParceiroOwner: 1,
    dsLogo: "/assets/fi_products/protecao-finan.png",
    vlPremio: "4794.00",
    tpPermiteCotacao: 0,
    tpPermiteProposta: 1,
    tpPermiteVenda: 1,
    subCategoria: "prestamista",
    produtosAgrupado: [
      {
        idProduto: 1101,
        nmProduto: "Proteção Total (Prestamista Plus)",
        dsProduto: "Quitação de 100% da dívida do financiamento em caso de falecimento ou invalidez permanente total por acidente. Saldo remanescente garantido ao segurado/beneficiários e participação societária para PJ.",
        vlParcela: "79.90",
        qtParcelas: "60",
        vlPremio: "4794.00"
      },
      {
        idProduto: 1102,
        nmProduto: "Proteção Básica (Prestamista Flex)",
        dsProduto: "Garante a quitação do saldo devedor até o limite contratado em caso de falecimento acidental ou IPTA, com devolução de excedente.",
        vlParcela: "49.90",
        qtParcelas: "60",
        vlPremio: "2994.00"
      }
    ]
  },
  {
    idProduto: 12,
    cdProduto: 104,
    nmProduto: "Seguro de Garantia Estendida",
    dsProduto: "Proteção completa para o seu veículo - Garantimos a cobertura com peças genuínas do seu caminhão e atendimento nas Concessionárias Mercedes-Benz. Cobertura e benefícios personalizados.",
    dtCadastro: new Date().toISOString(),
    vlParcela: "149.00",
    vlLiquido: "149.00",
    qtParcelas: "24",
    vlIOF: "0.00",
    vlCapital: "780000.00",
    tpProduto: 260,
    cdStatus: 1,
    vlCombo: "0.00",
    tpCategoria: 1,
    tpExibicao: 1,
    tpMoeda: 1,
    idParceiroOwner: 1,
    dsLogo: "/assets/fi_products/insurance-extend.png",
    vlPremio: "3576.00",
    tpPermiteCotacao: 0,
    tpPermiteProposta: 1,
    tpPermiteVenda: 1,
    subCategoria: "garantia",
    produtosAgrupado: [
      {
        idProduto: 1201,
        nmProduto: "Proteção Total (Extend Plus)",
        dsProduto: "Proteção completa para o seu veículo - Cobertura para o Trem de Força (Chassi) e Sistema elétrico; peças genuínas e atendimento nas Concessionárias Mercedes-Benz.",
        vlParcela: "189.00",
        qtParcelas: "24",
        vlPremio: "4536.00"
      },
      {
        idProduto: 1202,
        nmProduto: "Proteção Básica (Extend)",
        dsProduto: "Proteção completa para o seu veículo - Cobertura para o Trem de Força (Chassi); peças genuínas e atendimento nas Concessionárias Mercedes-Benz.",
        vlParcela: "119.00",
        qtParcelas: "24",
        vlPremio: "2856.00"
      }
    ]
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
    dsLogo: "/assets/fi_products/carga-seguros.png",
    vlPremio: "718.80",
    tpPermiteCotacao: 0,
    tpPermiteProposta: 1,
    tpPermiteVenda: 1,
    subCategoria: "rastreador"
  },
  {
    idProduto: 5,
    cdProduto: 300,
    nmProduto: "Mercedes-Benz Complete F&I",
    dsProduto: "Uma proposta integrada combinando o financiamento contratado, seguro multi-seguradora e proteções essenciais em uma única jornada digital.",
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
    vlPremio: "358.80",
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
    vlPremio: "178.80",
    tpPermiteCotacao: 0,
    tpPermiteProposta: 1,
    tpPermiteVenda: 1,
    subCategoria: "tag"
  }
];

// --- LAYOUT DO FORMULÁRIO DINÂMICO (ProductFormHook) ---
const mockProductLayoutDefault = {
  idProduto: 1,
  tpLayout: 19856,
  chLayout: "19856",
  nmLayout: "Layout Padrão",
  layout: [
    { type: "titulo_subtitulo", sessao: "Dados do Segurado", dsTitulo: "Dados do Cliente", dsSubtitulo: "Confirme os dados para associação ao contrato", visual: true },
    { type: "text", sessao: "Dados do Segurado", nome: "Nome Completo", campoApi: "nome", obrigatorio: true, tamanho: "200", conteudo: "Itamar Soares", visual: true },
    { type: "text", sessao: "Dados do Segurado", nome: "CPF / CNPJ", campoApi: "cpf", obrigatorio: true, tamanho: "18", mask: "cpf", conteudo: "123.456.789-00", visual: true },
    { type: "text", sessao: "Dados do Segurado", nome: "Email", campoApi: "email", obrigatorio: true, tamanho: "100", conteudo: "itamar.soares@empresa.com.br", visual: true },
    { type: "text", sessao: "Dados do Segurado", nome: "Celular", campoApi: "celular", obrigatorio: true, tamanho: "15", mask: "celular", conteudo: "(11) 98765-4321", visual: true },
    { type: "titulo_subtitulo", sessao: "Veículo & Financiamento", dsTitulo: "Veículo & Financiamento Contratado", dsSubtitulo: "Informações vinculadas ao financiamento ativo", visual: true },
    { type: "text", sessao: "Veículo & Financiamento", nome: "Modelo do Veículo", campoApi: "modelo", obrigatorio: true, tamanho: "100", conteudo: "Mercedes-Benz Actros 2653 6x4", visual: true },
    { type: "text", sessao: "Veículo & Financiamento", nome: "Placa (Opcional p/ 0 KM)", campoApi: "placa", obrigatorio: false, tamanho: "8", conteudo: "BRA2E19", visual: true },
    { type: "text", sessao: "Veículo & Financiamento", nome: "Número do Chassi", campoApi: "chassi", obrigatorio: false, tamanho: "17", conteudo: "9BM963032MB123456", visual: true },
    { type: "text", sessao: "Veículo & Financiamento", nome: "Financiamento Vinculado", campoApi: "financiamentoExistente", obrigatorio: false, tamanho: "100", conteudo: "Banco Mercedes-Benz (60x de R$ 8.940,00 - Ativo)", visual: true }
  ]
};

const mockProductLayoutAuto = {
  idProduto: 10,
  tpLayout: 19858,
  chLayout: "19858",
  nmLayout: "Layout Seguro Auto",
  layout: [
    { type: "titulo_subtitulo", sessao: "Dados Iniciais do Cliente", dsTitulo: "Dados do Cliente", dsSubtitulo: "Informações cadastrais para emissão", visual: true },
    { type: "text", sessao: "Dados Iniciais do Cliente", nome: "Nome Completo", campoApi: "nome", obrigatorio: true, tamanho: "200", conteudo: "Itamar Soares", visual: true },
    { type: "text", sessao: "Dados Iniciais do Cliente", nome: "CPF", campoApi: "cpf", obrigatorio: true, tamanho: "14", mask: "cpf", conteudo: "123.456.789-00", visual: true },
    { type: "titulo_subtitulo", sessao: "Dados do Veículo", dsTitulo: "Dados do Veículo", dsSubtitulo: "Informações do automóvel para cotação", visual: true },
    { type: "text", sessao: "Dados do Veículo", nome: "Modelo", campoApi: "modelo", obrigatorio: true, tamanho: "100", conteudo: "Mercedes-Benz Classe C 300 AMG Line", visual: true },
    { type: "text", sessao: "Dados do Veículo", nome: "Placa (Opcional p/ 0 KM)", campoApi: "placa", obrigatorio: false, tamanho: "8", conteudo: "MER3C00", visual: true },
    { type: "text", sessao: "Dados do Veículo", nome: "Número do Chassi", campoApi: "chassi", obrigatorio: false, tamanho: "17", conteudo: "WDD2050401R123456", visual: true },
    { type: "text", sessao: "Dados do Veículo", nome: "Ano de Fabricação", campoApi: "anoFabricacao", obrigatorio: true, tamanho: "4", mask: "numeros", conteudo: "2025", visual: true },
    { type: "text", sessao: "Dados do Veículo", nome: "Valor do Veículo (FIPE / NF)", campoApi: "valorVeiculo", obrigatorio: true, tamanho: "20", mask: "brl", conteudo: "30000000", visual: true },
    { type: "text", sessao: "Dados do Veículo", nome: "Financiamento Vinculado", campoApi: "financiamentoExistente", obrigatorio: false, tamanho: "100", conteudo: "Banco Mercedes-Benz (48x R$ 3.850,00)", visual: true }
  ]
};

const mockProductLayoutFinanciamento = {
  idProduto: 4,
  tpLayout: 19857,
  chLayout: "19857",
  nmLayout: "Layout Seguro e Cotação",
  layout: [
    { type: "titulo_subtitulo", sessao: "Dados Iniciais do Cliente", dsTitulo: "Dados do Cliente", dsSubtitulo: "Informações cadastrais para emissão", visual: true },
    { type: "text", sessao: "Dados Iniciais do Cliente", nome: "Nome Completo", campoApi: "nome", obrigatorio: true, tamanho: "200", conteudo: "Itamar Soares", visual: true },
    { type: "text", sessao: "Dados Iniciais do Cliente", nome: "CPF", campoApi: "cpf", obrigatorio: true, tamanho: "14", mask: "cpf", conteudo: "123.456.789-00", visual: true },
    { type: "titulo_subtitulo", sessao: "Dados do Veículo", dsTitulo: "Dados do Veículo Financiado", dsSubtitulo: "Financiamento já ativo no Banco Mercedes-Benz", visual: true },
    { type: "text", sessao: "Dados do Veículo", nome: "Modelo", campoApi: "modelo", obrigatorio: true, tamanho: "100", conteudo: "Mercedes-Benz Actros 2653 6x4", visual: true },
    { type: "text", sessao: "Dados do Veículo", nome: "Placa (Opcional p/ 0 KM)", campoApi: "placa", obrigatorio: false, tamanho: "8", conteudo: "BRA2E19", visual: true },
    { type: "text", sessao: "Dados do Veículo", nome: "Número do Chassi", campoApi: "chassi", obrigatorio: false, tamanho: "17", conteudo: "9BM963032MB123456", visual: true },
    { type: "text", sessao: "Dados do Veículo", nome: "Ano de Fabricação", campoApi: "anoFabricacao", obrigatorio: true, tamanho: "4", mask: "numeros", conteudo: "2025", visual: true },
    { type: "text", sessao: "Dados do Veículo", nome: "Valor do Veículo (FIPE / NF)", campoApi: "valorVeiculo", obrigatorio: true, tamanho: "20", mask: "brl", conteudo: "78000000", visual: true },
    { type: "text", sessao: "Dados do Veículo", nome: "Financiamento Vinculado", campoApi: "financiamentoExistente", obrigatorio: false, tamanho: "100", conteudo: "Banco Mercedes-Benz (60x R$ 8.940,00)", visual: true }
  ]
};

// --- MOCKS DE AUTO-PREENCHIMENTO ---
mock.onGet(/api\/crm\/client\/find\/\d+/).reply(200, {
  sucesso: true,
  data: {
    nome: "Itamar Soares",
    cpf: "123.456.789-00",
    email: "itamar.soares@empresa.com.br",
    telefone: "(11) 98765-4321"
  }
});

mock.onGet(/api\/crm\/vehicle\/find\/.+/).reply((config) => {
  const url = config.url || '';
  const match = url.match(/find\/(.+)$/);
  const placa = match ? match[1].toUpperCase() : '';

  // Se for placa de caminhão ou modelo pesado
  if (placa.includes("ACT") || placa === "BRA2E19" || placa.includes("TRUCK") || placa.includes("2653")) {
    return [200, {
      sucesso: true,
      data: {
        modelo: "Mercedes-Benz Actros 2653 6x4",
        anoFabricacao: "2025",
        valorVeiculo: "78000000",
        chassi: "9BM963032MB123456",
        financiamentoExistente: "Banco Mercedes-Benz (60x de R$ 8.940,00 - Ativo)"
      }
    }];
  }

  // Padrão: Busca de veículo para automóvel / Mercedes Classe C (R$ 300.000,00)
  return [200, {
    sucesso: true,
    data: {
      modelo: "Mercedes-Benz Classe C 300 AMG Line",
      anoFabricacao: "2025",
      valorVeiculo: "30000000",
      chassi: "WDD2050401R123456",
      financiamentoExistente: "Banco Mercedes-Benz (48x de R$ 3.850,00 - Ativo)"
    }
  }];
});

// --- LISTAGEM (Vitrine) ---
mock.onGet(/api\/crm\/product\/find\/operation\/\d+/).reply((config) => {
  const url = config.url || '';
  const params = new URLSearchParams(url.split('?')[1] || '');
  const pageNumber = parseInt(params.get('pageNumber') || '1');
  const pageSize = parseInt(params.get('pageSize') || '12');
  const categoria = params.get('categoria');
  const subCategoria = params.get('subCategoria');

  let filtered = mockProdutos;
  if (categoria) {
    const catId = parseInt(categoria);
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

// --- DETALHE DO PRODUTO (Suporta busca por subprodutos) ---
mock.onGet(/api\/crm\/product\/find\/\d+$/).reply((config) => {
  const match = config.url?.match(/find\/(\d+)$/);
  const id = match ? parseInt(match[1]) : 3;
  let product = mockProdutos.find(p => p.idProduto === id);
  if (!product) {
    for (const parent of mockProdutos) {
      if (parent.produtosAgrupado) {
        const sub = parent.produtosAgrupado.find((s: any) => s.idProduto === id);
        if (sub) {
          product = {
            ...parent,
            ...sub,
            idProduto: sub.idProduto,
            nmProduto: sub.nmProduto,
            dsProduto: sub.dsProduto,
            vlParcela: sub.vlParcela,
            qtParcelas: sub.qtParcelas,
            vlPremio: sub.vlPremio
          };
          break;
        }
      }
    }
  }
  return [200, product || mockProdutos[0]];
});

// --- LAYOUT DO PRODUTO (ProductFormHook) ---
mock.onGet(/api\/crm\/product\/find\/layouts\/\d+$/).reply((config) => {
  const match = config.url?.match(/find\/layouts\/(\d+)$/);
  const id = match ? parseInt(match[1]) : 3;
  if (id === 10) {
    return [200, [mockProductLayoutAuto]];
  }
  if (id === 3 || id === 4 || id === 5 || id === 2) {
    return [200, [mockProductLayoutFinanciamento]];
  }
  return [200, [mockProductLayoutDefault]];
});

// --- LAYOUT HTML (ProductDialog) ---
mock.onGet(/api\/crm\/product\/find\/layouts\/html\/\d+\/\d+/).reply((config) => {
  const match = config.url?.match(/html\/\d+\/(\d+)/);
  const id = match ? Number(match[1]) : 3;
  const product = mockProdutos.find((item) => item.idProduto === id) || mockProdutos[0];

  let details: any;

  if (id === 10) {
    // Seguro Auto
    details = {
      descricao: "Cobertura completa para automóveis e veículos leves: colisão, roubo, furto, incêndio, terceiros, vidros e assistência 24h com cotação multi-seguradora em tempo real.",
      caracteristicas: [
        { nome: "Multi-Seguradoras", valor: "Porto Seguro, Tokio Marine e Zurich Seguros" },
        { nome: "Cobertura Principal", valor: "Compreensiva 100% FIPE + RCF-V Terceiros" },
        { nome: "Assistência 24h", valor: "Guincho com km estendido e troca de pneus" },
        { nome: "Franquia", valor: "Opções de franquia reduzida e parcelamento em até 12x" }
      ],
      faq: [
        {
          question: "Como funciona a cotação do Seguro Auto?",
          answer: "O sistema cota simultaneamente em Porto Seguro, Tokio Marine e Zurich Seguros para apresentar as melhores opções para o cliente de acordo com o veículo."
        },
        {
          question: "Possui carro reserva?",
          answer: "Sim, os planos incluem assistência com opção de carro reserva de 7 a 15 dias."
        }
      ]
    };
  } else if (id === 3) {
    // Seguro Caminhão
    details = {
      descricao: "Proteção especializada para veículos pesados e frotas Mercedes-Benz: colisão, roubo, furto, carga, terceiros (RCF-V) e guincho 24h sem limite de km com cotação multi-seguradora.",
      caracteristicas: [
        { nome: "Multi-Seguradoras", valor: "Porto Seguro, Tokio Marine e Zurich Seguros" },
        { nome: "Cobertura Pesados", valor: "Compreensiva 100% FIPE + RCF-V Danos Corporais e Materiais" },
        { nome: "Assistência 24h", valor: "Guincho especializado sem limite de km" },
        { nome: "Reparo", valor: "Atendimento na rede autorizada Mercedes-Benz com peças genuínas" }
      ],
      faq: [
        {
          question: "Como funciona a comparação de 3 seguradoras para caminhões?",
          answer: "Nossa mesa digital cota simultaneamente com Porto Seguro, Tokio Marine e Zurich Seguros para apresentar a melhor relação custo x benefício para a sua operação de transporte."
        },
        {
          question: "O guincho atende veículos com carga pesada?",
          answer: "Sim, assistência técnica e reboque pesado especializado 24 horas em todo o Brasil."
        }
      ]
    };
  } else if (id === 11 || id === 1101 || id === 1102) {
    // Seguro Prestamista
    details = {
      descricao: "Proteção completa para o seu financiamento - Cobertura que garante a quitação da dívida em caso de falecimento (natural ou acidental) ou invalidez permanente total por acidente. Para Pessoa Jurídica, o benefício será conforme a participação societária. Além disso, os beneficiários ou o próprio segurado recebem o saldo remanescente.",
      caracteristicas: [
        { nome: "Quitação de Dívida", valor: "Garante saldo devedor do financiamento" },
        { nome: "Coberturas", valor: "Morte natural/acidental e Invalidez Permanente (IPTA)" },
        { nome: "Pessoa Jurídica", valor: "Benefício proporcional à participação societária" },
        { nome: "Saldo Remanescente", valor: "Pago aos beneficiários ou próprio segurado" },
        { nome: "Sorteios Mensais", valor: "Títulos de capitalização inclusos" },
        { nome: "Contratação", valor: "100% digital acoplada ao financiamento" }
      ],
      faq: [
        {
          question: "Como funciona a quitação do financiamento?",
          answer: "Em caso de sinistro coberto (falecimento ou invalidez permanente por acidente), a seguradora quita o saldo devedor diretamente junto à instituição financeira."
        },
        {
          question: "O que acontece se houver saldo remanescente?",
          answer: "Se o valor da cobertura contratada for maior do que o saldo devedor da dívida na data do evento, a diferença é paga diretamente ao segurado ou aos seus herdeiros/beneficiários legais."
        },
        {
          question: "Como se aplica o benefício para Pessoa Jurídica (PJ)?",
          answer: "Para contratos celebrados em nome de PJ, a indenização respeitará estritamente o percentual de participação societária do sócio/dirigente segurado."
        }
      ]
    };
  } else if (id === 12 || id === 1201 || id === 1202) {
    // Garantia Estendida
    details = {
      descricao: "Proteção completa para o seu veículo - Garantimos a cobertura com peças genuínas do seu caminhão e atendimento nas Concessionárias Mercedes-Benz. Cobertura e benefícios personalizados.",
      caracteristicas: [
        { nome: "Peças Genuínas", valor: "100% peças originais Mercedes-Benz" },
        { nome: "Rede Autorizada", valor: "Atendimento em todas as Concessionárias Mercedes-Benz do Brasil" },
        { nome: "Proteção Total (Extend Plus)", valor: "Trem de Força (Chassi) e Sistema Elétrico" },
        { nome: "Proteção Básica (Extend)", valor: "Trem de Força (Chassi)" },
        { nome: "Mão de Obra", valor: "Técnicos certificados pela fábrica" },
        { nome: "Histórico", valor: "Valorização do veículo na revenda" }
      ],
      faq: [
        {
          question: "Qual a diferença entre os planos Extend e Extend Plus?",
          answer: "O plano Proteção Básica (Extend) cobre os componentes essenciais do Trem de Força (motor, câmbio e diferencial). O plano Proteção Total (Extend Plus) inclui tudo do Trem de Força mais os módulos eletrônicos e sistema elétrico do caminhão."
        },
        {
          question: "Onde são realizados os reparos?",
          answer: "Exclusivamente nas oficinas autorizadas da rede de Concessionárias Mercedes-Benz em todo o território nacional."
        },
        {
          question: "As peças utilizadas são originais?",
          answer: "Sim, garantia total de utilização de peças genuínas Mercedes-Benz com garantia de fábrica."
        }
      ]
    };
  } else {
    details = {
      descricao: product.dsProduto,
      caracteristicas: [
        { nome: "Cobertura", valor: "Nacional" },
        { nome: "Atendimento", valor: "24 horas" },
        { nome: "Contratação", valor: "100% digital" },
        { nome: "Gestão", valor: "Portal unificado F&I" }
      ],
      faq: [
        { question: "Como funciona a contratação?", answer: "Processo 100% digital com assinatura eletrônica e ativação imediata." },
        { question: "Posso incluir no financiamento existente?", answer: "Sim, as proteções e serviços podem ser vinculados ao contrato do caminhão." }
      ]
    };
  }

  return [200, [{ idHtml: id, chHtml: 4, dsHtml: JSON.stringify(details) }]];
});

// --- POST genérico de produto ---
mock.onPost(/api\/crm\/product/).reply(200, { data: mockProdutos, total: mockProdutos.length });

// --- SIMULAÇÃO DE COTAÇÕES (Multi-Seguradoras & Financiamento Existente) ---
mock.onPost(/api\/crm\/financing\/simulate/).reply((config) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        const body = JSON.parse(config.data || '{}');
        const rawValorVeiculo = body.valorVeiculo ? String(body.valorVeiculo) : "78000000";
        const valorVeiculo = parseFloat(rawValorVeiculo.replace(/\D/g, '')) / 100 || 780000;
        const valorEntrada = Math.round(valorVeiculo * 0.2);
        const isAuto = Number(body.idProduto) === 10;

        // Cálculos dinâmicos baseados no valor do veículo informado
        const seguroPortoPremio = isAuto 
          ? Math.round(Math.max(1800, valorVeiculo * 0.024) * 100) / 100
          : Math.round(Math.max(2800, valorVeiculo * 0.0041) * 100) / 100;
        const seguroPortoFranquia = isAuto
          ? Math.round(Math.max(1500, valorVeiculo * 0.015) * 100) / 100
          : Math.round(Math.max(2200, valorVeiculo * 0.0032) * 100) / 100;

        const seguroTokioPremio = isAuto
          ? Math.round(Math.max(1650, valorVeiculo * 0.021) * 100) / 100
          : Math.round(Math.max(2550, valorVeiculo * 0.00378) * 100) / 100;
        const seguroTokioFranquia = isAuto
          ? Math.round(Math.max(1700, valorVeiculo * 0.017) * 100) / 100
          : Math.round(Math.max(2600, valorVeiculo * 0.0039) * 100) / 100;

        const seguroZurichPremio = isAuto
          ? Math.round(Math.max(1950, valorVeiculo * 0.0255) * 100) / 100
          : Math.round(Math.max(3000, valorVeiculo * 0.0044) * 100) / 100;
        const seguroZurichFranquia = isAuto
          ? Math.round(Math.max(1600, valorVeiculo * 0.016) * 100) / 100
          : Math.round(Math.max(2400, valorVeiculo * 0.0035) * 100) / 100;

        const response: any = {
          sucesso: true,
          veiculoInfo: {
            modelo: isAuto ? (body.modelo || "Mercedes-Benz C 300") : (body.modelo || "Mercedes-Benz Actros 2653 6x4"),
            placa: body.placa || (body.chassi ? "Veículo 0 KM" : "BRA2E19"),
            chassi: body.chassi || "9BM963032MB123456",
            anoFabricacao: body.anoFabricacao || "2025",
            valorVeiculo: valorVeiculo,
            financiamentoExistente: isAuto 
              ? "Banco Mercedes-Benz · 48x de R$ 3.850,00 (Ativo)"
              : "Banco Mercedes-Benz · 60x de R$ 8.940,00 (Ativo)"
          },
          simulacoes: [
            {
              idCotacao: 1,
              banco: "Banco Mercedes-Benz",
              logo: "https://logo.clearbit.com/mercedes-benz.com.br",
              parcelas: isAuto ? 48 : 60,
              valorParcela: isAuto ? "3850.00" : "8940.00",
              taxa: "1.49%",
              entrada: valorEntrada,
              status: "Contratado",
              justificativa: "Financiamento ativo contratado com taxas exclusivas Mercedes-Benz."
            }
          ],
          // 3 PROPOSTAS DE SEGURADORAS DISTINTAS (Porto Seguro, Tokio Marine, Zurich Seguros)
          seguros: isAuto ? [
            {
              idCotacao: 101,
              seguradora: "Porto Seguro",
              cobertura: "Compreensiva (100% FIPE) + Carro Reserva 15 dias",
              valorPremio: seguroPortoPremio,
              valorFranquia: seguroPortoFranquia,
              logo: "https://logo.clearbit.com/portoseguro.com.br",
              destaque: "Carro Reserva 15 Dias",
              beneficios: ["Carro reserva ilimitado 15 dias", "Reparo em Concessionária", "Vidros, faróis e retrovisores", "Assistência 24h completa"]
            },
            {
              idCotacao: 102,
              seguradora: "Tokio Marine",
              cobertura: "Completa Colisão + Roubo/Furto + RCF-V R$ 300.000",
              valorPremio: seguroTokioPremio,
              valorFranquia: seguroTokioFranquia,
              logo: "https://logo.clearbit.com/tokiomarine.com.br",
              destaque: "Melhor Custo x Benefício",
              beneficios: ["RCF Terceiros R$ 300k", "Desconto na franquia", "Guincho 500 km", "Assistência residencial inclusa"]
            },
            {
              idCotacao: 103,
              seguradora: "Zurich Seguros",
              cobertura: "Zurich Auto Premium (100% FIPE + Danos Corporais)",
              valorPremio: seguroZurichPremio,
              valorFranquia: seguroZurichFranquia,
              logo: "https://logo.clearbit.com/zurich.com.br",
              destaque: "Cobertura Completa Zurich",
              beneficios: ["Danos Corporais R$ 400k", "Guincho sem limite", "Peças originais de fábrica", "Desconto em oficinas credenciadas"]
            }
          ] : [
            {
              idCotacao: 101,
              seguradora: "Porto Seguro",
              cobertura: "Compreensiva (100% FIPE) + Vidros e Guincho Ilimitado",
              valorPremio: seguroPortoPremio,
              valorFranquia: seguroPortoFranquia,
              logo: "https://logo.clearbit.com/portoseguro.com.br",
              destaque: "Guincho km Ilimitado",
              beneficios: ["Guincho sem limite de km", "Reparo em Concessionárias Mercedes-Benz", "Carro/Caminhão reserva 15 dias", "Assistência 24h completa"]
            },
            {
              idCotacao: 102,
              seguradora: "Tokio Marine",
              cobertura: "Completa Colisão + Roubo/Furto + RCF-V R$ 500.000",
              valorPremio: seguroTokioPremio,
              valorFranquia: seguroTokioFranquia,
              logo: "https://logo.clearbit.com/tokiomarine.com.br",
              destaque: "Melhor Custo x Benefício",
              beneficios: ["RCF Danos Materiais R$ 500k", "Reparo com peças genuínas", "Desconto de 25% na franquia", "Assistência especializada carga pesada"]
            },
            {
              idCotacao: 103,
              seguradora: "Zurich Seguros",
              cobertura: "Zurich Frota & Pesados Premium (100% FIPE + Danos Corporais)",
              valorPremio: seguroZurichPremio,
              valorFranquia: seguroZurichFranquia,
              logo: "https://logo.clearbit.com/zurich.com.br",
              destaque: "Cobertura Ampliada Terceiros",
              beneficios: ["RCF Danos Corporais R$ 600k", "Assistência Nacional 24h", "Hospedagem e transporte emergencial do motorista", "Peças originais Mercedes-Benz"]
            }
          ]
        };

        resolve([200, response]);
      } catch (error) {
        resolve([500, { sucesso: false, mensagem: "Erro no mock de simulação" }]);
      }
    }, 1200);
  });
});
