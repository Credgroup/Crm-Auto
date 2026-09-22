import { DataTable } from "@/components/DataTable/DataTable";
import { DataTableColumnHeader } from "@/components/DataTable/DataTableColumnHeader";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { execApi } from "@/hooks/useApi";
import { dev_log } from "@/lib/utils";
import { useOperationStore } from "@/store/operationStore";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Historico {
  idEmpresaOperacaoHistorico: number;
  idEmpresaOperacao: string;
  dtHistorico: string;
  nmEvento: string;
  tpMovimento: number;
  chMovimento: number;
  dsMovimento: string;
  stMovimento: string;
  idUsuario: number;
  dsObs: string;
}
const columnsHistoric: ColumnDef<Historico>[] = [
  {
    accessorKey: "dtHistorico",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data" />
    ),
    cell: ({ row }) => {
      return <div>{format(new Date(row.original.dtHistorico), "dd/MM/yyyy hh:mm:ss")}</div>
    }
  },
  {
    accessorKey: "idUsuario",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID Usuário" />
    ),
  },
  {
    accessorKey: "nmEvento",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Evento" />
    ),
  },
  {
    accessorKey: "dsObs",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Observação" />
    ),
    cell: ({ row }) => {
      const item = row.original;
      function formatDesc(desc: string) {
        if (!desc) return "Sem observação";
        if (desc.length > 50) {
          return `${desc.slice(0, 50)}...`;
        }
        return desc;
      }
      return (
        <HoverCard>
          <HoverCardTrigger>{formatDesc(item.dsObs)}</HoverCardTrigger>
          <HoverCardContent>
            <div className="text-md font-bold">Observação:</div>
            {item.dsObs}
          </HoverCardContent>
        </HoverCard>
      );
    },
  },
];

type HistoricoTabProps = {
  cliData?: any;
  type?: "enterprise" | "person";
};

type getEnterpriseHistoricResponse = {
  items: Historico[],
  totalCount: number,
  pageNumber: number,
  pageSize: number
}

const pageSize = 10

function HistoricoTab({type, cliData} : Readonly<HistoricoTabProps>) {
  const [pageIndex, setPageIndex] = useState(0);

  const idOperation = useOperationStore((state) => state.idOperation)

  const {data, isError, isSuccess, isLoading, error} = useQuery({
    queryKey: ["getEnterpriseHistoric", type, idOperation, pageIndex],
    queryFn: async () => {
      if(type !== "enterprise"){
        return 
      }

      if(!cliData.idEmpresaOperacao){
        throw new Error("idEmpresaOperação não definido.")
      }

      try {
        const res: any = await execApi({
          url: `api/crm/company/find/history/${cliData.idEmpresaOperacao}?pageNumber=${pageIndex + 1}&pageSize=${pageSize}`,
          data: {},
          method: "GET",
          isCrmApi: true
        })

        dev_log(()=>console.log(res))

        if("success" in res.data){
          throw new Error("Algum erro aconteceu ao buscar histórico \n\n" + res.data.message)
        }

        return res.data as getEnterpriseHistoricResponse

      } catch (error: any) {
        if(error.response){
          throw new Error(error.response.data.message)
        }
        throw new Error(error.message)       
      }
    },
    enabled: !!idOperation && type == "enterprise",
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retry: 0
  })

  useEffect(()=>{
    if(data && isSuccess){
      dev_log(()=> console.log(data))
    }
  }, [data, isSuccess])
  
  useEffect(()=>{
    if(error && isError){
      dev_log(()=> console.log(error))
      toast.error(error.message)
    }
  }, [error, isError])


  return (
    <div className="w-full flex-1 pr-4">

        {
          type == "enterprise" ? (
            <DataTable
              columns={columnsHistoric}
              data={data?.items ?? []}
              error={isError}
              pageIndex={pageIndex}
              onPageChange={setPageIndex}
              pageCount={Math.ceil((data?.totalCount ?? 0) / pageSize)}
              loading={isLoading}
            />

          ) : (
            <>Em desenvolvimento</>
          )
        }

    </div>
  );
}

export default HistoricoTab;
