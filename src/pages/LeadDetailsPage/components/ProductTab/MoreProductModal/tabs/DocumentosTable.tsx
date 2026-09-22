import { DataTable } from "@/components/DataTable/DataTable";
import { execApi } from "@/hooks/useApi";
import { DocumentosProdutoItem } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useOperationStore } from "@/store/operationStore";
import { useEffect, useState } from "react";
import { useColumnsDocumentosTab } from "./columns";

type DocumentosTableProps = {
  idSeguro?: number | string | null;
  idEmpresaOperation?: string
}

export default function DocumentosTable({ idSeguro, idEmpresaOperation}: Readonly<DocumentosTableProps>) {
    const [pageIndex, setPageIndex] = useState(0);
    const [idSeguradoi2k, setidSeguradoi2k] = useState<number | undefined>(undefined)
    const pageSize = 10;
    const idOperation = useOperationStore((state) => state.idOperation);

   const { data, isLoading, isError, error, isFetching, isRefetching, isSuccess } = useQuery({
    queryKey: ["documentosSeguro", pageIndex, pageSize, idSeguro, idOperation],
    queryFn: () => getDocumentosSeguro({idToSearch: idSeguro, pageIndex: pageIndex + 1, pageSize }),
    enabled: !!idOperation && !!idSeguro,
    retry: false,
    refetchOnWindowFocus: false,
    })
    useEffect(() => {
        if(isSuccess && data) {
            console.log(data)
        }
    }, [isSuccess, data])

    useEffect(() => {
        if(isError && error) {
            console.log(error)
        }
    }, [isError, error])

    useEffect(() => {
      async function buscarId() {
    if (idEmpresaOperation) {
        const response = await getIdSeguradoi2k(idEmpresaOperation)
        const id = response.items?.[0]?.idSeguradoI2k ?? undefined
        setidSeguradoi2k(id)
        console.log("idSeguradoi2k")
        console.log(idSeguradoi2k)
      }
    }

    buscarId()
    }, [idEmpresaOperation])

    console.log(data)
    const itemsWithSeguradoi2k = data?.items?.map((item) => ({
      ...item,
      idSeguradoi2k: idSeguradoi2k
    })) ?? []
    console.log(itemsWithSeguradoi2k)

    const columnsDocumentosTab = useColumnsDocumentosTab(idEmpresaOperation ?? "")

  return (
    <>
      <div className="flex items-center space-x-2 mb-8">
        <p className="font-medium text-xl">Documentos do Produto</p>
      </div>
      <div className="w-full h-full">
        <DataTable
          columns={columnsDocumentosTab}
          data={itemsWithSeguradoi2k}
          error={false}
          filter={["data"]}
          pageIndex={pageIndex}
          onPageChange={setPageIndex}
          pageCount={Math.ceil((data?.totalCount ?? 0) / pageSize)}
          loading={isFetching ?? isRefetching ?? isLoading}
        />
      </div>
    </>
  );
}

interface DocumentosSeguroResponse {
  items: DocumentosProdutoItem[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}


type GetDocumentoSeguroProps = {
  idToSearch?: number | string | null;
  pageIndex: number;
  pageSize: number;
}

type RepresentativeItem = {
  idSegurado: number
  idSeguradoI2k: number
  nome: string
  cpf: number
  dataNascimento: string
  idExterno: string
  idOperacao: number
  idEmpresaOperacao: string
}

type RepresentativeResponse = {
  items: RepresentativeItem[]
  totalCount: number
  pageNumber: number
  pageSize: number
}
  
async function getDocumentosSeguro({ idToSearch, pageIndex, pageSize }: Readonly<GetDocumentoSeguroProps>) {
    if(!idToSearch) {
        throw new Error("idToSearch não foram encontrados");
    }

    const res: any = await execApi({
        url: `api/crm/insurance/find/document/${idToSearch}?pageNumber=${pageIndex}&pageSize=${pageSize}`,
        method: "GET",
        data: {},
        isCrmApi: true
    })

    console.log(res)

    if(res.status !== 200) {
        throw new Error("Aconteceu algum erro ao buscar os documentos");
    }

    return res.data as DocumentosSeguroResponse;

}

async function getIdSeguradoi2k(idEmpresaOperation: string) {
    if(!idEmpresaOperation) {
        throw new Error("idEmpresaOperation não foi encontrado encontrados");
    }

    const res = await execApi({
            url: "api/crm/lead/find/representative",
            method: "POST",
            data: {
              idEmpresaOperacao: idEmpresaOperation,
            },
            isCrmApi: true,
          });

    console.log(res)

    if(res.status !== 200) {
        throw new Error("Aconteceu algum erro ao buscar o IdSeguradoi2k");
    }

     return res.data as RepresentativeResponse;

}