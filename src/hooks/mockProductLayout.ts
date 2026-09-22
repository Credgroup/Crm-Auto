import { FieldType } from "@/types";

// Exemplo de layout com campo CEP que chama API
export const mockProductLayout: Partial<FieldType>[] = [
  {
    "type": "titulo_subtitulo",
    "sessao": "dados_segurado",
    "dsTitulo": "Dados Pessoais",
    "dsSubtitulo": "Preencha os campos necessários para prosseguirmos com o formulário",
    "campoApi": "primeiro_titulo_power_transmissao",
    "dateConfig": "teste"
  },
  {
    "type": "text",
    "nome": "Nome do Segurado",
    "obrigatorio": true,
    "campoApi": "nome_segurado",
    "visual": true,
    "tamanho": "200",
    "sessao": "dados_segurado"
  },
  {
    "type": "text",
    "nome": "CNPJ do Segurado",
    "obrigatorio": true,
    "campoApi": "cnpj_segurado",
    "visual": true,
    "tamanho": "14",
    "mask": "cnpj",
    "sessao": "dados_segurado",
    "desabilitar": false,
    "campoCompartilhado": true
  },
  {
    "type": "titulo_subtitulo",
    "sessao": "power_transmissao_produto_ly",
    "dsTitulo": "Produto transmissao",
    "dsSubtitulo": "Preencha os dados para estruturar a proposta",
    "campoApi": "segundo_titulo_power_transmissao"
  },
  {
    "type": "text",
    "nome": "Endereço do Risco (completo)",
    "obrigatorio": true,
    "campoApi": "endereco_risco",
    "visual": true,
    "tamanho": "255",
    "sessao": "power_transmissao_produto_ly"
  },
  {
    "type": "text",
    "nome": "Coordenadas Geográficas",
    "obrigatorio": true,
    "campoApi": "coordenadas_geograficas",
    "visual": true,
    "tamanho": "50",
    "sessao": "power_transmissao_produto_ly"
  },
  {
    "type": "text",
    "nome": "Valor em risco – Estruturas civis (BRL)",
    "obrigatorio": false,
    "campoApi": "valor_estruturas_civis_brl",
    "visual": true,
    "tamanho": "20",
    "sessao": "power_transmissao_produto_ly",
    "mask": "BRL",
    "campoCompartilhado": false,
    "desabilitar": false
  },
  {
    "type": "text",
    "nome": "Valor em risco – Transformadores (BRL)",
    "obrigatorio": false,
    "campoApi": "valor_transformadores_brl",
    "visual": true,
    "tamanho": "20",
    "sessao": "power_transmissao_produto_ly",
    "mask": "BRL"
  },
  {
    "type": "text",
    "nome": "Valor em risco – Reatores (BRL)",
    "obrigatorio": false,
    "campoApi": "valor_reatores_brl",
    "visual": true,
    "tamanho": "20",
    "sessao": "power_transmissao_produto_ly",
    "mask": "BRL"
  },
  {
    "type": "text",
    "nome": "Valor em risco – Disjuntores (BRL)",
    "obrigatorio": false,
    "campoApi": "valor_disjuntores_brl",
    "visual": true,
    "tamanho": "20",
    "sessao": "power_transmissao_produto_ly",
    "mask": "BRL"
  },
  {
    "type": "text",
    "nome": "Valor em risco – Compensadores síncronos (BRL)",
    "obrigatorio": false,
    "campoApi": "valor_compensadores_brl",
    "visual": true,
    "tamanho": "20",
    "sessao": "power_transmissao_produto_ly",
    "mask": "BRL"
  },
  {
    "type": "text",
    "nome": "Valor em risco – Equipamentos elétricos (BRL)",
    "obrigatorio": false,
    "campoApi": "valor_equipamentos_eletricos_brl",
    "visual": true,
    "tamanho": "20",
    "sessao": "power_transmissao_produto_ly",
    "mask": "BRL"
  },
  {
    "type": "number",
    "nome": "Linha de transmissão (km)",
    "obrigatorio": false,
    "campoApi": "linha_transmissao_km",
    "visual": true,
    "tamanho": "10",
    "sessao": "power_transmissao_produto_ly"
  },
  {
    "type": "calculado",
    "nome": "Subtotal civis (BRL)",
    "obrigatorio": false,
    "campoApi": "subtotal_civis_brl",
    "visual": true,
    "tamanho": "20",
    "sessao": "power_transmissao_produto_ly",
    "calculo": "{{valor_estruturas_civis_brl}}",
    "mask": "BRL"
  },
  {
    "type": "calculado",
    "nome": "Subtotal máquinas (BRL)",
    "obrigatorio": false,
    "campoApi": "subtotal_maquinas_brl",
    "visual": true,
    "tamanho": "20",
    "sessao": "power_transmissao_produto_ly",
    "calculo": "({{valor_estruturas_civis_brl}} + {{valor_reatores_brl}} + {{valor_disjuntores_brl}} + {{valor_compensadores_brl}} + {{valor_equipamentos_eletricos_brl}} + {{linha_transmissao_km}}) / 6",
    "mask": "BRL"
  },
  {
    "type": "calculado",
    "nome": "Valor em risco total (BRL)",
    "obrigatorio": true,
    "campoApi": "valor_risco_total_brl",
    "visual": true,
    "tamanho": "20",
    "sessao": "power_transmissao_produto_ly",
    "calculo": "{{subtotal_maquinas_brl}} + {{subtotal_civis_brl}}",
    "mask": "BRL"
  }
]

