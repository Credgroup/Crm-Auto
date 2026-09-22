import { Button } from "@/components/ui/button";
import { formatValue } from "@/lib/utils";
import { Enterprise, Person } from "@/types";
import { Eye, EyeOff } from "lucide-react";
import EditEnterpriseInfo from "./EditEnterpriseInfo";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import ShowHideInformation from "./ShowHideInformation";
import LinkedEnterpriseAvatar from "./LinkedEnterpriseAvatar";
import EditPersonInfo from "./EditPersonInfo";
import { format } from "date-fns";
import { DataTable } from "@/components/DataTable/DataTable";
import { 
          empresasDadosBancariosLayout,
          columnsDadosBancarios } from "./dadosBancariosColumns";


type DadosGeraisTabProps =
  | {
      typeLead: "person";
      data: Person;
      bankdata?: null;
      refetchLeadData: () => void;
      refetchBankData?: () => void;
    }
  | {
      typeLead: "enterprise";
      data: Enterprise;
      bankdata?: empresasDadosBancariosLayout | null;
      refetchLeadData: () => void;
      refetchBankData?: () => void;
    }
  | {
      typeLead?: null;
      bankdata?:  null;
      data: Person | Enterprise;
      refetchLeadData: () => void;
      refetchBankData?: () => void;
    };

