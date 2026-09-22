import { mock } from './mockInstance';

// --- ESTADO DINÂMICO ---
const initialLeads: any[] = [
  {
    idSegurado: "100",
    idSeguradoI2k: "I2K-100",
    idEmpresaOperacao: "1",
    nome: "João da Silva",
    cpf: 12345678901,
    sexo: "M",
    estadoCivil: "Solteiro",
    dataNascimento: "1990-01-01T00:00:00",
    idExterno: "EXT100",
    idOperacao: 1,
    idPessoaOperacao: "1",
    idPessoa: "100",
    contato: [
      { ddd: "11", telefone: "987654321", tpTelefone: "Celular" }
    ],
    email: [
      { dsEmail: "joao.silva@mock.com" }
    ],
    adicional: JSON.stringify({ cep: "01001000", bairro: "Centro", cidade: "São Paulo", estado: "SP" }),
    qtSeguros: 2
  },
  {
    idSegurado: "101",
    idSeguradoI2k: "I2K-101",
    idEmpresaOperacao: "1",
    nome: "Maria Oliveira",
    cpf: 10987654321,
    sexo: "F",
    estadoCivil: "Casado",
    dataNascimento: "1985-05-15T00:00:00",
    idExterno: "EXT101",
    idOperacao: 1,
    idPessoaOperacao: "2",
    idPessoa: "101",
    contato: [
      { ddd: "21", telefone: "999998888", tpTelefone: "Celular" },
      { ddd: "21", telefone: "33334444", tpTelefone: "Fixo" }
    ],
    email: [
      { dsEmail: "maria.oliveira@mock.com" }
    ],
    adicional: JSON.stringify({ cep: "20040020", bairro: "Botafogo", cidade: "Rio de Janeiro", estado: "RJ" }),
    qtSeguros: 0
  },
  {
    idSegurado: "102",
    idSeguradoI2k: "I2K-102",
    idEmpresaOperacao: "2",
    nome: "Carlos Pereira",
    cpf: 98765432100,
    sexo: "M",
    estadoCivil: "Casado",
    dataNascimento: "1978-11-20T00:00:00",
    idExterno: "EXT102",
    idOperacao: 1,
    idPessoaOperacao: "3",
    idPessoa: "102",
    contato: [
      { ddd: "31", telefone: "912345678", tpTelefone: "Celular" }
    ],
    email: [
      { dsEmail: "carlos.pereira@mock.com" }
    ],
    adicional: JSON.stringify({ cep: "30130000", bairro: "Savassi", cidade: "Belo Horizonte", estado: "MG" }),
    qtSeguros: 3
  }
];

let mockLeads: any[] = JSON.parse(localStorage.getItem("mock_leads_db") || "null") || initialLeads;

// --- LISTAGEM (paginação) ---
mock.onGet(/api\/crm\/lead\/find\/operation\/\d+/).reply((config) => {
  const url = config.url || '';
  const pageNumberMatch = url.match(/pageNumber=(\d+)/);
  const pageSizeMatch = url.match(/pageSize=(\d+)/);
  const pageNumber = pageNumberMatch ? parseInt(pageNumberMatch[1]) : 1;
  const pageSize = pageSizeMatch ? parseInt(pageSizeMatch[1]) : 6;
  
  return [200, {
    items: mockLeads.slice(0, pageSize),
    totalCount: mockLeads.length,
    pageNumber,
    pageSize
  }];
});

// --- DETALHE ÚNICO ---
mock.onGet(/api\/crm\/lead\/find\/\d+$/).reply((config) => {
  const idMatch = config.url?.match(/find\/(\d+)$/);
  const id = idMatch ? idMatch[1] : '100';
  const lead = mockLeads.find(l => l.idSegurado === id) || mockLeads[0];
  return [200, lead];
});

// --- CONTATOS DO LEAD ---
mock.onPost(/api\/crm\/lead\/find\/contact/).reply((config) => {
  try {
    const body = JSON.parse(config.data || '{}');
    const lead = mockLeads.find(l => l.idSegurado === body.idSegurado || l.idSeguradoI2k === body.idSeguradoI2k) || mockLeads[0];
    return [200, {
      contatos: lead.contato || [],
      emails: lead.email || []
    }];
  } catch {
    return [200, { contatos: [], emails: [] }];
  }
});

mock.onGet(/api\/crm\/lead\/find\/contact/).reply(200, {
  contatos: mockLeads[0].contato,
  emails: mockLeads[0].email
});

// --- REPRESENTANTES ---
mock.onPost(/api\/crm\/lead\/find\/representative/).reply(200, {
  items: [
    { idRepresentante: 1, nome: "João da Silva", cpf: "123.456.789-01", cargo: "Gerente", telefone: "11987654321", email: "joao@mock.com" }
  ],
  totalItems: 1
});

