import { FieldType } from "@/lib/sbs-form-components/src/core/types";

export const mockData: Partial<FieldType>[] = [
  {
    "type": "titulo_subtitulo",
    "sessao": "dados_gerais",
    "dsTitulo": "Dados Gerais",
    "dsSubtitulo": "Coloque os primeiros dados da empresa"
  },
  {
    "type": "text",
    "nome": "Nome",
    "campoApi": "nmEmpresa",
    "tamanho": "200",
    "obrigatorio": true,
    "visual": true,
    "sessao": "dados_gerais"
  },
  {
    "type": "select",
    "options": "Matriz:cnpjmatriz;Filial:cnpjfilial;",
    "nome": "Tipo de CNPJ",
    "campoApi": "tpCnpj",
    "obrigatorio": true,
    "visual": true,
    "sessao": "dados_gerais",
  },
  {
    "type": "text",
    "nome": "Numero de CNPJ",
    "campoApi": "nrCnpj",
    "obrigatorio": true,
    "visual": true,
    "sessao": "dados_gerais",
    "mask": "cnpj"
  },
  {
    "type": "text",
    "nome": "Razao Social",
    "tamanho": "200",
    "visual": true,
    "obrigatorio": true,
    "campoApi": "dsRazaoSocial",
    "sessao": "dados_gerais"
  },
  {
    "type": "text",
    "nome": "Numero de inscrição Estadual",
    "tamanho": "14",
    "campoApi": "nrInscricaoEstadual",
    "visual": true,
    "obrigatorio": true,
    "sessao": "dados_gerais"
  },
  {
    "type": "text",
    "nome": "idExterno",
    "campoApi": "idExterno",
    "obrigatorio": true,
    "visual": true,
    "tamanho": "30",
    "sessao": "dados_gerais"
  },
  {
    "type": "titulo_subtitulo",
    "sessao": "dados_contato",
    "dsTitulo": "Dados de Contato",
    "dsSubtitulo": "Forneça os detalhes de contato com essa empresa"
  },
  {
    "type": "number",
    "nome": "DDD",
    "tamanho": "2",
    "campoApi": "nrDDD",
    "obrigatorio": true,
    "visual": true,
    "sessao": "dados_contato"
  },
  {
    "type": "text",
    "nome": "Numero de telefone",
    "campoApi": "nrTelefone",
    "obrigatorio": true,
    "visual": true,
    "sessao": "dados_contato",
    "mask": "celular_simples"
  },
  {
    "type": "email",
    "nome": "Email",
    "visual": true,
    "obrigatorio": true,
    "campoApi": "dsEmail",
    "sessao": "dados_contato"
  },
  {
    "type": "text",
    "nome": "CEP",
    "campoApi": "nrCep",
    "visual": true,
    "obrigatorio": true,
    "mask": "cep",
    "sessao": "dados_contato",
    "apiConfig": {
      "type": "cep",
      "targetFields": [
        {
        "targetName": "logradouro",
        "apiResponseKey": "logradouro"
        },
        {
        "targetName": "bairro",
        "apiResponseKey": "bairro"
        },
        {
        "targetName": "cidade",
        "apiResponseKey": "localidade"
        },
        {
        "targetName": "estado",
        "apiResponseKey": "uf"
        }

      ],
      "triggerOnComplete": true,
      "debounceMs": 500

    }
  },
  {
    "type": "text",
    "nome": "Endereco",
    "tamanho": "200",
    "campoApi": "dsEndereco",
    "obrigatorio": true,
    "visual": true,
    "sessao": "dados_contato",
    "target": "logradouro"
  },
  {
    "type": "text",
    "nome": "Bairro",
    "tamanho": "200",
    "campoApi": "nmBairro",
    "obrigatorio": true,
    "visual": true,
    "sessao": "dados_contato",
    "target": "bairro"
  },
  {
    "type": "number",
    "nome": "Número",
    "campoApi": "nrEndereco",
    "obrigatorio": true,
    "visual": true,
    "sessao": "dados_contato"
  },
  {
    "type": "text",
    "nome": "Cidade",
    "tamanho": "200",
    "campoApi": "nmCidade",
    "obrigatorio": true,
    "visual": true,
    "sessao": "dados_contato",
    "target": "cidade"
  },
  {

    "campoApi": "CdUF",
    "nome": "Estado",
    "obrigatorio": true,
    "type": "select",
    "sessao": "dados_contato",
    "options": "AC:AC;AL:AL;AP:AP;AM:AM;BA:BA;CE:CE;DF:DF;ES:ES;GO:GO;MA:MA;MT:MT;MS:MS;MG:MG;PA:PA;PB:PB;PR:PR;PE:PE;PI:PI;RJ:RJ;RN:RN;RS:RS;RO:RO;RR:RR;SC:SC;SP:SP;SE:SE;TO:TO",
    "campoCompartilhado": false,
    "dominio": false,
    "desabilitar": false,
    "target": "estado"
  },
  {
    "type": "titulo_subtitulo",
    "sessao": "dados_bancarios",
    "dsTitulo": "Dados Bancários",
    "dsSubtitulo": "Forneça os detalhes bancários da empresa para pagamentos"
  },
  {
    "type": "number",
    "nome": "Conta corrente",
    "campoApi": "nrContaCorrente",
    "obrigatorio": true,
    "visual": true,
    "sessao": "dados_bancarios"
  },
  {
    "type": "number",
    "nome": "Agência",
    "campoApi": "nrAgencia",
    "obrigatorio": true,
    "visual": true,
    "sessao": "dados_bancarios"
  },
  {
    "type": "text",
    "nome": "Banco",
    "campoApi": "nmBanco",
    "obrigatorio": true,
    "visual": true,
    "sessao": "dados_bancarios"
  },
  {
    "type": "titulo_subtitulo",
    "sessao": "colaboradores_table",
    "dsTitulo": "Vincular colaboradores?",
    "dsSubtitulo": "Preencha os campos ou faça upload de um CSV, CLSX."
  },
  {
    "type": "tabela",
    "colunas": [
      {
        "type": "text",
        "nmColunaTemplate": "nome_colaborador",
        "nome": "Nome",
        "obrigatorio": true,
        "id": "GR1siBBSvn"
      },
      {
        "type": "text",
        "nmColunaTemplate": "nrCpf",
        "nome": "CPF",
        "mask": "cpf",
        "obrigatorio": true,
        "id": "Ag9T9HBYon"
      },
      {
        "type": "select",
        "nmColunaTemplate": "tpSexo",
        "nome": "Sexo",
        "options": "Feminino:F;Masculino:M;",
        "obrigatorio": true,
        "id": "XyMm5v9zb2"
      },
      {
        "type": "select",
        "nmColunaTemplate": "tpEstadoCivil",
        "nome": "Estado Civil",
        "options": "Solteiro:solteiro;Casado:casado;Viúvo:viuvo;Separado:separado;Sem Registro:semregistro",
        "obrigatorio": true,
        "id": "GX0Bo3gdDE"
      },
      {
        "type": "text",
        "nmColunaTemplate": "dtNascimento",
        "nome": "Data de Nascimento",
        "mask": "data",
        "obrigatorio": true,
        "id": "QcoPt0Zibv"
      },
      {
        "type": "text",
        "nmColunaTemplate": "idExterno",
        "nome": "Id Externo",
        "obrigatorio": false,
        "id": "5o0ZXdqICh"
      },
      {
        "type": "email",
        "nmColunaTemplate": "email",
        "nome": "Email",
        "id": "S0Hf3PztPB"
      },
      {
        "type": "text",
        "nmColunaTemplate": "nrTelefone",
        "nome": "Telefone",
        "mask": "telefone",
        "id": "PLrjtE3tGb"
      }
    ],
    "nome": "Adicionar colaboradores",
    "sessao": "colaboradores_table",
    "campoApi": "tabelaColaboradores"
  }
]
