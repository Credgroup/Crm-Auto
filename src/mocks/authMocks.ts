import { mock } from './mockInstance';
import { UsuarioItem } from '@/types';
import { mockDashboardOverview } from './dashboardMocks';

// Função para gerar um token JWT válido para testes
const createFakeToken = () => {
  const payload = {
    IdAccess: "1",
    Login: "lucas.gomes@ekio.com.br",
    name: "Lucas Gomes",
    email: "lucas.gomes@ekio.com.br",
    profile: "Administrador",
    partner: "1",
    tokenversion: "1.0",
    tppassword: "0",
    tpplatform: "1",
    cdstatus: "1",
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // expira em 1 dia
    iat: Math.floor(Date.now() / 1000)
  };
  
  // Usando um base64 manual simples para simular o JWT já que jwt-encode pode não estar instalado
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const data = btoa(JSON.stringify(payload));
  const signature = "fake-signature-for-mocking";
  
  return `${header}.${data}.${signature}`;
};

// 1. Mock do Login (/api/security/token)
mock.onPost(/api\/security\/token/).reply(200, {
  authenticated: true,
  accessToken: createFakeToken(),
  mfa: true, // simular que passou pelo MFA se necessário ou false para pular
  qrCode: "",
  key: "",
  expiration: new Date(Date.now() + 86400000).toISOString()
});

