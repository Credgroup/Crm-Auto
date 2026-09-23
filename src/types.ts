export interface UsuarioItem {
  idusuario: number;
  tpperfil: number;
  chtpperfil: string;
  dstpperfil: string;
  tpsenha: number;
  chsenha: string;
  dssenha: string;
  login: string;
  nmusuario: string;
  emailusuario: string;
  cryptsenha: string;
  tpplataforma: number;
  chplataforma: string;
  dsplataforma: string;
  cdstatus: number;
  chstatus: string;
  dsstatus: string;
  chtermosistema: string;
  dstermosistema: string;
  dsusuario: string;
  tptema: number;
  chtptema: string;
  dstptema: string;
  tpidioma: number;
  chtpidioma: string;
  dstpidioma: string;
  ip: string;
}

export interface Enterprise {
  idEmpresa: string;
  idEmpresaOperacao?: string;
  idExterno: string;
  nmRazaoSocial: string;
  nmFantasia: string;
  nrCNPJ: string;
  nrInscricaoEstadual: string;
  tpCNPJ: number;
  cdStatus: number;
  dtCadastro: string;
  nrTelefone?: string;
  idOperacao?: number;
  nrDDD?: string;
  dsEmail?: string;
  dtAlteracao?: string | null;
  adicional?: any;
  nrCEP?: string;
  nrCEPString?: string;
  cdUF?: string;
  nmBairro?: string;
  nmCidade?: string;
  nmLogradouro?: string;
  nrLogradouro?: number;
  qtdSeguros?: number
}

export interface Person {
  idSegurado: string;
  idSeguradoI2k: string;
  idEmpresaOperacao: string;
  nome: string;
  cpf: number;
  sexo: string;
  estadoCivil: string;
  dataNascimento: string;
  idExterno: string;
  idOperacao: number;
  idPessoaOperacao: string;
  idPessoa: string;
  contato: PersonContact[];
  email: PersonEmail[];
  adicional: any;
  tpSexo?: number;
  tpEstadoCivil?: number;
  qtSeguros?: number;
}

export interface PersonEmail {
  dsEmail: string;
}

export interface PersonContact {
  ddd: string;
  telefone: string;
  tpTelefone: string;
}

export interface Dominio {
  cdacao: number;
  cdstatus: number;
  chstatus: string;
  dsacao: string;
  dschave: string;
  dsstatus: string;
  dtcadastro: string;
  idchave: string;
  iddominio: number;
  nmdominio: string;
  nrordem: string;
  dtalteracao?: string | null;
}

export interface CadProposalGroup {
  cdStatus: string | number;
  dsObservacao: string;
  idEmpresaOperacao: string | number;
  idSeguradoI2k: string | number;
  dtVigenciaFinal: string;
  propostas: Partial<ProposalItems>[];
}

export interface ProposalGroup {
  idProposta: string;
  idGrupoProposta: string;
  cdProposta: string;
  cdStatus: number;
  nmProposta: string;
  cdStatusProposta: number;
  chStatusProposta: number;
  statusProposta: string;
  idProduto: number;
  dtCadastro: string;
  dtAlteracao?: string | null;
  dtVigenciaInicio: string;
  dtVigenciaFinal: string;
  dtEnvio?: string | null;
  idEmpresaOperacao: string;
  idSeguradoI2k: number;
  idUsuario: number;
}

export interface Proposal {
  idProposta: string;
  idGrupoProposta: string;
  cdProposta: string;
  nmProposta: string;
  cdStatusProposta: number;
  chStatusProposta: number;
  statusProposta: string;
  idProduto: number;
  dtCadastro: string;
  dtAlteracao?: string | null;
  dtVigenciaInicio: string;
  dtVigenciaFinal: string;
  dtEnvio?: string | null;
  idEmpresaOperacao: string;
  idSeguradoi2k: number;
  idUsuario: number;
  dsObservacao?: string | null;
}

export interface Product {
  idProduto: number;
  cdProduto: number;
  nmProduto: string;
  dsProduto: string;
  dtCadastro: string;
  dtAlteracao?: string;
  vlParcela: string;
  vlLiquido: string;
  qtParcelas: string;
  vlIOF: string;
  vlCapital: string;
  tpProduto: number;
  cdStatus: number;
  vlCombo: string;
  tpCategoria: number;
  tpExibicao: number;
  tpMoeda: number;
  idParceiroOwner: number;
  dsLogo: string;
  vlPremio: string;
  tpPermiteCotacao: number;
  tpPermiteProposta: number;
  tpPermiteVenda: number;
  subCategoria?: string;
  checked?: boolean;
  tags?: string[];
  produtosAgrupado?: Product[];
}

export interface ProductTableEnterprise {
  idSeguro: number;
  idSegurado: number;
  idOperacao: number;
  idProduto: number;
  nmProduto: string;
  cdStatusSeguro: number;
  chStatusSeguro: number;
  dsStatusSeguro: string;
  dtEmissao: string;
  qtParcelas: number;
  vlParcela: number;
  vlPremio: number;
  tpAdesao: number;
  chAdesao: number;
  dsAdesao: string;
  tpSegurado: number;
  chSegurado: number;
  dsSegurado: string;
  idUsuario: number;
  idExterno: string;
  dtCadastro: string;
}