function DadosGeraisTab({
  typeLead,
  data,
  bankdata,
  refetchLeadData,
  refetchBankData,
}: Readonly<DadosGeraisTabProps>) {
  const [canViewInfo, setCanViewInfo] = useState(false);
  const [adicional, setAdicional] = useState<any>({});

  useEffect(() => {
    setAdicional(JSON.parse(data.adicional ?? "{}"));
    console.log(adicional);
  }, [data]);

  if (typeLead === "person") {
    return (
      <div className="space-y-4">
        <div className="w-full flex items-center justify-end gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="secondary"
                className="w-8 h-8"
                onClick={() => setCanViewInfo((prev) => !prev)}
              >
                {canViewInfo && <EyeOff />}
                {!canViewInfo && <Eye />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Visualizar</TooltipContent>
          </Tooltip>
          <EditPersonInfo
            personDefault={data}
            refetchLeadData={() => refetchLeadData()}
          />
        </div>
        <div className="w-full flex items-center justify-start gap-2">
          <LinkedEnterpriseAvatar id={data.idEmpresaOperacao} />
        </div>
        <div className="flex items-center space-x-2">
          <p className="font-medium text-xl">Dados Gerais</p>
        </div>
        <div className="grid grid-cols-2 gap-4 p-4 bg-muted/70 rounded-md">
          <div>
            <p className="text-sm text-gray-500">Nome:</p>
            <ShowHideInformation show={canViewInfo}>
              <p className="font-medium">{data.nome}</p>
            </ShowHideInformation>
          </div>
          <div>
            <p className="text-sm text-gray-500">CPF:</p>
            <ShowHideInformation show={canViewInfo}>
              <p className="font-medium">
                {formatValue("cpf", data.cpf.toString() ?? "")}
              </p>
            </ShowHideInformation>
          </div>
          <div>
            <p className="text-sm text-gray-500">Sexo:</p>
            <ShowHideInformation show={canViewInfo}>
              <p className="font-medium">{data.sexo}</p>
            </ShowHideInformation>
          </div>
          <div>
            <p className="text-sm text-gray-500">Estado civil:</p>
            <ShowHideInformation show={canViewInfo}>
              <p className="font-medium">{data.estadoCivil}</p>
            </ShowHideInformation>
          </div>
          <div>
            <p className="text-sm text-gray-500">Id Externo:</p>
            <ShowHideInformation show={canViewInfo}>
              <p className="font-medium">{data.idExterno}</p>
            </ShowHideInformation>
          </div>
          <div>
            <p className="text-sm text-gray-500">Data Nascimento:</p>
            <ShowHideInformation show={canViewInfo}>
              <p className="font-medium">
                {data.dataNascimento ? format(new Date(data.dataNascimento), "dd/MM/yyyy") : "--"}
              </p>
            </ShowHideInformation>
          </div>
        </div>

        {Object.keys(adicional).length > 0 && (
          <>
            <div className="flex items-center space-x-2">
              <p className="font-medium text-xl">Adicional</p>
            </div>
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/70 rounded-md">
              <div>
                <p className="text-sm text-gray-500">CEP:</p>
                <ShowHideInformation show={canViewInfo}>
                  <p className="font-medium">{adicional.cep}</p>
                </ShowHideInformation>
              </div>
              <div>
                <p className="text-sm text-gray-500">Bairro:</p>
                <ShowHideInformation show={canViewInfo}>
                  <p className="font-medium">{adicional.bairro}</p>
                </ShowHideInformation>
              </div>
              <div>
                <p className="text-sm text-gray-500">Cidade:</p>
                <ShowHideInformation show={canViewInfo}>
                  <p className="font-medium">{adicional.cidade}</p>
                </ShowHideInformation>
              </div>
              <div>
                <p className="text-sm text-gray-500">UF:</p>
                <ShowHideInformation show={canViewInfo}>
                  <p className="font-medium">{adicional.estado}</p>
                </ShowHideInformation>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  if (typeLead === "enterprise") {

    console.log("Valor da data:")
    console.log(data)
     const columnsBank = columnsDadosBancarios(refetchBankData);

    return (
      <div className="space-y-4">
        <div className="w-full flex items-center justify-end gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="secondary"
                className="w-8 h-8"
                onClick={() => setCanViewInfo((prev) => !prev)}
              >
                {canViewInfo && <EyeOff />}
                {!canViewInfo && <Eye />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Visualizar</TooltipContent>
          </Tooltip>
          <EditEnterpriseInfo
            enterpriseDefault={data}
            refetchLeadData={() => refetchLeadData()}
          />
        </div>
        <div className="flex items-center space-x-2">
          <p className="font-medium text-xl">Dados Gerais</p>
        </div>
        <div className="grid grid-cols-2 gap-4 p-4 bg-muted/70 rounded-md">
          <div>
            <p className="text-sm text-gray-500">Nome Fantasia:</p>
            <ShowHideInformation show={canViewInfo}>
              <p className="font-medium">{data.nmFantasia ?? "--"}</p>
            </ShowHideInformation>
          </div>
          <div>
            <p className="text-sm text-gray-500">Razão Social:</p>
            <ShowHideInformation show={canViewInfo}>
              <p className="font-medium">{data.nmRazaoSocial ?? "--"}</p>
            </ShowHideInformation>
          </div>
          <div>
            <p className="text-sm text-gray-500">CNPJ:</p>
            <ShowHideInformation show={canViewInfo}>
              <p className="font-medium">
                {data.nrCNPJ ? formatValue("cnpj", data.nrCNPJ) : "--"}
              </p>
            </ShowHideInformation>
          </div>
          <div>
            <p className="text-sm text-gray-500">Id Externo:</p>
            <ShowHideInformation show={canViewInfo}>
              <p className="font-medium">
                {data.idExterno ? data.idExterno : "--"}
              </p>
            </ShowHideInformation>
          </div>
          <div>
            <p className="text-sm text-gray-500">Inscrição Estatudal</p>
            <ShowHideInformation show={canViewInfo}>
              <p className="font-medium">{data.nrInscricaoEstadual ?? "--"}</p>
            </ShowHideInformation>
          </div>
          <div>
            <p className="text-sm text-gray-500">Telefone</p>
            <ShowHideInformation show={canViewInfo}>
              <p className="font-medium">
                {data.nrTelefone &&
                  data.nrTelefone.toString().length > 8 &&
                  formatValue(
                    "celular",
                    String(data.nrDDD) + data.nrTelefone.toString()
                  )}
                {data.nrTelefone &&
                  data.nrTelefone.toString().length == 8 &&
                  formatValue(
                    "fixo",
                    String(data.nrDDD) + data.nrTelefone.toString()
                  )}
                {!data.nrTelefone && <span>--</span>}
              </p>
            </ShowHideInformation>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <ShowHideInformation show={canViewInfo}>
              <p className="font-medium">{data.dsEmail ?? "--"}</p>
            </ShowHideInformation>
          </div>
          <div className="flex items-center space-x-2">
          <p className="font-medium text-xl"></p>
        </div>
        <div className="flex items-center space-x-2">
          <p className="font-medium text-xl">Endereço</p>
        </div>
        <div className="flex items-center space-x-2">
          <p className="font-medium text-xl"></p>
        </div>
          <div>
                <p className="text-sm text-gray-500">CEP:</p>
                <ShowHideInformation show={canViewInfo}>
                  <p className="font-medium">{data.nrCEP}</p>
                </ShowHideInformation>
              </div>
              <div>
                <p className="text-sm text-gray-500">Bairro:</p>
                <ShowHideInformation show={canViewInfo}>
                  <p className="font-medium">{data.nmBairro}</p>
                </ShowHideInformation>
              </div>
              <div>
                <p className="text-sm text-gray-500">Cidade:</p>
                <ShowHideInformation show={canViewInfo}>
                  <p className="font-medium">{data.nmCidade}</p>
                </ShowHideInformation>
              </div>
              <div>
                <p className="text-sm text-gray-500">UF:</p>
                <ShowHideInformation show={canViewInfo}>
                  <p className="font-medium">{data.cdUF}</p>
                </ShowHideInformation>
              </div>
              <div>
                <p className="text-sm text-gray-500">Logradouro:</p>
                <ShowHideInformation show={canViewInfo}>
                  <p className="font-medium">{data.nmLogradouro}</p>
                </ShowHideInformation>
              </div>
              <div>
                <p className="text-sm text-gray-500">Número:</p>
                <ShowHideInformation show={canViewInfo}>
                  <p className="font-medium">{data.nrLogradouro}</p>
                </ShowHideInformation>
              </div>
        </div>
              <div className="flex items-center space-x-2">
              <p className="font-medium text-xl">Dados Bancarios</p>
            </div>
            <div className="grid grid-cols-1 gap-4 p-4 bg-muted/70 rounded-md">
              <ShowHideInformation show={canViewInfo}>
              <DataTable
                columns={columnsBank}                
                // data={bankdata?.items ?? []}
                 data={[...(bankdata?.items ?? [])]}
              />
              </ShowHideInformation>
            </div>    

      </div>
    );
  }

  return <p>erro</p>;
}

export default DadosGeraisTab;
