import { mock } from './mockInstance';

// --- ESTADO DINÂMICO ---
const initialInsurances: any[] = [
  {
    idSeguro: 1001,
    idSegurado: "100",
    idSeguradoI2k: "I2K-100",
    idProposta: "PRP-001",
    idProduto: 3,
    nmProduto: "Seguro Auto Completo",
    dsProduto: "Cobertura compreensiva contra colisão, roubo, furto, incêndio e danos a terceiros.",
    cdStatusSeguro: 449,
    chStatusSeguro: 449,
    dsStatusSeguro: "Ativo",
    dtInicioVigencia: new Date().toISOString(),
    dtFimVigencia: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
    dtCadastro: new Date().toISOString(),
    vlPremio: 3478.80,
    vlCapital: 120000.00,
    vlParcela: 289.90,
    qtParcelas: 12,
    nmSegurado: "João da Silva",
    cpfSegurado: "123.456.789-01",
    nmEmpresa: "Alpha Tech",
    idEmpresaOperacao: "1",
    dtEmissao: new Date(Date.now() - 86400000 * 5).toISOString(),
    dsAdesao: "Adesão Online"
  },
  {
    idSeguro: 1002,
    idSegurado: "101",
    idSeguradoI2k: "I2K-101",
    idProposta: "PRP-002",
    idProduto: 2,
    nmProduto: "Rastreador Veicular + Seguro Antirroubo",
    dsProduto: "Rastreamento 24h com bloqueio remoto e seguro contra roubo e furto.",
    cdStatusSeguro: 5,
    chStatusSeguro: 5,
    dsStatusSeguro: "Pré-Venda",
    dtInicioVigencia: new Date().toISOString(),
    dtFimVigencia: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
    dtCadastro: new Date(Date.now() - 86400000 * 3).toISOString(),
    vlPremio: 718.80,
    vlCapital: 80000.00,
    vlParcela: 59.90,
    qtParcelas: 12,
    nmSegurado: "Maria Oliveira",
    cpfSegurado: "109.876.543-21",
    nmEmpresa: "Beta Shop",
    idEmpresaOperacao: "2",
    dtEmissao: new Date(Date.now() - 86400000 * 3).toISOString(),
    dsAdesao: "Adesão Presencial"
  }
];

let mockInsurances: any[] = JSON.parse(localStorage.getItem("mock_insurances_db") || "null") || initialInsurances;

// --- LISTAGEM DE SEGUROS POR SEGURADO ---
mock.onGet(/api\/crm\/insurance\/find\/list\/segurado\/\w+/).reply((config) => {
  const match = config.url?.match(/segurado\/([\w-]+)/);
  const id = match ? match[1] : null;
  const filtered = id ? mockInsurances.filter(i => i.idSegurado === id || i.idSeguradoI2k === id) : mockInsurances;
  return [200, { items: filtered, totalCount: filtered.length, pageNumber: 1, pageSize: 10 }];
});

// --- LISTAGEM DE SEGUROS POR EMPRESA ---
mock.onGet(/api\/crm\/insurance\/find\/list\/company\/\w+/).reply((config) => {
  const match = config.url?.match(/company\/([\w-]+)/);
  const id = match ? match[1] : null;
  const filtered = id ? mockInsurances.filter(i => i.idEmpresaOperacao === id) : mockInsurances;
  return [200, { items: filtered, totalCount: filtered.length, pageNumber: 1, pageSize: 10 }];
});

// --- HISTÓRICO DO SEGURO (HistoricoProdutoItem) ---
mock.onGet(/api\/crm\/insurance\/find\/history\/\w+/).reply(200, {
  items: [
    { idSeguroHistorico: 1, idSeguro: 1001, dtHistorico: new Date().toISOString(), nmEvento: "Apólice emitida com sucesso", tpMovimento: 1, stMovimento: "Seguro ativado após confirmação de pagamento da primeira parcela.", idUsuario: 1, dtCadastro: new Date().toISOString() },
    { idSeguroHistorico: 2, idSeguro: 1001, dtHistorico: new Date(Date.now() - 86400000).toISOString(), nmEvento: "Cotação aprovada pelo analista", tpMovimento: 2, stMovimento: "Cotação revisada e aprovada. Documentação completa.", idUsuario: 1, dtCadastro: new Date(Date.now() - 86400000).toISOString() },
    { idSeguroHistorico: 3, idSeguro: 1001, dtHistorico: new Date(Date.now() - 86400000 * 2).toISOString(), nmEvento: "Proposta enviada ao segurador", tpMovimento: 3, stMovimento: "Proposta transmitida com sucesso para análise.", idUsuario: 1, dtCadastro: new Date(Date.now() - 86400000 * 2).toISOString() }
  ],
  totalCount: 3,
  pageNumber: 1,
  pageSize: 10
});

