import { mock } from './mockInstance';

// --- ESTADO DINÂMICO ---
const initialProposals: any[] = [
  {
    idProposta: "PRP-FI-001",
    idSegurado: "102",
    idSeguradoI2k: "I2K-102",
    nmSegurado: "Roberto Souza",
    cpfSegurado: "123.456.789-01",
    nmProposta: "Combo Caminhão - Roberto Souza",
    dsStatus: "Aprovada",
    chStatusProposta: 1,
    dtCadastro: new Date(Date.now() - 172800000).toISOString(),
    dtEmissao: new Date(Date.now() - 86400000).toISOString(),
    vlPremio: "3478.80",
    idProduto: 5,
    nmProduto: "Combo Caminhão (Financiamento + Seguro)",
    cdProposta: "PRP-FI-001",
    idEmpresaOperacao: "1",
    cotacaoEscolhida: JSON.stringify({
      financing: { idCotacao: 1, banco: "Banco BV", parcelas: 36, valorParcela: "2209.68", taxa: "1.49%", entrada: 20000 },
      insurance: { idCotacao: 101, seguradora: "Porto Seguro", cobertura: "Compreensiva (100% FIPE)", valorPremio: 3200.00, valorFranquia: 2500.00 }
    }),
    simulacoesFinanciamento: [
      { idCotacao: 1, banco: "Banco BV", parcelas: 36, valorParcela: "2209.68", taxa: "1.49%", entrada: 20000, prioritario: true, justificativa: "Melhor taxa e pré-aprovação imediata via Systemcred" },
      { idCotacao: 2, banco: "Banco BV", parcelas: 48, valorParcela: "1767.11", taxa: "1.55%", entrada: 20000, prioritario: true, justificativa: "Taxa preferencial e aprovação facilitada" },
      { idCotacao: 3, banco: "Santander", parcelas: 48, valorParcela: "1826.54", taxa: "1.69%", entrada: 20000, prioritario: false },
      { idCotacao: 4, banco: "Banco Pan", parcelas: 60, valorParcela: "1687.90", taxa: "1.85%", entrada: 20000, prioritario: false }
    ],
    simulacoesSeguro: [
      { idCotacao: 101, seguradora: "Porto Seguro", cobertura: "Compreensiva (100% FIPE)", valorPremio: 3200.00, valorFranquia: 2500.00 },
      { idCotacao: 102, seguradora: "Suhai", cobertura: "Roubo/Furto + PT (Econômico)", valorPremio: 1850.00, valorFranquia: 0.00 },
      { idCotacao: 103, seguradora: "Allianz", cobertura: "Compreensiva Premium", valorPremio: 3450.00, valorFranquia: 2800.00 }
    ],
    historico: [
      { dtEvento: new Date(Date.now() - 172800000).toISOString(), dsEvento: "Proposta criada via formulário de Combo", usuario: "Vendedor Mock" },
      { dtEvento: new Date(Date.now() - 129600000).toISOString(), dsEvento: "Cotação selecionada: Financiamento Banco BV (36x R$ 2209.68) e Seguro Porto Seguro (R$ 3200.00)", usuario: "Vendedor Mock" },
      { dtEvento: new Date(Date.now() - 86400000).toISOString(), dsEvento: "Crédito aprovado no Banco BV automaticamente", usuario: "Banco BV API" },
      { dtEvento: new Date().toISOString(), dsEvento: "Proposta emitida e ativada", usuario: "Sistema" }
    ],
    respostas: [
      { idPergunta: 1, dsPergunta: "Placa do Veículo", dsResposta: "BRA2E19" },
      { idPergunta: 2, dsPergunta: "Ano de Fabricação", dsResposta: "2023" },
      { idPergunta: 3, dsPergunta: "Valor do Veículo", dsResposta: "R$ 480.000,00" },
      { idPergunta: 4, dsPergunta: "Valor da Entrada", dsResposta: "R$ 100.000,00" },
      { idPergunta: 5, dsPergunta: "Renda Mensal", dsResposta: "R$ 28.500,00" },
      { idPergunta: 6, dsPergunta: "RG", dsResposta: "12.345.678-9" },
      { idPergunta: 7, dsPergunta: "Órgão Emissor", dsResposta: "SSP/SP" }
    ],
    documentos: [
      { idDocumento: 10, nmDocumento: "Contrato_Financiamento_BV.pdf", tpDocumento: "Proposta", dtUpload: new Date().toISOString() },
      { idDocumento: 11, nmDocumento: "Apolice_Porto_Seguro.pdf", tpDocumento: "Apólice", dtUpload: new Date().toISOString() }
    ]
  },
  {
    idProposta: "PRP-FI-002",
    idSegurado: "103",
    idSeguradoI2k: "I2K-103",
    nmSegurado: "Ana Paula Santos",
    cpfSegurado: "987.654.321-00",
    nmProposta: "Financiamento Auto - Ana Paula Santos",
    dsStatus: "Em Análise",
    chStatusProposta: 2,
    dtCadastro: new Date(Date.now() - 86400000).toISOString(),
    dtEmissao: new Date().toISOString(),
    vlPremio: "0.00",
    idProduto: 4,
    nmProduto: "Financiamento Auto",
    cdProposta: "PRP-FI-002",
    idEmpresaOperacao: "1",
    cotacaoEscolhida: JSON.stringify({
      financing: { idCotacao: 4, banco: "Banco Pan", parcelas: 60, valorParcela: "1687.90", taxa: "1.85%", entrada: 20000 }
    }),
    simulacoesFinanciamento: [
      { idCotacao: 1, banco: "Banco BV", parcelas: 36, valorParcela: "2209.68", taxa: "1.49%", entrada: 20000, prioritario: true, justificativa: "Melhor taxa e pré-aprovação imediata via Systemcred" },
      { idCotacao: 2, banco: "Banco BV", parcelas: 48, valorParcela: "1767.11", taxa: "1.55%", entrada: 20000, prioritario: true, justificativa: "Taxa preferencial e aprovação facilitada" },
      { idCotacao: 3, banco: "Santander", parcelas: 48, valorParcela: "1826.54", taxa: "1.69%", entrada: 20000, prioritario: false },
      { idCotacao: 4, banco: "Banco Pan", parcelas: 60, valorParcela: "1687.90", taxa: "1.85%", entrada: 20000, prioritario: false }
    ],
    historico: [
      { dtEvento: new Date(Date.now() - 86400000).toISOString(), dsEvento: "Proposta criada via formulário de Financiamento", usuario: "Vendedor Mock" },
      { dtEvento: new Date().toISOString(), dsEvento: "Documentação enviada para análise manual", usuario: "Sistema" }
    ],
    respostas: [
      { idPergunta: 1, dsPergunta: "Placa do Veículo", dsResposta: "PDG4H22" },
      { idPergunta: 2, dsPergunta: "Ano de Fabricação", dsResposta: "2021" },
      { idPergunta: 3, dsPergunta: "Valor do Veículo", dsResposta: "R$ 385.000,00" },
      { idPergunta: 4, dsPergunta: "Valor da Entrada", dsResposta: "R$ 85.000,00" },
      { idPergunta: 5, dsPergunta: "Renda Mensal", dsResposta: "R$ 16.200,00" }
    ],
    documentos: []
  },
  {
    idProposta: "PRP-001",
    idSegurado: "100",
    idSeguradoI2k: "I2K-100",
    nmSegurado: "João da Silva",
    cpfSegurado: "123.456.789-01",
    nmProposta: "Vistoria Cautelar - João da Silva",
    dsStatus: "Aprovada",
    chStatusProposta: 1,
    dtCadastro: new Date().toISOString(),
    dtEmissao: new Date().toISOString(),
    vlPremio: "189.90",
    idProduto: 1,
    nmProduto: "Vistoria Veicular Cautelar",
    cdProposta: "PRP-001",
    idEmpresaOperacao: "1",
    historico: [
      { dtEvento: new Date(Date.now() - 172800000).toISOString(), dsEvento: "Proposta criada", usuario: "Vendedor Mock" },
      { dtEvento: new Date(Date.now() - 86400000).toISOString(), dsEvento: "Vistoria presencial agendada", usuario: "Analista" },
      { dtEvento: new Date().toISOString(), dsEvento: "Laudo aprovado e emitido com sucesso", usuario: "Sistema" }
    ],
    respostas: [
      { idPergunta: 1, dsPergunta: "Qual a marca/modelo do veículo?", dsResposta: "Volvo FH 540" },
      { idPergunta: 2, dsPergunta: "O chassi possui alguma adulteração?", dsResposta: "Não, chassi íntegro" },
      { idPergunta: 3, dsPergunta: "Placa do Veículo", dsResposta: "BRA2E19" }
    ],
    documentos: [
      { idDocumento: 1, nmDocumento: "Laudo_Vistoria_PRP-001.pdf", tpDocumento: "Proposta", dtUpload: new Date().toISOString() }
    ]
  },
  {
    idProposta: "PRP-002",
    idSegurado: "101",
    idSeguradoI2k: "I2K-101",
    nmSegurado: "Maria Oliveira",
    cpfSegurado: "109.876.543-21",
    nmProposta: "Rastreador + Seguro - Maria Oliveira",
    dsStatus: "Em Análise",
    chStatusProposta: 2,
    dtCadastro: new Date(Date.now() - 86400000).toISOString(),
    dtEmissao: new Date().toISOString(),
    vlPremio: "598.80",
    idProduto: 2,
    nmProduto: "Rastreador Veicular + Seguro Antirroubo",
    cdProposta: "PRP-002",
    idEmpresaOperacao: "1",
    historico: [
      { dtEvento: new Date().toISOString(), dsEvento: "Proposta criada e aguardando instalação do rastreador", usuario: "Vendedor Mock" }
    ],
    respostas: [
      { idPergunta: 1, dsPergunta: "Modelo do Veículo", dsResposta: "Scania R450" },
      { idPergunta: 2, dsPergunta: "Modelo do Equipamento", dsResposta: "SASCargo Bloqueador Satélite" }
    ],
    documentos: [],
    simulacoesFinanciamento: []
  }
];

