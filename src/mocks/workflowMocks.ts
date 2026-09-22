import { mock } from "./mockInstance";

// Endpoints auxiliares da jornada comercial que não dependem de backend na demo.
mock.onPost(/api\/crm\/proposal\/register\/group/).reply((config) => {
  const body = JSON.parse(config.data || "{}");
  const idGrupoProposta = `MBFI-${Date.now().toString().slice(-6)}`;
  return [201, {
    sucesso: true,
    idGrupoProposta,
    dsStatus: "Proposta criada",
    dtCadastro: new Date().toISOString(),
    ...body,
  }];
});

mock.onPost(/api\/crm\/proposal\/generate\/shortlink/).reply((config) => {
  const body = JSON.parse(config.data || "{}");
  const id = body.idGrupoProposta || "DEMO";
  return [200, {
    sucesso: true,
    urlshort: `${window.location.origin}/#/checkout/${id}`,
    mensagem: "Link da proposta gerado com sucesso",
  }];
});

mock.onGet(/api\/crm\/payment\/options\/product\/\d+/).reply(200, [
  { idOperacaoMeioPagamento: 1, idOperacao: 1, idMeioPagamento: 1, jsonConf: "{}", cdStatus: 1, chStatus: "1", dsStatus: "Ativo", dtCadastro: new Date().toISOString(), tpPagamento: 1, chPagamento: "pix", dsPagamento: "Pix", dsMeioPagamento: "Pix instantâneo" },
  { idOperacaoMeioPagamento: 2, idOperacao: 1, idMeioPagamento: 2, jsonConf: "{}", cdStatus: 1, chStatus: "1", dsStatus: "Ativo", dtCadastro: new Date().toISOString(), tpPagamento: 2, chPagamento: "boleto", dsPagamento: "Boleto", dsMeioPagamento: "Boleto bancário" },
  { idOperacaoMeioPagamento: 3, idOperacao: 1, idMeioPagamento: 3, jsonConf: "{}", cdStatus: 1, chStatus: "1", dsStatus: "Ativo", dtCadastro: new Date().toISOString(), tpPagamento: 3, chPagamento: "cartao", dsPagamento: "Cartão", dsMeioPagamento: "Cartão de crédito" },
]);

mock.onPost(/api\/crm\/payment\/generate/).reply(200, {
  sucesso: true,
  mensagem: "Pagamento gerado",
  dadosPagamento: {
    codePagamentoExterno: "MBFI-PAY-001",
    nrProposta: "MBFI-DEMO",
    dtExpericao: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    nrParcela: 1,
    valorParcela: 1250,
    arquivoExterno: "",
    pixCopiaCola: "00020126580014br.gov.bcb.pix0136demo-mercedes-fi-ekio-00152040000530398654071250.005802BR5925MERCEDES FI DEMO EKIO6009SAO PAULO62070503***6304ABCD",
  },
});

mock.onGet(/api\/crm\/user\/operation\/\w+/).reply(200, [
  { idUsuario: 1, nmUsuario: "Mariana Costa", nmCargo: "Especialista F&I" },
  { idUsuario: 2, nmUsuario: "Rafael Martins", nmCargo: "Gerente Comercial" },
]);

mock.onPost(/api\/crm\/multicanal\/enviar\/disparo/).reply(200, { sucesso: true, mensagem: "Proposta enviada com sucesso" });
mock.onGet(/api\/crm\/multicanal\/find\/template\/\w+/).reply(200, {
  items: [
    { idTemplate: 1, nmTemplate: "Proposta F&I", dsTemplate: "Sua proposta Mercedes-Benz Trucks F&I está pronta para análise." },
  ],
  totalCount: 1,
});
