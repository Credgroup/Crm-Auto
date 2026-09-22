import { mock } from './mockInstance';

const mockCommissions = [
  {
    idComissao: 1,
    dtReferencia: new Date().toISOString(),
    vlTotalVendas: 150000,
    vlComissao: 15000,
    dsStatus: "Processado",
    qtVendas: 50
  },
  {
    idComissao: 2,
    dtReferencia: new Date().toISOString(),
    vlTotalVendas: 80000,
    vlComissao: 8000,
    dsStatus: "Pendente",
    qtVendas: 32
  }
];

// Listagem de Comissões Processadas
mock.onGet(/api\/crm\/commission\/find\/process\/operation\/\d+/).reply(() => {
  return [200, { items: mockCommissions.filter(c => c.dsStatus === 'Processado'), totalItems: 1 }];
});

// Listagem de Comissões Pendentes / Operação
mock.onGet(/api\/crm\/commission\/find\/operation\/\d+/).reply(() => {
  return [200, { items: mockCommissions, totalItems: mockCommissions.length }];
});

// Processar Comissão
mock.onPost(/api\/crm\/commission\/process/).reply(() => {
  return [200, { sucesso: true, mensagem: "Comissão processada com sucesso" }];
});