let mockProposals: any[] = JSON.parse(localStorage.getItem("mock_proposals_db") || "null") || initialProposals;

// --- LISTAGEM DE PROPOSTAS POR ID (Tabela Single) ---
mock.onGet(/api\/crm\/proposal\/find\/[A-Za-z0-9-]+(\?|$)/).reply((config) => {
  const url = config.url || '';
  const match = url.match(/find\/([\w-]+)/);
  const id = match ? match[1] : null;
  
  // Evitar conflito com sub-rotas (unique, history, responses, group)
  if (url.includes('/unique/') || url.includes('/history/') || url.includes('/responses/') || url.includes('/group/')) {
    return [200, { items: [], totalCount: 0, pageNumber: 1, pageSize: 10 }];
  }

  if (id) {
    const filtered = mockProposals.filter(p => 
      p.idSegurado === id || p.idSeguradoI2k === id || p.idEmpresaOperacao === id || p.idProposta === id
    );
    return [200, { items: filtered.length > 0 ? filtered : mockProposals, totalCount: filtered.length || mockProposals.length, pageNumber: 1, pageSize: 10 }];
  }
  
  return [200, { items: mockProposals, totalCount: mockProposals.length, pageNumber: 1, pageSize: 10 }];
});

// --- GRUPO DE PROPOSTAS ---
mock.onGet(/api\/crm\/proposal\/find\/group\/\w+/).reply(200, {
  items: [
    { idGrupoProposta: "GRP-001", nmProposta: "Seguro Celular - João da Silva", cdStatus: 1, dtCadastro: new Date().toISOString() },
    { idGrupoProposta: "GRP-002", nmProposta: "Seguro Vida - Maria Oliveira", cdStatus: 2, dtCadastro: new Date(Date.now() - 86400000).toISOString() }
  ],
  totalCount: 2,
  pageNumber: 1,
  pageSize: 10
});

