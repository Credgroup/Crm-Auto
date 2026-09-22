import { TableField } from "@/lib/sbs-form-components/src/components/TableField/index.tsx";
import { useState, useEffect } from "react";
import { execApi } from "@/hooks/useApi";
import { columnsColaboradores } from "./colaboradorColumns";
import type { Colaborador } from "./colaboradorColumns";
import { DataTable } from "@/components/DataTable/DataTable";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { LucideLoader2 } from "lucide-react";
import { useOperationStore } from "@/store/operationStore";


type PagedResponse<T> = {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
};


type CadastroDeColaboradorPropos = {
  idEmpresaOperacao: string
}


type LayoutOperationResponse = {
  idLayout: number;
  idChave: number;
  nmTabela: string;
  nmLayout: string;
  cdLayout: number;
  tpLayout: number;
  dsLayout: string;
  dsLayoutTexto: string;
  cdStatus: number;
  dsStatus: string;
  dtCadastro: string;
  dtAlteracao: string;
  idParceiroOwner: number;
  tpExtensao: number;
  dsExtensao: string;
}

export default function CadastroDeColaborador({
  idEmpresaOperacao,
}: CadastroDeColaboradorPropos) {
  const [colunas, setColunas] = useState<any[]>([]);
  const [valorTabela, setValorTabela] = useState("");
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize] = useState(5);
  const [StateAderirProduto, setStateAderirProduto] = useState()
  const [StateIdProduto, setStateIdProduto] = useState()
  const [totalCount, setTotalCount] = useState(0);
  const [isloading, setIsLoading] = useState(true)
  const [isBlocked, setIsBlocked] = useState(false)
  const [blockMessage, setBlockMessage] = useState("")
  const [filters, setFilters] = useState({
    tpFilter: "",
    filterValue: "",
  });

  const idOperacao = useOperationStore(state => state.idOperation)

  useEffect(() => {

    if (idEmpresaOperacao) {
      buscarColaboradores();
    }

    if (idOperacao) {
      buscarLayouts();
    }


  }, [idOperacao, idEmpresaOperacao, pageNumber, pageSize]);

  async function buscarColaboradores() {
    try {
      const apiPageNumber = pageNumber + 1

      if (isloading != true) {
        setIsLoading(true)
      }

      let urlpath = `api/crm/insurance/find/segurado/${idEmpresaOperacao}?pageNumber=${apiPageNumber}&pageSize=${pageSize}`

      if (filters?.tpFilter && filters?.filterValue) {
        urlpath += `&tpFilter=${filters.tpFilter}&filterValue=${encodeURIComponent(filters.filterValue)}`
      }
      const res = await execApi<PagedResponse<Colaborador>>({
        method: "GET",
        url: urlpath,
        data: {},
        isCrmApi: true,
      });
      setColaboradores(res.data.items as Colaborador[]);
      setTotalCount(res.data.totalCount);
      setIsLoading(false)
    } catch (error) {
      console.error("Erro ao buscar colaboradores:", error);
      setIsLoading(false)
    }
  }

  async function postApiColaboradores(valor: any) {
    console.log("valorTabela")
    console.log(valorTabela)
    const res = await execApi({
      method: "POST",
      url: `api/crm/company/register/policyholders/operation`,
      data: valor,
      needLogout: true,
      isCrmApi: true,
    });
    console.log(res)
  }

  async function buscarLayouts() {
    try {
      const res = await execApi({
        method: "GET",
        url: `api/crm/company/find/layouts/${idOperacao}`,
        data: {},
        needLogout: true,
        isCrmApi: true,
      });

      const date = res.data as LayoutOperationResponse[]
      const layoutCorreto = date.find(
        (item: any) => item.tpLayout === 20961
      );

      let lista: any[] = [];

      if (layoutCorreto?.dsLayoutTexto) {
        try {
          const parsed = JSON.parse(layoutCorreto.dsLayoutTexto);
          if (Array.isArray(parsed)) {
            lista = parsed;
          }
        } catch (error) {
          console.error("Erro ao converter dsLayoutTexto");
        }
      }

      const AderirProduto = lista.find(
        (item: any) => item.campoApi === "AderirProduto"
      )

      const IdProduto = lista.find(
        (item: any) => item.campoApi === "IdProduto"
      )

      const RegistertableDate = lista.find(
        (item: any) => item.type === "tabela"
      );
      setColunas(RegistertableDate?.colunas)
      setStateAderirProduto(AderirProduto?.conteudo)
      setStateIdProduto(IdProduto?.conteudo)

    } catch (error) {
      console.error("Erro ao buscar layouts:", error);
    }
  }

  async function handleSalvarTabela() {
    const VariavelAuxiliar = typeof valorTabela === "string"
      ? JSON.parse(valorTabela)
      : valorTabela

    const estadoCivilMap: Record<string, string> = {
      solteiro: "1",
      casado: "2",
      divorciado: "5",
      viuvo: "3",
      semregistro: "6",
      separado: "4"
    }

    const tabelaCorrigida = VariavelAuxiliar.map((col: any) => {
      if (col.nmColunaTemplate === "tpEstadoCivil" && Array.isArray(col.rows)) {
        return {
          ...col,
          rows: col.rows.map((value: string) => {
            const normalizado = value
              ?.toLowerCase()
              ?.replace(/\s+/g, "")

            return estadoCivilMap[normalizado] ?? value
          })
        }
      }

      return col
    })

    const payload = {
      empresaOperacao: { tabelaColaboradores: tabelaCorrigida },
      aderirProduto: StateAderirProduto,
      idProduto: StateIdProduto,
      idOperacao: String(idOperacao),
      idEmpresaOperacao: idEmpresaOperacao
    }

    try {
      toast.success("Colaboradores adicionados com sucesso")
      await postApiColaboradores(payload);
      await buscarColaboradores();
    } catch (error) {
      toast.error("Falha na API, contate um administrador")
      console.error("Erro ao salvar e refazer colaboradores:", error);
    }
  };

  const { mutateAsync: buscarBloqueio, isPending: isPendingBloqueio } = useMutation({
    mutationFn: async () => {

      const res = await execApi({
        method: "GET",
        url: `api/crm/company/find/operation/locked/${idOperacao}`,
        data: {},
        needLogout: true,
        isCrmApi: true,
      });

      return res.data
    },
    onSuccess: (data: any) => {
      if (!data.success) {
        toast.error("Operação bloqueada")
        setBlockMessage(data.message)
        setIsBlocked(true)
        return
      }
      setBlockMessage("")
      setIsBlocked(false)

    },
    onError: (error: any) => {
      if (error.response.status === 423) {
        toast.error("Operação bloqueada")
        setIsBlocked(true)
        setBlockMessage(error.response.data.message)
        return
      }
      setBlockMessage("")
      setIsBlocked(false)
    }
  })

  return (
    <div>
      <div className="w-64">
        <Dialog onOpenChange={(open) => {
          if (open) {
            buscarBloqueio()
          }
        }}>
          <DialogTrigger>
            <Button variant="default">Adicionar Colaborador</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Colaborador</DialogTitle>
              <DialogDescription>
                Preencha os campos abaixo para adicionar um novo colaborador.
              </DialogDescription>
            </DialogHeader>
            {!isPendingBloqueio && !isBlocked && colunas?.length > 0 && (
              <TableField
                field={{
                  nome: "Tabela de Pessoas",
                  placeholder: "Tabela de Colaboradores",
                  colunas: colunas
                }}
                onValueChange={(value) => setValorTabela(value)}
                onSave={handleSalvarTabela}
              />
            )}
            {
              !isPendingBloqueio && !isBlocked && colunas?.length === 0 && (
                <p className="text-center text-muted-foreground">Nenhuma coluna encontrada</p>
              )
            }
            {
              !isPendingBloqueio && isBlocked && (
                <p className="text-center text-muted-foreground">{blockMessage}</p>
              )
            }
            {
              isPendingBloqueio && (
                <div className="flex items-center justify-center">
                  <LucideLoader2 className="animate-spin" />
                </div>
              )
            }
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2 mt-5">
        <p className="font-medium text-xl">Colaboradores cadastrados</p>
      </div>
      <div className="grid grid-cols-1 gap-4 p-4 bg-muted/70 rounded-md mt-5">
        <DataTable
          columns={columnsColaboradores}
          data={colaboradores}
          pageCount={Math.ceil(totalCount / pageSize)}
          pageIndex={pageNumber}
          onPageChange={setPageNumber}
          tpFilterList={["Nome", "ID Externo", "CPF"]}
          onTpFilterSearch={() => {
            setPageNumber(0)
            buscarColaboradores()
          }}
          tpFilterSelected={filters.tpFilter}
          filterValue={filters.filterValue}
          setTpFilterSelected={(tpFilter: string) =>
            setFilters({ ...filters, tpFilter })
          }
          setFilterValue={(filterValue: string) =>
            setFilters({ ...filters, filterValue })
          }
          loading={isloading}
        />
      </div>
    </div>

  );
}