export interface ProductTable {
  nmProduto: string;
  idSeguro: number;
  idSegurado: number;
  idOperacao: number;
  idProduto: number;
  cdStatusSeguro: number;
  chStatusSeguro: number;
  dsStatusSeguro: string;
  dtEmissao: string;
  dtCancelamento: string;
  tpCancelamento: number;
  chCancelamento: number;
  dsCancelamento: string;
  qtParcelas: number;
  vlParcela: number;
  vlPremio: number;
  tpAdesao: number;
  chAdesao: number;
  dsAdesao: string;
  tpSegurado: number;
  chSegurado: number;
  dsSegurado: string;
  idUsuario: number;
  dtCadastro: string;
  dtAlteracao: string;
}

export interface ProposalItems {
  cdProposta: string;
  nmProposta: string;
  cdStatusProposta: number;
  idProduto: number;
  dtVigenciaFinal: string;
  idEmpresaOperacao: string;
  idSeguradoi2k: number;
}

export interface FieldType {
  type: string;
  sessao?: string;
  conteudo?: string;
  placeholder?: string;
  nome?: string;
  obrigatorio?: boolean;
  tamanho?: string;
  campoCompartilhado?: boolean;
  campoApi?: string;
  produtoOrigem?: number;
  dsTitulo?: string;
  dsSubtitulo?: string;
  options?: TpOptions[] | string;
  calculo?: string;
  mask?: string;
  visual?: boolean;
  desabilitar?: boolean;
  dominio?: boolean;
  dateConfig?: string;
  qtdRespostas?: number;
  colunas?: ColunaType[];
  uploadAccepts?: string;
  uploadMaxSize?: number;
  qtd?: number;
  camposCondicionais?: FieldType[];
  target?: string;
  apiConfig?: {
    type: "cep" | "custom";
    url?: string;
    method?: "GET" | "POST";
    targetFields?: {
      targetName: string;
      apiResponseKey: string;
    }[];
    triggerOnComplete?: boolean;
    debounceMs?: number;
  };
}

export interface TpOptions {
  value: string;
  label: string;
}

export interface SessaoType {
  title: string;
  descricao: string;
  checked: boolean;
  disabled: boolean;
  campos: Partial<FieldType>[];
  active: boolean;
  typeSession?: "pagamento" | "input" | "documento" | "resumo" | "cotacao" | "apresentacao";
}

export interface ColunaType {
  id?: string;
  type: string;
  conteudo?: string;
  placeholder?: string;
  nome?: string;
  obrigatorio?: boolean;
  tamanho?: string;
  campoApi?: string;
  options?: TpOptions[] | string;
  mask?: string;
  dominio?: boolean;
  nmColunaTemplate?: string;
  dateConfig?: string;
}

export interface ProposalDocument {
  idDocArquivo: number;
  tpDocumento: number;
  nmDoc: string;
  idUsuario: number;
  dtCadastro: string;
  tpDocumentoAprovacao: number;
  nmDocOriginal: string;
  idGrupoProposta: string;
}

export interface PaymentMethod {
  idOperacaoMeioPagamento: number;
  idOperacao: number;
  idMeioPagamento: number;
  jsonConf: string;
  cdStatus: number;
  chStatus: string;
  dsStatus: string;
  dtCadastro: string;
  tpPagamento: number;
  chPagamento: string;
  dsPagamento: string;
  dsMeioPagamento: string;
}

export interface HistoricoProdutoItem {
  idSeguroHistorico: number;
  idSeguro: number;
  dtHistorico: string;
  nmEvento: string;
  tpMovimento: number;
  stMovimento: string;
  idUsuario: number;
  dtCadastro: string;
}

export interface DocumentosProdutoItem {
  idDocArquivo: number;
  tpDocumento: number;
  chDocumento: number;
  dsDocumento: string;
  nmDoc: string;
  dsDoc: string;
  idUsuario: number;
  dtCadastro: string;
  idSeguro: number;
  nmDocOriginal: string;
  idSeguradoi2k?: number;
}

export interface TransacaoProdutoItem {
  idSeguroTransacao: number;
  idSeguro: number;
  tpProcesso: number;
  tpMovimento: number;
  chMovimento: number;
  dsMovimento: string;
  dtEnvio: string;
  jsonEnvio: string;
  jsonRetorno: string;
  tpProcessoStatus: number;
  chProcessoStatus: number;
  dsProcessoStatus: string;
  dtCadastro: string;
  dtAlteracao: string;
  idSeguroParcela: number;
}

export interface ParcelaProdutoItem {
  idSeguroParcela: number;
  idSeguro: number;
  nrParcela: number;
  vlParcela: number;
  vlCobrado: number;
  cdStatusParcela: number;
  chStatusParcela: number;
  dsStatusParcela: string;
  dtEnvio: string;
  dtCadastro: string;
  dtVencimento?: string;
  dtCorte?: string;
  dtPagamento?: string;
  tpSegundaVia: number;
}

export interface Notification {
  id: string;
  senderId?: any;
  recipients: Recipient[];
  type: number;
  message: string;
  title: string;
  status: number;
  metadata?: any;
  createdAt: string;
}

interface Recipient {
  userId: string;
  platform: string;
  operationId: string;
}

export interface ProductTable {
  idSeguro: number;
  nmProduto: string;
  dsProduto: string;
  cdStatusSeguro: number;
  // add more fields as needed
}

export interface DocumentosProdutoItem {
  idDocumento: number;
  nmDocumento: string;
  // etc.
}