// --- PROPOSTA ÚNICA ---
mock.onGet(/api\/crm\/proposal\/find\/unique\/[\w-]+/).reply((config) => {
  const match = config.url?.match(/unique\/([\w-]+)/);
  const id = match ? match[1] : null;
  const proposal = mockProposals.find(p => p.idProposta === id) || mockProposals[0];
  return [200, proposal];
});

// --- HISTÓRICO DA PROPOSTA ---
mock.onGet(/api\/crm\/proposal\/find\/history\/[\w-]+/).reply((config) => {
  const match = config.url?.match(/history\/([\w-]+)/);
  const id = match ? match[1] : null;
  const proposal = mockProposals.find(p => p.idProposta === id) || mockProposals[0];
  return [200, { items: proposal.historico, totalCount: proposal.historico.length, pageNumber: 1, pageSize: 10 }];
});

// --- RESPOSTAS (Questionário) ---
mock.onGet(/api\/crm\/proposal\/find\/responses\/[\w-]+/).reply((config) => {
  const match = config.url?.match(/responses\/([\w-]+)/);
  const id = match ? match[1] : null;
  const proposal = mockProposals.find(p => p.idProposta === id) || mockProposals[0];
  return [200, { items: proposal.respostas, totalCount: proposal.respostas.length }];
});

