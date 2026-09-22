import './mockBootstrap';
import './authMocks';
import './enterpriseMocks';
import './leadMocks';
import './productMocks';
import './proposalMocks';
import './insuranceMocks';
import './dashboardMocks';
import './commissionMocks';
import './workflowMocks';
import { mock } from './mockInstance';

console.log('🚧 API Mocks Ativados: O axios-mock-adapter está interceptando as requisições de rede. 🚧');

// Pass through como fallback final para qualquer rota não mockada
mock.onAny().passThrough();
