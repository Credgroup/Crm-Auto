import { mock } from './mockInstance';

// --- DADOS DE DASHBOARD ---
export let mockDashboardOverview = JSON.parse(localStorage.getItem("mock_dashboard_overview") || "null") || {
  totalVendas: 186,
  valorTotal: 42873500.00,
  taxaConversao: "72.4%",
  leadsAtivos: 94,
  qtdSegurosAtivos: 128,
  qtdSegurosPreVenda: 31,
  qtdSegurosCancelados: 7,
  qtdSeguroAdesaoRejeitada: 4,
  graficoVendasMensal: [
    { name: 'Jan', uv: 5200, pv: 3100, amt: 3100 },
    { name: 'Fev', uv: 4800, pv: 2800, amt: 2800 },
    { name: 'Mar', uv: 6100, pv: 4200, amt: 4200 },
    { name: 'Abr', uv: 5500, pv: 3900, amt: 3900 },
    { name: 'Mai', uv: 7200, pv: 5100, amt: 5100 },
    { name: 'Jun', uv: 6800, pv: 4600, amt: 4600 },
    { name: 'Jul', uv: 8100, pv: 5800, amt: 5800 }
  ]
};

let mockSalesLatestStorage = JSON.parse(localStorage.getItem("mock_dashboard_sales_latest") || "null");
if (mockSalesLatestStorage && mockSalesLatestStorage.items && mockSalesLatestStorage.items.length > 0 && !mockSalesLatestStorage.items[0].dtCadastro) {
  // Se o schema antigo (sem dtCadastro) estiver no storage, ignorar e limpar.
  mockSalesLatestStorage = null;
  localStorage.removeItem("mock_dashboard_sales_latest");
}