// --- DOCUMENTOS DA PROPOSTA ---
mock.onPost(/api\/crm\/document\/find\/groupProposal/).reply(200, {
  items: [
    { idDocumento: 1, nmDocumento: "Proposta_PRP-001.pdf", tpDocumento: "Proposta", dtUpload: new Date().toISOString() },
    { idDocumento: 2, nmDocumento: "Nota_Fiscal.pdf", tpDocumento: "Nota Fiscal", dtUpload: new Date().toISOString() }
  ],
  totalItems: 2
});

// --- OCR DOCUMENTO ---
mock.onPost(/api\/crm\/document\/find\/ocr\/base64/).reply(200, {
  sucesso: true,
  base64: "",
  texto: "Documento processado com sucesso (mock)"
});

// --- ALTERAR STATUS ---
mock.onPost(/api\/crm\/proposal\/update\/status/).reply((config) => {
  try {
    const body = JSON.parse(config.data || '{}');
    const idx = mockProposals.findIndex(p => p.idProposta === body.idProposta);
    if (idx !== -1) {
      mockProposals[idx].dsStatus = body.dsStatus || body.status;
      mockProposals[idx].historico.push({
        dtEvento: new Date().toISOString(),
        dsEvento: `Status alterado para ${body.dsStatus || body.status}`,
        usuario: "Usuário Mock"
      });
    }
    return [200, { sucesso: true, mensagem: "Status atualizado com sucesso" }];
  } catch {
    return [400, { erro: "Bad Request" }];
  }
});

// --- CRIAR PROPOSTA ---
mock.onPost(/api\/crm\/proposal/).reply((config) => {
  try {
    const body = JSON.parse(config.data || '{}');
    const newProposal = {
      ...body,
      idProposta: `PRP-${String(100 + mockProposals.length).padStart(3, '0')}`,
      cdProposta: `PRP-${String(100 + mockProposals.length).padStart(3, '0')}`,
      dsStatus: "Em Análise",
      dtEmissao: new Date().toISOString(),
      historico: [
        { dtEvento: new Date().toISOString(), dsEvento: "Proposta criada", usuario: "Vendedor Mock" }
      ],
      respostas: body.respostas || [],
      documentos: []
    };
    mockProposals.push(newProposal);
    return [201, { sucesso: true, idProposta: newProposal.idProposta, data: newProposal }];
  } catch {
    return [400, { erro: "Bad Request" }];
  }
});

// --- USUÁRIO VINCULADO AO GRUPO ---
mock.onGet(/api\/crm\/user\/group\/\w+/).reply(200, [
  { idUsuarioGrupoProposta: 1, idGrupoProposta: "GRP-001", idUsuario: 1, nmUsuario: "Vendedor Mock", idUsuarioCargo: 1, nmCargoProposta: "Vendedor", dtCadastro: new Date().toISOString() }
]);

// --- VINCULAR USUÁRIO AO GRUPO ---
mock.onPost(/api\/crm\/user\/link\/proposalgroup\/\w+/).reply(200, { sucesso: true });

// --- EXPORTAÇÕES PARA INJEÇÃO EM RUNTIME ---
export function addMockProposal(proposal: any) {
  const newProposal = {
    ...proposal,
    idProposta: proposal.idProposta || `PRP-${String(100 + mockProposals.length).padStart(3, '0')}`,
    cdProposta: proposal.cdProposta || `PRP-${String(100 + mockProposals.length).padStart(3, '0')}`,
    dsStatus: proposal.dsStatus || "Aprovada",
    dtCadastro: proposal.dtCadastro || new Date().toISOString(),
    dtEmissao: proposal.dtEmissao || new Date().toISOString(),
    historico: proposal.historico || [
      { dtEvento: new Date().toISOString(), dsEvento: "Proposta criada via checkout digital", usuario: "Cliente" }
    ],
    respostas: proposal.respostas || [],
    documentos: proposal.documentos || []
  };
  mockProposals.push(newProposal);
  localStorage.setItem("mock_proposals_db", JSON.stringify(mockProposals));
  return newProposal;
}

export function getMockProposals() {
  return mockProposals;
}
