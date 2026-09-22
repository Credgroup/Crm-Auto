import { mock } from './mockInstance';

// --- ESTADO DINÂMICO ---
let mockEnterprises: any[] = [
  {
    idEmpresa: "1",
    idEmpresaOperacao: "1",
    idExterno: "EXT001",
    nmRazaoSocial: "Translog Sudeste Transportes Ltda.",
    nmFantasia: "Translog Sudeste",
    nrCNPJ: "12.345.678/0001-90",
    nrInscricaoEstadual: "IS12345",
    tpCNPJ: 1,
    cdStatus: 1,
    dtCadastro: new Date().toISOString(),
    nrDDD: "11",
    nrTelefone: "999999999",
    dsEmail: "frota@translogsudeste.com.br",
    nrCEP: "01001000",
    cdUF: "SP",
    nmCidade: "São Paulo",
    nmBairro: "Centro",
    nmLogradouro: "Praça da Sé",
    nrLogradouro: 1,
    qtdSeguros: 5,
    adicional: JSON.stringify({})
  },
  {
    idEmpresa: "2",
    idEmpresaOperacao: "2",
    idExterno: "EXT002",
    nmRazaoSocial: "Rota Forte Logística S.A.",
    nmFantasia: "Rota Forte",
    nrCNPJ: "98.765.432/0001-10",
    nrInscricaoEstadual: "IS98765",
    tpCNPJ: 1,
    cdStatus: 1,
    dtCadastro: new Date().toISOString(),
    nrDDD: "21",
    nrTelefone: "988888888",
    dsEmail: "compras@rotaforte.com.br",
    nrCEP: "20000000",
    cdUF: "RJ",
    nmCidade: "Rio de Janeiro",
    nmBairro: "Centro",
    nmLogradouro: "Avenida Rio Branco",
    nrLogradouro: 100,
    qtdSeguros: 12,
    adicional: JSON.stringify({})
  }
];

// --- LISTAGEM (com hierarquia e paginação) ---
mock.onGet(/api\/crm\/company\/find\/operation\/\d+/).reply((config) => {
  const url = config.url || '';
  const pageNumberMatch = url.match(/pageNumber=(\d+)/);
  const pageSizeMatch = url.match(/pageSize=(\d+)/);
  const pageNumber = pageNumberMatch ? parseInt(pageNumberMatch[1]) : 1;
  const pageSize = pageSizeMatch ? parseInt(pageSizeMatch[1]) : 6;

  return [200, {
    items: mockEnterprises.slice(0, pageSize),
    totalCount: mockEnterprises.length,
    pageNumber,
    pageSize
  }];
});

// --- DETALHE ÚNICO ---
mock.onGet(/api\/crm\/company\/find\/\d+$/).reply((config) => {
  const idMatch = config.url?.match(/find\/(\d+)$/);
  const id = idMatch ? idMatch[1] : '1';
  const empresa = mockEnterprises.find(e => e.idEmpresa === id || e.idEmpresaOperacao === id) || mockEnterprises[0];
  return [200, empresa];
});

// --- LAYOUTS DE EMPRESA ---
mock.onGet(/api\/crm\/company\/find\/layouts\/\d+/).reply(200, []);

// --- OPERAÇÃO LOCKED ---
mock.onGet(/api\/crm\/company\/find\/operation\/locked\/\d+/).reply(200, { locked: false });

// --- HISTÓRICO DA EMPRESA ---
mock.onGet(/api\/crm\/company\/find\/history\/\w+/).reply(200, {
  items: [
    { idEmpresaOperacaoHistorico: 1, idEmpresaOperacao: "1", dtHistorico: new Date().toISOString(), nmEvento: "Empresa cadastrada no sistema", tpMovimento: 1, chMovimento: 1, dsMovimento: "Cadastro", stMovimento: "OK", idUsuario: 1, dsObs: "Cadastro inicial da empresa no CRM." },
    { idEmpresaOperacaoHistorico: 2, idEmpresaOperacao: "1", dtHistorico: new Date(Date.now() - 86400000).toISOString(), nmEvento: "Atualização cadastral", tpMovimento: 2, chMovimento: 2, dsMovimento: "Edição", stMovimento: "OK", idUsuario: 1, dsObs: "Atualização de dados de contato e endereço." }
  ],
  totalCount: 2,
  pageNumber: 1,
  pageSize: 10
});

// --- DADOS BANCÁRIOS ---
mock.onGet(/api\/crm\/company\/find\/bankdetail\/\w+/).reply(200, {
  items: [
    {
      idEmpresaDadosBancarios: 1,
      idEmpresaOperacao: "1",
      nmBanco: "Itaú Unibanco",
      nrAgencia: "1234",
      nrConta: "56789-0",
      tpContaBancaria: 1,
      cdStatus: 1,
      dtCadastro: new Date().toISOString(),
      tpPrincipal: 372
    }
  ],
  totalCount: 1,
  pageNumber: 1,
  pageSize: 10
});

// --- CADASTRO ---
mock.onPost(/api\/crm\/company\/register\/operation/).reply((config) => {
  try {
    const body = JSON.parse(config.data || '{}');
    const newEnterprise = {
      ...body,
      idEmpresa: String(10 + mockEnterprises.length),
      idEmpresaOperacao: String(10 + mockEnterprises.length),
      dtCadastro: new Date().toISOString(),
      qtdSeguros: 0
    };
    mockEnterprises.push(newEnterprise);
    return [201, { sucesso: true, id: newEnterprise.idEmpresa, data: newEnterprise }];
  } catch {
    return [400, { erro: "Bad Request" }];
  }
});

// --- CADASTRO DE REPRESENTANTE ---
mock.onPost(/api\/crm\/company\/register\/representative\/operation/).reply(200, { sucesso: true });

// --- CADASTRO DE SEGURADOS (Policyholders) ---
mock.onPost(/api\/crm\/company\/register\/policyholders\/operation/).reply(200, { sucesso: true });

// --- EDIÇÃO ---
mock.onPut(/api\/crm\/company\/update\/operation/).reply((config) => {
  try {
    const body = JSON.parse(config.data || '{}');
    const idx = mockEnterprises.findIndex(e => e.idEmpresaOperacao === body.idEmpresaOperacao);
    if (idx !== -1) {
      mockEnterprises[idx] = { ...mockEnterprises[idx], ...body };
    }
    return [200, { sucesso: true }];
  } catch {
    return [400, { erro: "Bad Request" }];
  }
});