let mockSalesLatest = mockSalesLatestStorage || {
  items: [
    { idSeguro: 101, nmCliente: "Translog Sudeste Ltda.", nrDocumento: "12.847.221/0001-40", tpCliente: "EMPRESA", idOperacao: 1, idProduto: 5, nmProduto: "Mercedes-Benz Complete F&I", cdStatusSeguro: 449, chStatusSeguro: "449", dsStatusSeguro: "Aprovada", dtEmissao: new Date().toISOString(), vlPremio: 14850.00, idUsuario: 1, nmUsuario: "Mariana Costa", dtCadastro: new Date().toISOString(), dtCancelamento: "", tpCancelamento: "" },
    { idSeguro: 102, nmCliente: "Fernanda Costa", nrDocumento: "298.654.321-07", tpCliente: "PESSOA", idOperacao: 1, idProduto: 3, nmProduto: "Seguro Auto Completo", cdStatusSeguro: 449, chStatusSeguro: "449", dsStatusSeguro: "Aprovada", dtEmissao: new Date(Date.now() - 1800000).toISOString(), vlPremio: 3478.80, idUsuario: 2, nmUsuario: "Ana Gestora", dtCadastro: new Date(Date.now() - 1800000).toISOString(), dtCancelamento: "", tpCancelamento: "" },
    { idSeguro: 103, nmCliente: "Ricardo Almeida Transportes", nrDocumento: "43.218.906/0001-18", tpCliente: "EMPRESA", idOperacao: 1, idProduto: 4, nmProduto: "Crédito Mercedes-Benz Caminhões", cdStatusSeguro: 449, chStatusSeguro: "449", dsStatusSeguro: "Aprovada", dtEmissao: new Date(Date.now() - 3600000).toISOString(), vlPremio: 0.00, idUsuario: 1, nmUsuario: "Mariana Costa", dtCadastro: new Date(Date.now() - 3600000).toISOString(), dtCancelamento: "", tpCancelamento: "" },
    { idSeguro: 104, nmCliente: "Juliana Ribeiro", nrDocumento: "876.543.210-12", tpCliente: "PESSOA", idOperacao: 1, idProduto: 2, nmProduto: "Rastreador Veicular + Seguro Antirroubo", cdStatusSeguro: 449, chStatusSeguro: "449", dsStatusSeguro: "Aprovada", dtEmissao: new Date(Date.now() - 7200000).toISOString(), vlPremio: 718.80, idUsuario: 3, nmUsuario: "Carlos Closer", dtCadastro: new Date(Date.now() - 7200000).toISOString(), dtCancelamento: "", tpCancelamento: "" },
    { idSeguro: 105, nmCliente: "Auto Center São Paulo", nrDocumento: "12.456.789/0001-34", tpCliente: "EMPRESA", idOperacao: 1, idProduto: 7, nmProduto: "Tag de Pedágio ConectCar", cdStatusSeguro: 449, chStatusSeguro: "449", dsStatusSeguro: "Aprovada", dtEmissao: new Date(Date.now() - 14400000).toISOString(), vlPremio: 178.80, idUsuario: 2, nmUsuario: "Ana Gestora", dtCadastro: new Date(Date.now() - 14400000).toISOString(), dtCancelamento: "", tpCancelamento: "" },
    { idSeguro: 106, nmCliente: "Pedro Henrique Souza", nrDocumento: "345.678.901-23", tpCliente: "PESSOA", idOperacao: 1, idProduto: 1, nmProduto: "Vistoria Veicular Cautelar", cdStatusSeguro: 2, chStatusSeguro: "2", dsStatusSeguro: "Pendente", dtEmissao: new Date(Date.now() - 28800000).toISOString(), vlPremio: 189.90, idUsuario: 1, nmUsuario: "Marcos Vendedor", dtCadastro: new Date(Date.now() - 28800000).toISOString(), dtCancelamento: "", tpCancelamento: "" },
    { idSeguro: 107, nmCliente: "Camila Ferreira", nrDocumento: "654.987.321-56", tpCliente: "PESSOA", idOperacao: 1, idProduto: 6, nmProduto: "Assistência 24h Premium", cdStatusSeguro: 449, chStatusSeguro: "449", dsStatusSeguro: "Aprovada", dtEmissao: new Date(Date.now() - 43200000).toISOString(), vlPremio: 358.80, idUsuario: 3, nmUsuario: "Carlos Closer", dtCadastro: new Date(Date.now() - 43200000).toISOString(), dtCancelamento: "", tpCancelamento: "" },
    { idSeguro: 108, nmCliente: "Rodrigo Santos", nrDocumento: "789.012.345-67", tpCliente: "PESSOA", idOperacao: 1, idProduto: 9, nmProduto: "Combo Moto (Financiamento + Seguro)", cdStatusSeguro: 449, chStatusSeguro: "449", dsStatusSeguro: "Aprovada", dtEmissao: new Date(Date.now() - 86400000).toISOString(), vlPremio: 2890.00, idUsuario: 2, nmUsuario: "Ana Gestora", dtCadastro: new Date(Date.now() - 86400000).toISOString(), dtCancelamento: "", tpCancelamento: "" }
  ],
  totalCount: 8
};

let mockSalesUser = JSON.parse(localStorage.getItem("mock_dashboard_sales_user") || "null") || [
  { nmUsuario: "Mariana Costa", emailUsuario: "mariana@demo-fi.com", qtdTotalVendas: 52, vlTotalVendas: 14892500 },
  { nmUsuario: "Rafael Martins", emailUsuario: "rafael@demo-fi.com", qtdTotalVendas: 44, vlTotalVendas: 11980200 },
  { nmUsuario: "Carlos Closer", emailUsuario: "carlos@keepins.com", qtdTotalVendas: 142, vlTotalVendas: 634800 },
  { nmUsuario: "Beatriz SDR", emailUsuario: "beatriz@keepins.com", qtdTotalVendas: 98, vlTotalVendas: 423100 }
];