// --- PARCELAS (ParcelaProdutoItem) ---
mock.onGet(/api\/crm\/insurance\/find\/installment\/\w+/).reply(200, {
  items: [
    { idSeguroParcela: 1, idSeguro: 1001, nrParcela: 1, vlParcela: 289.90, vlCobrado: 289.90, cdStatusParcela: 478, chStatusParcela: 478, dsStatusParcela: "Pago", dtEnvio: new Date(Date.now() - 86400000 * 60).toISOString(), dtCadastro: new Date(Date.now() - 86400000 * 60).toISOString(), dtVencimento: new Date(Date.now() - 86400000 * 30).toISOString(), dtPagamento: new Date(Date.now() - 86400000 * 28).toISOString(), tpSegundaVia: 0 },
    { idSeguroParcela: 2, idSeguro: 1001, nrParcela: 2, vlParcela: 289.90, vlCobrado: 289.90, cdStatusParcela: 478, chStatusParcela: 478, dsStatusParcela: "Pago", dtEnvio: new Date(Date.now() - 86400000 * 30).toISOString(), dtCadastro: new Date(Date.now() - 86400000 * 30).toISOString(), dtVencimento: new Date().toISOString(), dtPagamento: new Date().toISOString(), tpSegundaVia: 0 },
    { idSeguroParcela: 3, idSeguro: 1001, nrParcela: 3, vlParcela: 289.90, vlCobrado: 289.90, cdStatusParcela: 1247, chStatusParcela: 1247, dsStatusParcela: "Em Aberto", dtEnvio: new Date().toISOString(), dtCadastro: new Date().toISOString(), dtVencimento: new Date(Date.now() + 86400000 * 30).toISOString(), dtPagamento: null, tpSegundaVia: 20968 },
    { idSeguroParcela: 4, idSeguro: 1001, nrParcela: 4, vlParcela: 289.90, vlCobrado: 289.90, cdStatusParcela: 1247, chStatusParcela: 1247, dsStatusParcela: "Em Aberto", dtEnvio: null, dtCadastro: new Date().toISOString(), dtVencimento: new Date(Date.now() + 86400000 * 60).toISOString(), dtPagamento: null, tpSegundaVia: 20968 },
    { idSeguroParcela: 5, idSeguro: 1001, nrParcela: 5, vlParcela: 289.90, vlCobrado: 289.90, cdStatusParcela: 1247, chStatusParcela: 1247, dsStatusParcela: "Pendente", dtEnvio: null, dtCadastro: new Date().toISOString(), dtVencimento: new Date(Date.now() + 86400000 * 90).toISOString(), dtPagamento: null, tpSegundaVia: 20968 },
    { idSeguroParcela: 6, idSeguro: 1001, nrParcela: 6, vlParcela: 289.90, vlCobrado: 289.90, cdStatusParcela: 1247, chStatusParcela: 1247, dsStatusParcela: "Pendente", dtEnvio: null, dtCadastro: new Date().toISOString(), dtVencimento: new Date(Date.now() + 86400000 * 120).toISOString(), dtPagamento: null, tpSegundaVia: 20968 },
  ],
  totalCount: 6,
  pageNumber: 1,
  pageSize: 10
});

