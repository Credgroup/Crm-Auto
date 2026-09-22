import { useEffect, useState } from "react";
import ShowHideInformation from "../../ShowHideInformation";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { Proposal } from "@/types";

type AgroupedProposalsDetailsTabProps = {
  details: Partial<Proposal>;
};

export default function AgroupedProposalsDetailsTab({
  details,
}: Readonly<AgroupedProposalsDetailsTabProps>) {
  const [canViewInfo, setCanViewInfo] = useState(false);
  useEffect(() => {
    console.log(details);
  }, []);

  return (
    <div className="h-full">
      <div className="flex items-center space-x-2 mb-8">
        <p className="font-medium text-xl">Dados do agrupamento</p>
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
      </div>
      <div className="grid grid-cols-2 gap-4 p-4 bg-muted/70 rounded-md">
        <div>
          <p className="text-sm text-gray-500">Nome:</p>
          <ShowHideInformation show={canViewInfo}>
            <p className="font-medium">{details.nmProposta ?? "--"}</p>
          </ShowHideInformation>
        </div>
        <div>
          <p className="text-sm text-gray-500">ID:</p>
          <ShowHideInformation show={canViewInfo}>
            <p className="font-medium">{details.idGrupoProposta ?? "--"}</p>
          </ShowHideInformation>
        </div>

        <div>
          <p className="text-sm text-gray-500">Código da Proposta:</p>
          <ShowHideInformation show={canViewInfo}>
            <p className="font-medium">{details.cdProposta ?? "--"}</p>
          </ShowHideInformation>
        </div>
        <div>
          <p className="text-sm text-gray-500">Status da Proposta (Código):</p>
          <ShowHideInformation show={canViewInfo}>
            <p className="font-medium">{details.cdStatusProposta ?? "--"}</p>
          </ShowHideInformation>
        </div>

        <div>
          <p className="text-sm text-gray-500">Data de Cadastro:</p>
          <ShowHideInformation show={canViewInfo}>
            <p className="font-medium">
              {details.dtCadastro
                ? format(new Date(details.dtCadastro), "dd/MM/yyyy HH:mm")
                : "--"}
            </p>
          </ShowHideInformation>
        </div>
        <div>
          <p className="text-sm text-gray-500">Data de Início:</p>
          <ShowHideInformation show={canViewInfo}>
            <p className="font-medium">
              {details.dtVigenciaInicio
                ? format(new Date(details.dtVigenciaInicio), "dd/MM/yyyy")
                : "--"}
            </p>
          </ShowHideInformation>
        </div>
        <div>
          <p className="text-sm text-gray-500">Observação:</p>
          <ShowHideInformation show={canViewInfo}>
            <p className="font-medium">{details.dsObservacao ?? "--"}</p>
          </ShowHideInformation>
        </div>

        <div>
          <p className="text-sm text-gray-500">Data Final:</p>
          <ShowHideInformation show={canViewInfo}>
            <p className="font-medium">
              {details.dtVigenciaFinal
                ? format(new Date(details.dtVigenciaFinal), "dd/MM/yyyy")
                : "--"}
            </p>
          </ShowHideInformation>
        </div>
        <div>
          <p className="text-sm text-gray-500">Data de Envio:</p>
          <ShowHideInformation show={canViewInfo}>
            <p className="font-medium">
              {details.dtEnvio
                ? format(new Date(details.dtEnvio), "dd/MM/yyyy HH:mm")
                : "--"}
            </p>
          </ShowHideInformation>
        </div>

        <div>
          <p className="text-sm text-gray-500">ID da Empresa:</p>
          <ShowHideInformation show={canViewInfo}>
            <p className="font-medium">{details.idEmpresaOperacao ?? "--"}</p>
          </ShowHideInformation>
        </div>
        <div>
          <p className="text-sm text-gray-500">ID do Produto:</p>
          <ShowHideInformation show={canViewInfo}>
            <p className="font-medium">{details.idProduto ?? "--"}</p>
          </ShowHideInformation>
        </div>

        <div>
          <p className="text-sm text-gray-500">ID do Segurado:</p>
          <ShowHideInformation show={canViewInfo}>
            <p className="font-medium">{details.idSeguradoi2k ?? "--"}</p>
          </ShowHideInformation>
        </div>
        <div>
          <p className="text-sm text-gray-500">Chave do Status:</p>
          <ShowHideInformation show={canViewInfo}>
            <p className="font-medium">{details.chStatusProposta ?? "--"}</p>
          </ShowHideInformation>
        </div>

        <div>
          <p className="text-sm text-gray-500">ID da Proposta:</p>
          <ShowHideInformation show={canViewInfo}>
            <p className="font-medium">{details.idProposta ?? "--"}</p>
          </ShowHideInformation>
        </div>
        <div>
          <p className="text-sm text-gray-500">ID do Usuário:</p>
          <ShowHideInformation show={canViewInfo}>
            <p className="font-medium">{details.idUsuario ?? "--"}</p>
          </ShowHideInformation>
        </div>

        <div className="col-span-2">
          <p className="text-sm text-gray-500">Status da Proposta:</p>
          <ShowHideInformation show={canViewInfo}>
            <p className="font-medium">{details.statusProposta ?? "--"}</p>
          </ShowHideInformation>
        </div>

        <div>
          <p className="text-sm text-gray-500">Data de Alteração:</p>
          <ShowHideInformation show={canViewInfo}>
            <p className="font-medium">
              {details.dtAlteracao
                ? format(new Date(details.dtAlteracao), "dd/MM/yyyy HH:mm")
                : "--"}
            </p>
          </ShowHideInformation>
        </div>
      </div>
    </div>
  );
}