let mockSalesProduct = JSON.parse(localStorage.getItem("mock_dashboard_sales_product") || "null") || [
  { nmProduto: "Mercedes-Benz Complete F&I", qtdTotalVendas: 68, vlTotalVendas: 1009800.00 },
  { nmProduto: "Crédito Mercedes-Benz Caminhões", qtdTotalVendas: 54, vlTotalVendas: 28650000.00 },
  { nmProduto: "Seguro Caminhão Proteção Total", qtdTotalVendas: 79, vlTotalVendas: 1173150.00 },
  { nmProduto: "Rastreador Veicular + Seguro Antirroubo", qtdTotalVendas: 112, vlTotalVendas: 80505.60 },
  { nmProduto: "Tag de Pedágio ConectCar", qtdTotalVendas: 89, vlTotalVendas: 15911.10 },
  { nmProduto: "Vistoria Veicular Cautelar", qtdTotalVendas: 245, vlTotalVendas: 46525.50 },
  { nmProduto: "Assistência 24h Premium", qtdTotalVendas: 167, vlTotalVendas: 59931.30 },
  { nmProduto: "Financiamento Auto", qtdTotalVendas: 78, vlTotalVendas: 0.00 },
  { nmProduto: "Combo Auto (Financiamento + Seguro)", qtdTotalVendas: 45, vlTotalVendas: 130050.00 }
];

let mockProposalsAll = JSON.parse(localStorage.getItem("mock_dashboard_proposals_all") || "null") || [
  { idProposta: "PRP-FI-001", nmProposta: "Combo Auto - Roberto Souza", account: "Marcos Vendedor", statusProposta: "Aprovada", dtCadastro: new Date(Date.now() - 172800000).toISOString() },
  { idProposta: "PRP-FI-002", nmProposta: "Financiamento Auto - Ana Paula Santos", account: "Ana Gestora", statusProposta: "Em Análise", dtCadastro: new Date(Date.now() - 86400000).toISOString() },
  { idProposta: "PRP-001", nmProposta: "Seguro Auto - Lucas Mendes", account: "Marcos Vendedor", statusProposta: "Aprovada", dtCadastro: new Date().toISOString() },
  { idProposta: "PRP-002", nmProposta: "Rastreador + Seguro - Maria Oliveira", account: "Carlos Closer", statusProposta: "Aprovada", dtCadastro: new Date(Date.now() - 86400000).toISOString() },
  { idProposta: "PRP-003", nmProposta: "Combo Moto - Rodrigo Santos", account: "Ana Gestora", statusProposta: "Aprovada", dtCadastro: new Date(Date.now() - 43200000).toISOString() },
  { idProposta: "PRP-004", nmProposta: "Tag ConectCar - Auto Center SP", account: "Carlos Closer", statusProposta: "Em Análise", dtCadastro: new Date(Date.now() - 28800000).toISOString() },
  { idProposta: "PRP-005", nmProposta: "Vistoria Cautelar - Pedro Souza", account: "Beatriz SDR", statusProposta: "Aprovada", dtCadastro: new Date(Date.now() - 14400000).toISOString() },
  { idProposta: "PRP-006", nmProposta: "Assistência 24h - Camila Ferreira", account: "Carlos Closer", statusProposta: "Aprovada", dtCadastro: new Date(Date.now() - 7200000).toISOString() }
];

// --- DASHBOARD INSURANCE ---
mock.onPost(/api\/crm\/dashboard\/insurance/).reply(() => [200, { sucesso: true, dados: mockDashboardOverview }]);
mock.onGet(/api\/crm\/dashboard\/insurance/).reply(() => [200, { sucesso: true, dados: mockDashboardOverview }]);

// --- DASHBOARD PROPOSALS ---
mock.onPost(/api\/crm\/dashboard\/proposals$/).reply(() => {
  const approved = mockProposalsAll.filter((p: any) => p.statusProposta === "Aprovada").length;
  const responded = mockProposalsAll.filter((p: any) => p.statusProposta === "Em Análise").length;
  return [200, {
    sucesso: true,
    dados: {
      qtdTotalPropostas: mockProposalsAll.length,
      qtdPropostasAprovada: approved,
      qtdPropostasRespondidas: responded,
      qtdPropostasEncerradas: mockProposalsAll.length - approved - responded,
      idOperacao: [1],
      dataInicio: new Date().toISOString().split('T')[0],
      dataFim: new Date().toISOString().split('T')[0],
      dataConsulta: new Date().toISOString()
    }
  }];
});