// --- TRANSAÇÕES (TransacaoProdutoItem) ---
mock.onGet(/api\/crm\/insurance\/find\/transaction\/\w+/).reply(200, {
  items: [
    { idSeguroTransacao: 101, idSeguro: 1001, tpProcesso: 1, tpMovimento: 1, chMovimento: 1, dsMovimento: "Cobrança via PIX - Parcela 1", dtEnvio: new Date(Date.now() - 86400000 * 30).toISOString(), jsonEnvio: JSON.stringify({ parcela: 1, valor: 289.90, metodo: "PIX" }), jsonRetorno: JSON.stringify({ status: "APROVADO", nsu: "123456", authCode: "A1B2C3" }), tpProcessoStatus: 1, chProcessoStatus: 1, dsProcessoStatus: "Aprovada", dtCadastro: new Date(Date.now() - 86400000 * 30).toISOString(), dtAlteracao: new Date(Date.now() - 86400000 * 30).toISOString(), idSeguroParcela: 1 },
    { idSeguroTransacao: 102, idSeguro: 1001, tpProcesso: 1, tpMovimento: 1, chMovimento: 1, dsMovimento: "Cobrança via Boleto - Parcela 2", dtEnvio: new Date().toISOString(), jsonEnvio: JSON.stringify({ parcela: 2, valor: 289.90, metodo: "Boleto" }), jsonRetorno: JSON.stringify({ status: "APROVADO", nsu: "654321", nossoNumero: "0001234567890" }), tpProcessoStatus: 1, chProcessoStatus: 1, dsProcessoStatus: "Aprovada", dtCadastro: new Date().toISOString(), dtAlteracao: new Date().toISOString(), idSeguroParcela: 2 },
    { idSeguroTransacao: 103, idSeguro: 1001, tpProcesso: 2, tpMovimento: 2, chMovimento: 2, dsMovimento: "Emissão de Apólice", dtEnvio: new Date(Date.now() - 86400000 * 2).toISOString(), jsonEnvio: JSON.stringify({ tipo: "emissao", idProposta: "PRP-001" }), jsonRetorno: JSON.stringify({ status: "OK", numeroApolice: "APL-2026-001" }), tpProcessoStatus: 1, chProcessoStatus: 1, dsProcessoStatus: "Concluída", dtCadastro: new Date(Date.now() - 86400000 * 2).toISOString(), dtAlteracao: new Date(Date.now() - 86400000 * 2).toISOString(), idSeguroParcela: 0 },
  ],
  totalCount: 3,
  pageNumber: 1,
  pageSize: 10
});

// --- DOCUMENTOS DO SEGURO (DocumentosProdutoItem) ---
mock.onGet(/api\/crm\/insurance\/find\/document\/\w+/).reply(200, {
  items: [
    { idDocArquivo: 1, tpDocumento: 1, chDocumento: 1, dsDocumento: "Apólice", nmDoc: "Apolice_SEG-1001.pdf", dsDoc: "https://storage.mock.com/docs/apolice_1001.pdf", idUsuario: 1, dtCadastro: new Date().toISOString(), idSeguro: 1001, nmDocOriginal: "Apolice_SEG-1001.pdf" },
    { idDocArquivo: 2, tpDocumento: 2, chDocumento: 6, dsDocumento: "Certificado", nmDoc: "Certificado_SEG-1001.pdf", dsDoc: "https://storage.mock.com/docs/certificado_1001.pdf", idUsuario: 1, dtCadastro: new Date().toISOString(), idSeguro: 1001, nmDocOriginal: "Certificado_SEG-1001.pdf" },
    { idDocArquivo: 3, tpDocumento: 3, chDocumento: 3, dsDocumento: "Nota Fiscal Veículo", nmDoc: "NF_VEICULO-1001.pdf", dsDoc: "https://storage.mock.com/docs/nf_1001.pdf", idUsuario: 1, dtCadastro: new Date(Date.now() - 86400000).toISOString(), idSeguro: 1001, nmDocOriginal: "NF_Compra_Veiculo.pdf" }
  ],
  totalCount: 3,
  pageNumber: 1,
  pageSize: 10
});

// --- DADOS ADICIONAIS (retorno é objeto flat, convertido via Object.entries) ---
mock.onGet(/api\/crm\/insurance\/find\/additional\/data\/\w+/).reply(200, {
  "Placa": "BRA2E19",
  "Chassi": "9BW ZZZ 377 F T 000000",
  "RENAVAM": "12345678901",
  "Marca": "CAOA Chery",
  "Modelo": "Tiggo 5x Pro Hybrid",
  "Cor": "Branco Perolizado",
  "Ano Fabricação/Modelo": "2023/2024",
  "Valor FIPE": "R$ 145.000,00",
  "Nota Fiscal": "NF-2025-00123"
});