mock.onGet(/api\/crm\/lead\/find\/representative/).reply(200, {
  items: [
    { idRepresentante: 1, nome: "João da Silva", cpf: "123.456.789-01", cargo: "Gerente", telefone: "11987654321", email: "joao@mock.com" }
  ],
  totalItems: 1
});

// --- LEADS DISPONÍVEIS PARA VÍNCULO ---
mock.onPost(/api\/crm\/lead\/find\/available\/operation/).reply(200, {
  items: mockLeads,
  totalItems: mockLeads.length
});

mock.onGet(/api\/crm\/lead\/find\/available\/operation/).reply(200, {
  items: mockLeads,
  totalItems: mockLeads.length
});

// --- CADASTRO ---
mock.onPost(/api\/crm\/lead\/register/).reply((config) => {
  try {
    const body = JSON.parse(config.data || '{}');
    const newLead = {
      ...body,
      idSegurado: String(200 + mockLeads.length),
      idSeguradoI2k: `I2K-${200 + mockLeads.length}`,
      idPessoaOperacao: String(mockLeads.length + 1),
      idPessoa: String(200 + mockLeads.length),
      qtSeguros: 0
    };
    mockLeads.push(newLead);
    localStorage.setItem("mock_leads_db", JSON.stringify(mockLeads));
    return [201, { sucesso: true, id: newLead.idSegurado, data: newLead }];
  } catch {
    return [400, { erro: "Bad Request" }];
  }
});

// --- EDIÇÃO ---
mock.onPut(/api\/crm\/lead\/update/).reply((config) => {
  try {
    const body = JSON.parse(config.data || '{}');
    const idx = mockLeads.findIndex(l => l.idSeguradoI2k === body.idSeguradoI2k);
    if (idx !== -1) {
      mockLeads[idx] = { ...mockLeads[idx], ...body };
      return [200, { sucesso: true }];
    }
    return [200, { sucesso: true }];
  } catch {
    return [400, { erro: "Bad Request" }];
  }
});

// --- VINCULAR PESSOA A EMPRESA ---
mock.onPut(/api\/crm\/lead\/bind\/companyOperation/).reply(200, { sucesso: true });

// --- SINISTROS ---
mock.onGet(/api\/crm\/sinistro/).reply(200, [
  { idSinistro: "1", idSegurado: "100", protocolo: "SIN-2026-001", status: "Em Análise", dataAbertura: new Date().toISOString(), tipoSinistro: "Roubo/Furto", valorEstimado: 5000, descricao: "Celular furtado no centro." }
]);
mock.onPost(/api\/crm\/sinistro/).reply(201, { sucesso: true, protocolo: "SIN-NOVO" });

// --- BUSCA POR CPF (Autopreenchimento) ---
mock.onGet(/api\/crm\/client\/find\/\d+/).reply((config) => {
  const match = config.url?.match(/find\/(\d+)$/);
  const cpf = match ? match[1] : "";
  
  // Remove pontuação para busca
  const cleanCpf = cpf.replace(/\D/g, "");
  
  // Procura nos leads existentes (limpando CPF deles tbm)
  const leadEncontrado = mockLeads.find(l => {
    const doc = l.documento ? l.documento.replace(/\D/g, "") : "";
    return doc === cleanCpf;
  });

  if (leadEncontrado) {
    return [200, {
      sucesso: true,
      data: {
        cpf: leadEncontrado.documento,
        nome: leadEncontrado.nmPessoa,
        email: leadEncontrado.email,
        telefone: leadEncontrado.telefone
      }
    }];
  }

  // Se não encontrou, retorna um dado genérico para demonstrar
  return [200, {
    sucesso: true,
    data: {
      cpf: cpf,
      nome: "Cliente de Teste CPF " + cpf.substring(0, 3) + "***",
      email: "teste" + cpf.substring(0,3) + "@teste.com",
      telefone: "1199999" + cpf.substring(0,4)
    }
  }];
});

// --- EXPORTAÇÕES PARA INJEÇÃO EM RUNTIME ---
export function addMockLead(lead: any) {
  const newLead = {
    ...lead,
    idSegurado: lead.idSegurado || String(200 + mockLeads.length),
    idSeguradoI2k: lead.idSeguradoI2k || `I2K-${200 + mockLeads.length}`,
    idPessoaOperacao: lead.idPessoaOperacao || String(mockLeads.length + 1),
    idPessoa: lead.idPessoa || String(200 + mockLeads.length),
  };
  mockLeads.push(newLead);
  localStorage.setItem("mock_leads_db", JSON.stringify(mockLeads));
  return newLead;
}

export function getMockLeads() {
  return mockLeads;
}