// --- DETALHE ANALÇTICO DE PROPOSTAS ---
mock.onPost(/api\/crm\/dashboard\/proposals\/all/).reply(() => {
  return [200, {
    sucesso: true,
    dados: {
      items: mockProposalsAll,
      totalCount: mockProposalsAll.length,
      pageNumber: 1,
      pageSize: 10
    }
  }];
});

mock.onPost(/api\/crm\/dashboard\/proposals\/approved/).reply(() => {
  const approved = mockProposalsAll.filter((p: any) => p.statusProposta === "Aprovada");
  return [200, {
    sucesso: true,
    dados: {
      items: approved,
      totalCount: approved.length,
      pageNumber: 1,
      pageSize: 10
    }
  }];
});

mock.onPost(/api\/crm\/dashboard\/proposals\/responded/).reply(() => {
  const responded = mockProposalsAll.filter((p: any) => p.statusProposta === "Em Análise");
  return [200, {
    sucesso: true,
    dados: {
      items: responded,
      totalCount: responded.length,
      pageNumber: 1,
      pageSize: 10
    }
  }];
});

mock.onPost(/api\/crm\/dashboard\/proposals\/closed/).reply(() => {
  const closed = mockProposalsAll.filter((p: any) => p.statusProposta !== "Aprovada" && p.statusProposta !== "Em Análise");
  return [200, {
    sucesso: true,
    dados: {
      items: closed,
      totalCount: closed.length,
      pageNumber: 1,
      pageSize: 10
    }
  }];
});