// --- CANCELAMENTO ---
mock.onPost(/api\/crm\/insurance\/cancel/).reply((config) => {
  try {
    const body = JSON.parse(config.data || '{}');
    const idx = mockInsurances.findIndex(i => i.idSeguro === body.idSeguro);
    if (idx !== -1) {
      mockInsurances[idx].cdStatusSeguro = 3;
      mockInsurances[idx].chStatusSeguro = 3;
      mockInsurances[idx].dsStatusSeguro = "Cancelado";
    }
    return [200, { sucesso: true, mensagem: "Seguro cancelado com sucesso" }];
  } catch {
    return [400, { erro: "Bad Request" }];
  }
});

// --- GERAÇÃO DE TICKET (Cotação / 2ª via bilhete) ---
mock.onPost(/api\/crm\/insurance\/generate\/ticket/).reply(200, {
  sucesso: true,
  ticket: `TKT-${Math.floor(Math.random() * 10000)}`
});

// --- SALVAR TICKET ---
mock.onPost(/api\/crm\/insurance\/save\/ticket/).reply(200, { sucesso: true });

// --- EFETIVAÇÃO (Accession) ---
mock.onPost(/api\/crm\/insurance\/accession/).reply((config) => {
  try {
    const body = JSON.parse(config.data || '{}');
    const newInsurance = {
      idSeguro: 2000 + mockInsurances.length,
      idSegurado: body.idSegurado || "100",
      idSeguradoI2k: body.idSeguradoI2k || "I2K-100",
      idProposta: body.idProposta || `PRP-${Math.floor(Math.random() * 1000)}`,
      idProduto: body.idProduto || 3,
      nmProduto: "Seguro Auto Completo",
      dsProduto: "Cobertura compreensiva contra colisão, roubo, furto, incêndio e danos a terceiros.",
      cdStatusSeguro: 449,
      chStatusSeguro: 449,
      dsStatusSeguro: "Ativo",
      dtInicioVigencia: new Date().toISOString(),
      dtFimVigencia: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
      dtCadastro: new Date().toISOString(),
      vlPremio: 3478.80,
      vlCapital: 120000.00,
      vlParcela: 289.90,
      qtParcelas: 12,
      nmSegurado: "João da Silva",
      cpfSegurado: "123.456.789-01"
    };
    mockInsurances.push(newInsurance);
    return [200, { sucesso: true, idSeguro: newInsurance.idSeguro, data: newInsurance }];
  } catch {
    return [400, { erro: "Bad Request" }];
  }
});

// --- SHORTLINK (segunda via de boleto/pagamento) ---
mock.onPost(/api\/crm\/payment\/public\/generate\/shortlink/).reply(200, {
  sucesso: true,
  codigo: 0,
  urlshort: `https://pag.mock.com/${Math.random().toString(36).substring(2, 8)}`,
  mensagem: "Shortlink gerado com sucesso"
});

// --- BAIXAR PARCELA (manual) ---
mock.onPost(/api\/crm\/insurance\/installment\/pay/).reply(200, { sucesso: true, mensagem: "Parcela baixada com sucesso" });

// --- SEGUNDA VIA DE PARCELA ---
mock.onPost(/api\/crm\/insurance\/installment\/resend/).reply(200, { sucesso: true, mensagem: "Cobrança reenviada com sucesso" });

// --- EXPORTAÇÕES PARA INJEÇÃO EM RUNTIME ---
export function addMockInsurance(insurance: any) {
  const newInsurance = {
    ...insurance,
    idSeguro: insurance.idSeguro || 2000 + mockInsurances.length,
    cdStatusSeguro: insurance.cdStatusSeguro || 449,
    chStatusSeguro: insurance.chStatusSeguro || 449,
    dsStatusSeguro: insurance.dsStatusSeguro || "Ativo",
    dtInicioVigencia: insurance.dtInicioVigencia || new Date().toISOString(),
    dtFimVigencia: insurance.dtFimVigencia || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
    dtCadastro: insurance.dtCadastro || new Date().toISOString(),
    dtEmissao: insurance.dtEmissao || new Date().toISOString(),
    dsAdesao: insurance.dsAdesao || "Adesão Digital",
  };
  mockInsurances.push(newInsurance);
  localStorage.setItem("mock_insurances_db", JSON.stringify(mockInsurances));
  return newInsurance;
}

export function getMockInsurances() {
  return mockInsurances;
}