// 2. Mock dos Dados do Usuário (/api/service com Código 1)
mock.onPost(/api\/service/).reply((config) => {
  // Extrai o Código Header de forma segura
  const codigoHeader = config.headers?.['Codigo'] || config.headers?.['codigo'] || (typeof config.headers?.get === 'function' && config.headers.get('Codigo'));
  
  let isUserRequest = codigoHeader === '1';
  try {
    const data = JSON.parse(config.data || '{}');
    if (data.idusuarioselect && (!codigoHeader || codigoHeader === '1')) isUserRequest = true;
  } catch(e) {}

  // 1. Mock de Dados do Usuário
  if (isUserRequest) {
    const mockUser: UsuarioItem = {
      idusuario: 1,
      tpperfil: 1,
      chtpperfil: "1",
      dstpperfil: "Administrador",
      tpsenha: 1,
      chsenha: "1",
      dssenha: "Normal",
      login: "lucas.gomes@ekio.com.br",
      nmusuario: "Lucas Gomes",
      emailusuario: "lucas.gomes@ekio.com.br",
      cryptsenha: "",
      tpplataforma: 1,
      chplataforma: "1",
      dsplataforma: "Plataforma Base",
      cdstatus: 1,
      chstatus: "1",
      dsstatus: "Ativo",
      chtermosistema: "1",
      dstermosistema: "Aceito",
      dsusuario: "Lucas Gomes",
      tptema: 1,
      chtptema: "1",
      dstptema: "Light",
      tpidioma: 1,
      chtpidioma: "pt-BR",
      dstpidioma: "Português",
      ip: "127.0.0.1"
    };
    return [200, mockUser];
  }
  
  // 2. Mock de Parceiros (Prc: 182)
  if (codigoHeader === '182') {
    return [200, [{ dschave: "1", idparceiro: 1, idusuario: 1, nmparceiro: "Mercedes" }]];
  }

  // 3. Mock de Operações (Prc: 54)
  if (codigoHeader === '54') {
    return [200, [{ idoperacao: 1, nmoperacao: "Mercedes Trucks" }]];
  }

  // 4. Mock de Domínios (Prc: 8)
  if (codigoHeader === '8') {
    return [200, [
      { iddominio: 1, idchave: "1", dschave: "Ativo", nmdominio: "cdStatusSeguro", cdacao: 1, cdstatus: 1, chstatus: "1", dsacao: "", dsstatus: "Ativo", dtcadastro: new Date().toISOString(), nrordem: "1" },
      { iddominio: 2, idchave: "2", dschave: "Inativo", nmdominio: "cdStatusSeguro", cdacao: 1, cdstatus: 1, chstatus: "2", dsacao: "", dsstatus: "Inativo", dtcadastro: new Date().toISOString(), nrordem: "2" },
      { iddominio: 3, idchave: "3", dschave: "Cancelado", nmdominio: "cdStatusSeguro", cdacao: 1, cdstatus: 1, chstatus: "3", dsacao: "", dsstatus: "Cancelado", dtcadastro: new Date().toISOString(), nrordem: "3" },
      { iddominio: 4, idchave: "449", dschave: "Vigente", nmdominio: "cdStatusSeguro", cdacao: 1, cdstatus: 1, chstatus: "449", dsacao: "", dsstatus: "Vigente", dtcadastro: new Date().toISOString(), nrordem: "4" },
      { iddominio: 5, idchave: "5", dschave: "Pré-Venda", nmdominio: "cdStatusSeguro", cdacao: 1, cdstatus: 1, chstatus: "5", dsacao: "", dsstatus: "Pré-Venda", dtcadastro: new Date().toISOString(), nrordem: "5" },
      { iddominio: 10, idchave: "10", dschave: "Desistência do cliente", nmdominio: "tpCancelamento", cdacao: 1, cdstatus: 1, chstatus: "10", dsacao: "", dsstatus: "", dtcadastro: new Date().toISOString(), nrordem: "1" },
      { iddominio: 11, idchave: "11", dschave: "Inadimplência", nmdominio: "tpCancelamento", cdacao: 1, cdstatus: 1, chstatus: "11", dsacao: "", dsstatus: "", dtcadastro: new Date().toISOString(), nrordem: "2" },
      { iddominio: 12, idchave: "12", dschave: "Erro operacional", nmdominio: "tpCancelamento", cdacao: 1, cdstatus: 1, chstatus: "12", dsacao: "", dsstatus: "", dtcadastro: new Date().toISOString(), nrordem: "3" },
      { iddominio: 20, idchave: "1", dschave: "Aprovada", nmdominio: "cdStatusProposta", cdacao: 1, cdstatus: 1, chstatus: "1", dsacao: "", dsstatus: "Aprovada", dtcadastro: new Date().toISOString(), nrordem: "1" },
      { iddominio: 21, idchave: "2", dschave: "Em Análise", nmdominio: "cdStatusProposta", cdacao: 1, cdstatus: 1, chstatus: "2", dsacao: "", dsstatus: "Em Análise", dtcadastro: new Date().toISOString(), nrordem: "2" },
      { iddominio: 22, idchave: "3", dschave: "Recusada", nmdominio: "cdStatusProposta", cdacao: 1, cdstatus: 1, chstatus: "3", dsacao: "", dsstatus: "Recusada", dtcadastro: new Date().toISOString(), nrordem: "3" },
      { iddominio: 30, idchave: "478", dschave: "Pago", nmdominio: "cdStatusParcela", cdacao: 1, cdstatus: 1, chstatus: "478", dsacao: "", dsstatus: "Pago", dtcadastro: new Date().toISOString(), nrordem: "1" },
      { iddominio: 31, idchave: "1247", dschave: "Em Aberto", nmdominio: "cdStatusParcela", cdacao: 1, cdstatus: 1, chstatus: "1247", dsacao: "", dsstatus: "Em Aberto", dtcadastro: new Date().toISOString(), nrordem: "2" },
    ]];
  }

  // 5. Se for outro serviço, assume que é dashboard ou fallback genérico
  return [200, { data: mockDashboardOverview }];
});

// 3. Mock Dispositivo (Keepins)
mock.onPost(/api\/keepins\/v1\/usuario\/dispositivo/).reply(200, {
  sucesso: true,
  mensagem: "Dispositivo registrado via Mock"
});

// 4. Mock Edição de Usuário (Keepins)
mock.onPut(/api\/keepins\/v1\/usuario\/editar/).reply(200, {
  sucesso: true,
  mensagem: "Usuário atualizado via Mock"
});

mock.onPost(/api\/keepins\/v1\/usuario\/editar/).reply(200, {
  sucesso: true,
  mensagem: "Usuário atualizado via Mock"
});