// --- ANALYTICS DE PROPOSTAS ---
mock.onPost(/api\/crm\/dashboard\/proposals\/analytics/).reply(() => {
  return [200, {
    sucesso: true,
    dados: {
      topBancos: [
        { banco: "Santander", logo: "https://logo.clearbit.com/santander.com.br", qtdCotacoes: 312, qtdAprovadas: 245, taxaAprovacao: 78.5, vlTotalFinanciado: 18450000, ticketMedio: 75306.12 },
        { banco: "Banco BV", logo: "https://logo.clearbit.com/bv.com.br", qtdCotacoes: 287, qtdAprovadas: 198, taxaAprovacao: 69.0, vlTotalFinanciado: 14820000, ticketMedio: 74848.48 },
        { banco: "Banco Pan", logo: "https://logo.clearbit.com/bancopan.com.br", qtdCotacoes: 198, qtdAprovadas: 121, taxaAprovacao: 61.1, vlTotalFinanciado: 8945000, ticketMedio: 73925.62 },
        { banco: "Itaú", logo: "https://logo.clearbit.com/itau.com.br", qtdCotacoes: 156, qtdAprovadas: 112, taxaAprovacao: 71.8, vlTotalFinanciado: 9870000, ticketMedio: 88125.00 },
        { banco: "Bradesco", logo: "https://logo.clearbit.com/bradesco.com.br", qtdCotacoes: 89, qtdAprovadas: 54, taxaAprovacao: 60.7, vlTotalFinanciado: 4230000, ticketMedio: 78333.33 }
      ],
      topSeguradoras: [
        { seguradora: "Porto Seguro", qtdCotacoes: 245, qtdAceitas: 189, taxaAceite: 77.1, vlTotalPremio: 604800, ticketMedio: 3200.00, cobertura: "Compreensiva 100% FIPE" },
        { seguradora: "Suhai", qtdCotacoes: 198, qtdAceitas: 134, taxaAceite: 67.7, vlTotalPremio: 247900, ticketMedio: 1850.00, cobertura: "Roubo/Furto + PT" },
        { seguradora: "Allianz", qtdCotacoes: 167, qtdAceitas: 98, taxaAceite: 58.7, vlTotalPremio: 338100, ticketMedio: 3450.00, cobertura: "Compreensiva Premium" },
        { seguradora: "Tokio Marine", qtdCotacoes: 134, qtdAceitas: 87, taxaAceite: 64.9, vlTotalPremio: 252300, ticketMedio: 2900.00, cobertura: "Compreensiva" },
        { seguradora: "HDI", qtdCotacoes: 78, qtdAceitas: 45, taxaAceite: 57.7, vlTotalPremio: 123750, ticketMedio: 2750.00, cobertura: "Compreensiva Standard" }
      ],
      tendenciaMensal: [
        { mes: "Jan", propostas: 78, aprovadas: 52, taxaConversao: 66.7 },
        { mes: "Fev", propostas: 85, aprovadas: 58, taxaConversao: 68.2 },
        { mes: "Mar", propostas: 112, aprovadas: 82, taxaConversao: 73.2 },
        { mes: "Abr", propostas: 98, aprovadas: 71, taxaConversao: 72.4 },
        { mes: "Mai", propostas: 134, aprovadas: 104, taxaConversao: 77.6 },
        { mes: "Jun", propostas: 145, aprovadas: 112, taxaConversao: 77.2 },
        { mes: "Jul", propostas: 167, aprovadas: 134, taxaConversao: 80.2 }
      ],
      distribuicaoProduto: [
        { produto: "Combo Caminhão", valor: 156, percentual: 18.4 },
        { produto: "Financiamento Caminhão", valor: 134, percentual: 15.8 },
        { produto: "Seguro Auto", valor: 198, percentual: 23.4 },
        { produto: "Rastreador + Seguro", valor: 112, percentual: 13.2 },
        { produto: "Tag ConectCar", valor: 89, percentual: 10.5 },
        { produto: "Combo Auto", valor: 45, percentual: 5.3 },
        { produto: "Financiamento Auto", valor: 78, percentual: 9.2 },
        { produto: "Outros", valor: 35, percentual: 4.2 }
      ],
      cotacoesMaisAceitas: [
        { descricao: "Santander 60x (2.57% a.m.)", tipo: "Financiamento", qtdAceitas: 89, percentualTotal: 12.8 },
        { descricao: "Porto Seguro Compreensiva", tipo: "Seguro", qtdAceitas: 78, percentualTotal: 11.2 },
        { descricao: "Banco BV 48x (2.55% a.m.)", tipo: "Financiamento", qtdAceitas: 67, percentualTotal: 9.6 },
        { descricao: "Suhai Roubo/Furto + PT", tipo: "Seguro", qtdAceitas: 56, percentualTotal: 8.1 },
        { descricao: "Santander 48x (2.45% a.m.)", tipo: "Financiamento", qtdAceitas: 52, percentualTotal: 7.5 },
        { descricao: "Allianz Compreensiva Premium", tipo: "Seguro", qtdAceitas: 43, percentualTotal: 6.2 },
        { descricao: "Banco Pan 60x (2.75% a.m.)", tipo: "Financiamento", qtdAceitas: 38, percentualTotal: 5.5 },
        { descricao: "Banco BV 36x (2.49% a.m.)", tipo: "Financiamento", qtdAceitas: 34, percentualTotal: 4.9 }
      ],
      tempoMedioAprovacao: "2.4 dias",
      ticketMedioGeral: 68450.00,
      propostasPorVendedor: [
        { vendedor: "Marcos Vendedor", total: 187, aprovadas: 145, pendentes: 28, taxa: 77.5 },
        { vendedor: "Ana Gestora", total: 156, aprovadas: 118, pendentes: 24, taxa: 75.6 },
        { vendedor: "Carlos Closer", total: 142, aprovadas: 115, pendentes: 18, taxa: 81.0 },
        { vendedor: "Beatriz SDR", total: 98, aprovadas: 72, pendentes: 16, taxa: 73.5 }
      ]
    }
  }];
});

