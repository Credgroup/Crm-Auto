import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Delay de 800ms para simular tempo de resposta de rede e ver os loadings na interface
export const mock = new MockAdapter(axios, { delayResponse: 800 });
