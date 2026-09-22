import { DataTable } from "@/components/DataTable/DataTable";
import useColumnsProdutosTab from "./columns";
import useColumnsProdutosTabEnterprise from "./columnsEnterprise"
import { ProductTable, DocumentosProdutoItem, ProductTableEnterprise } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { execApi } from "@/hooks/useApi";
import { useEffect, useState } from "react";

type ProductTabProps = {
  id?: string;
  type?: string;
}

type ProductTableResponse = {
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  items: ProductTable[];
}

type ProductTableResponseEnterprise = {
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  items: ProductTableEnterprise[];
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

const pageSize = 6;

export default function ProductTab({ id, type }: Readonly<ProductTabProps>) {
  const [pageIndex, setPageIndex] = useState(0);
  const [filters, setFilters] = useState({
    tpFilter: "",
    filterValue: "",
  })
  const [search, setSearch] = useState({
    tpFilter: "",
    filterValue: "",
  })
  const [documentosPorSeguro, setDocumentosPorSeguro] = useState<Record<number, DocumentosProdutoItem[]>>({})
  const [carregandoDocumentos, setCarregandoDocumentos] = useState<Set<number>>(new Set())

  const { data, isLoading, error, isError, isSuccess, isRefetching, isPending,  } = useQuery({
    queryKey: ["userproducts", id, type, search],
    queryFn: async ({ queryKey }) => {
      const [_, id, type] = queryKey;

      if (!id || !type) {
        throw new Error("Id e type não podem ser vazios");
      }

      if(type === "enterprise") {
        // const res: ProductTableResponse = {
        //   totalCount: 0,
        //   pageNumber: 0,
        //   pageSize: 0,
        //   items: [],
        // }

        let url = `api/crm/insurance/find/list/company/${id}`
        if(search.tpFilter && search.filterValue){
          url += `?tpFilter=${search.tpFilter}&filterValue=${encodeURIComponent(search.filterValue)}`
        }
        const res = await execApi({
          url,
          method: "GET",
          data: {},
          isCrmApi: true,
        })
        

        return res.data as ProductTableResponseEnterprise;
      }else{
        let url = `api/crm/insurance/find/list/segurado/${id}`
        if(search.tpFilter && search.filterValue){
          url += `?tpFilter=${search.tpFilter}&filterValue=${encodeURIComponent(search.filterValue)}`
        }
        const res = await execApi({
          url,
          method: "GET",
          data: {},
          isCrmApi: true,
        })
        return res.data as ProductTableResponse;
      }

    },
    enabled: !!id && !!type,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: false,
    staleTime: 0
  })

  // Buscar documentos ao abrir a aba
  useEffect(() => {
    if (isSuccess && data?.items) {
      data.items.forEach(async (product) => {
        // Marca como carregando
        setCarregandoDocumentos((prev) => new Set(prev).add(product.idSeguro))
        
        try {
          const docs = await getDocumentosSeguro({
            idToSearch: product.idSeguro,
            pageIndex: 1,
            pageSize: 10,
          })
          setDocumentosPorSeguro((prev) => ({
            ...prev,
            [product.idSeguro]: docs.items
          }))
          console.log(`Documentos do seguro ${product.idSeguro}:`, docs.items)
        } catch (err) {
          console.error(`Erro ao buscar documentos do seguro ${product.idSeguro}:`, err)
        } finally {
          // Remove do carregando após sucesso ou erro
          setCarregandoDocumentos((prev) => {
            const newSet = new Set(prev)
            newSet.delete(product.idSeguro)
            return newSet
          })
        }
      })
    }
  }, [isSuccess, data])

  useEffect(()=>{
    if(isSuccess){
      console.log(data);
    }
  }, [isSuccess, data])

  useEffect(()=>{
    if(isError){
      console.log(error);
    }
  }, [isError, error])

  const refetchDocumentosSeguro = async (idSeguro: number) => {
    setCarregandoDocumentos((prev) => new Set(prev).add(idSeguro))
    
    try {
      const docs = await getDocumentosSeguro({
        idToSearch: idSeguro,
        pageIndex: 1,
        pageSize: 10,
      })
      setDocumentosPorSeguro((prev) => ({
        ...prev,
        [idSeguro]: docs.items
      }))
      console.log(`Documentos do seguro ${idSeguro} atualizados:`, docs.items)
    } catch (err) {
      console.error(`Erro ao buscar documentos do seguro ${idSeguro}:`, err)
    } finally {
      setCarregandoDocumentos((prev) => {
        const newSet = new Set(prev)
        newSet.delete(idSeguro)
        return newSet
      })
    }
  }

   const { columns, columnsLoading } = useColumnsProdutosTab(documentosPorSeguro, carregandoDocumentos, refetchDocumentosSeguro)
  const { columns: columnsEnterprise, columnsLoading: columnsLoadingEnterprise, } = useColumnsProdutosTabEnterprise(documentosPorSeguro, carregandoDocumentos, refetchDocumentosSeguro, id)

  if (type == "enterprise") {
    return(
    <DataTable
        columns={columnsEnterprise}
        data={(data as ProductTableResponseEnterprise)?.items ?? []}
        pageCount={Math.ceil((data?.totalCount ?? 0) / pageSize)}
        pageIndex={pageIndex}
        onPageChange={setPageIndex}
        error={isError}
        loading={
          isLoading ||
          isRefetching ||
          isPending ||
          columnsLoadingEnterprise
        }
        tpFilterList={["cdStatusSeguro", "nmProduto", "dsProduto"]}
        onTpFilterSearch={setSearch}
        tpFilterSelected={filters.tpFilter}
        filterValue={filters.filterValue}
        setTpFilterSelected={(tpFilter: string) =>
          setFilters({ ...filters, tpFilter })
        }
        setFilterValue={(filterValue: string) =>
          setFilters({ ...filters, filterValue })
        }
      />

  )}
else{
  return (
    <div className="w-full h-full">
      <DataTable
        columns={columns}
        data={(data as ProductTableResponse)?.items ?? []}
        pageCount={Math.ceil((data?.totalCount ?? 0) / pageSize)}
        pageIndex={pageIndex}
        onPageChange={setPageIndex}
        error={isError}
        loading={isLoading || isRefetching || isPending || columnsLoading}
        tpFilterList={["cdStatusSeguro", "nmProduto", "dsProduto"]}
        onTpFilterSearch={(filters: {tpFilter: string, filterValue: string}) => {
          console.log("valor boladao")
          console.log(filters)
          setSearch(filters)
        }}
        tpFilterSelected={filters.tpFilter}
        filterValue={filters.filterValue}
        setTpFilterSelected={(tpFilter: string) => {
          setFilters({...filters, tpFilter})
        }}
        setFilterValue={(filterValue: string) => {
          setFilters({...filters, filterValue})
        }}
      />
    </div>
  );}}


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