// --- DASHBOARD SALES ---
mock.onPost(/api\/crm\/dashboard\/sales\s*$/).reply(() => [200, { sucesso: true, dados: {
  vlTotalVendas: mockDashboardOverview.valorTotal || 2456780.50,
  qtdTotalVendas: mockDashboardOverview.totalVendas || 847,
  qtdTotalPreVendas: mockDashboardOverview.qtdSegurosPreVenda || 58,
  qtdTotalPeriodoVendas: (mockDashboardOverview.totalVendas || 847) + (mockDashboardOverview.qtdSegurosPreVenda || 58) + (mockDashboardOverview.qtdSegurosCancelados || 23),
  taxaConversao: parseFloat(mockDashboardOverview.taxaConversao || "18.5"),
  idOperacao: [1],
  dataInicio: new Date().toISOString().split('T')[0],
  dataFim: new Date().toISOString().split('T')[0],
  dataConsulta: new Date().toISOString()
}}]);
mock.onPost(/api\/crm\/dashboard\/sales\/latest/).reply(() => [200, { sucesso: true, dados: mockSalesLatest, traceId: "mock-trace", mensagem: "" }]);
mock.onPost(/api\/crm\/dashboard\/sales\/user/).reply(() => [200, { sucesso: true, dados: mockSalesUser }]);
mock.onPost(/api\/crm\/dashboard\/sales\/product/).reply(() => [200, { sucesso: true, dados: mockSalesProduct }]);

// --- EXPORTAÇ‡Ç•ES PARA INJEÇ‡ÇO EM RUNTIME ---
export function addMockSale(sale: any) {
  const newSale = {
    idSeguro: 200 + mockSalesLatest.items.length,
    nmCliente: sale.nmPessoa || sale.nmCliente || sale.nmSegurado || "Cliente Digital",
    nrDocumento: sale.cpf || "000.000.000-00",
    tpCliente: "PESSOA",
    idOperacao: 1,
    idProduto: sale.idProduto || 5,
    nmProduto: sale.nmProduto || "Produto Digital",
    cdStatusSeguro: 449,
    chStatusSeguro: "449",
    dsStatusSeguro: "Aprovada",
    dtEmissao: new Date().toISOString(),
    vlPremio: parseFloat(sale.vlPremio || "0"),
    idUsuario: 1,
    nmUsuario: sale.nmVendedor || "Vendedor Mock",
    dtCadastro: new Date().toISOString(),
    dtCancelamento: "",
    tpCancelamento: ""
  };
  mockSalesLatest.items.unshift(newSale);
  mockSalesLatest.totalCount = mockSalesLatest.items.length;

  // Incrementar contadores do overview
  mockDashboardOverview.totalVendas += 1;
  mockDashboardOverview.valorTotal += parseFloat(sale.vlPremio || "0");

  // Incrementar ou criar entrada no ranking por produto
  const existingProduct = mockSalesProduct.find((p: any) => p.nmProduto === sale.nmProduto);
  if (existingProduct) {
    existingProduct.qtdTotalVendas += 1;
    existingProduct.vlTotalVendas += parseFloat(sale.vlPremio || "0");
  } else {
    mockSalesProduct.push({
      nmProduto: sale.nmProduto || "Produto Digital",
      qtdTotalVendas: 1,
      vlTotalVendas: parseFloat(sale.vlPremio || "0"),
    });
  }

  // Incrementar vendas do vendedor
  if (mockSalesUser.length > 0) {
    mockSalesUser[0].qtdTotalVendas += 1;
    mockSalesUser[0].vlTotalVendas += parseFloat(sale.vlPremio || "0");
  }

  const saveStorage = () => {
    localStorage.setItem("mock_dashboard_overview", JSON.stringify(mockDashboardOverview));
    localStorage.setItem("mock_dashboard_sales_latest", JSON.stringify(mockSalesLatest));
    localStorage.setItem("mock_dashboard_sales_user", JSON.stringify(mockSalesUser));
    localStorage.setItem("mock_dashboard_sales_product", JSON.stringify(mockSalesProduct));
  };
  saveStorage();

  return newSale;
}

export function addMockDashboardProposal(proposal: any) {
  mockProposalsAll.unshift({
    idProposta: proposal.cdProposta || "PRP-NEW",
    nmProposta: proposal.nmProposta || "Nova Proposta",
    account: "Vendedor Mock",
    statusProposta: proposal.dsStatus || "Aprovada",
    dtCadastro: new Date().toISOString()
  });
  localStorage.setItem("mock_dashboard_proposals_all", JSON.stringify(mockProposalsAll));
}

export function getMockSalesLatest() {
  return mockSalesLatest;
}
