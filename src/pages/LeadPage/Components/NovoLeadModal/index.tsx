import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SbsConfigProvider } from "@/lib/sbs-form-components/src/context/SbsConfigContext";
import { SidebarProvider } from "@/lib/sbs-form-components/src/context/SidebarContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useOperationStore } from "@/store/operationStore";
import { execApi } from "@/hooks/useApi";
import { FieldType } from "@/lib/sbs-form-components/src/core/types";
import { dev_log } from "@/lib/utils";
import { StepFormConfig } from "@/lib/sbs-form-components/src/core/useStepFormCore";
import { toast } from "sonner";
import LayoutRenderForm from "./LayoutRenderForm";

interface LayoutOperationResponse {
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

function NovoLeadModal() {
  const [open, setOpen] = useState(false);
  const [tipo, setTipo] = useState<"pessoa" | "empresa" | null>(null);
  const [isFinishForm, setIsFinishForm] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const idOperation = useOperationStore((state)=> state.idOperation)
  const [layoutObj, setLayoutObj] = useState<Partial<FieldType>[]>([])
  const [formConfigState, setFormConfigState] = useState<StepFormConfig | null>(null)

  const queryClient = useQueryClient();

  const handleSelecionarTipo = (tipoSelecionado: "pessoa" | "empresa") => {
    setTipo(tipoSelecionado);
    setMenuOpen(false);
    setOpen(true);
    mutate()
  };

  const {mutate, isPending, isError, error} = useMutation({
    mutationFn: async () =>{

      if(!idOperation){
        return 
      }

      const res = await execApi({
        method: "GET",
        url: `api/crm/company/find/layouts/${idOperation}`,
        data: {},
        needLogout: true,
        isCrmApi: true
      })

      if(!res || !res.data){
        throw new Error("Erro ao buscar layout de cadastro de empresas")
      }

      return res.data as LayoutOperationResponse[]

    },
    onSuccess: (data)=>{
      if(!data){
        dev_log(()=>console.log(data))
        return
      }

      let selectedEntityTp = tipo == "empresa" ? 20921 : 20922

      const selectedData = data.find((item) => item.tpLayout == selectedEntityTp)
      const ly = selectedData?.dsLayoutTexto ? JSON.parse(selectedData.dsLayoutTexto) as Partial<FieldType>[] : [] as Partial<FieldType>[]

      dev_log(()=> console.log(ly))
      setLayoutObj(ly)
    },
    onError: (error)=>{
      setLayoutObj([])
      console.log(error)
    }
  })

  const handleClose = () => {
    setTipo(null);
    setOpen(false);
    setLayoutObj([])
    setFormConfigState(null)
    setIsFinishForm(false)

    queryClient.invalidateQueries({
      queryKey: ["fetchCompaniesDataPagination"],
    });
  };

  useEffect(()=>{
    if(layoutObj.length == 0 || !idOperation){
      return
    }

    if(tipo == "empresa"){
      setFormConfigState(getEnterpriseFormConfig({
        layout: layoutObj,
        idOperation,
        closeDialog: handleClose,
        updateFinishLoader: (item) => setIsFinishForm(item)
      }))
    }else {
      setFormConfigState(getPersonFormConfig({
        layout: layoutObj,
        idOperation,
        closeDialog: handleClose,
        updateFinishLoader: (item) => setIsFinishForm(item)
      }))
    }
  }, [layoutObj])

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleClose();
        }
        setOpen(isOpen);
      }}
    >
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <DialogTrigger asChild>
            <Button ref={buttonRef}>Novo Lead</Button>
          </DialogTrigger>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40">
          <DropdownMenuItem onClick={() => handleSelecionarTipo("pessoa")}>
            Pessoa
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSelecionarTipo("empresa")}>
            Empresa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent
        className="!w-[90vw] max-w-none h-fit max-h-[90vh] flex flex-col"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="h-fit">
          <DialogTitle>
            Cadastrar {tipo === "pessoa" ? "Pessoa" : "Empresa"}
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>
        {
          isPending && (
            <div className="space-y-3">
              <div className="flex gap-3">
                {
                  [1,2,3].map((i)=>(
                    <div key={i} className="bg-muted animate-pulse w-full h-20 rounded-md"></div>
                  ))
                }
              </div>
              <div className="grid grid-cols-2 gap-3">
                {
                  [1,2,3,4,5].map((i)=>(
                    <div key={i} className="bg-muted animate-pulse w-full h-10 rounded-md"></div>
                  ))
                }
              </div>
            </div>
          )
        }

        {
          !isPending && isError && error && (
            <div>
              algum erro aconteceu: {error.message}
            </div>
          )
        }
        {
          !isPending && !isError && formConfigState && (
            <ScrollArea className="pr-3 pb-2 overflow-y-scroll personal_scrollbar">
                <SbsConfigProvider>
                  <SidebarProvider orientation="horizontal">
                      <LayoutRenderForm action={handleClose} formsConfig={formConfigState} isLoadingFinishForm={isFinishForm} />
                  </SidebarProvider>
                </SbsConfigProvider>
            </ScrollArea>
          )
        }

        {
          !isPending && !isError && !formConfigState && (
            <p>Nenhum dado encontrado</p>
          )
        }
      </DialogContent>
    </Dialog>
  );
}

export default NovoLeadModal;

type getEntityFormConfigType = {
  layout: Partial<FieldType>[];
  idOperation: string;
  closeDialog?: () => void;
  updateFinishLoader: (item: boolean)=> void
}

function getEnterpriseFormConfig({layout, idOperation, closeDialog, updateFinishLoader}: Readonly<getEntityFormConfigType>): StepFormConfig {
  return {
    layoutObj: layout,
    onSubmitStep: async (currentSessionData) => {
      dev_log(()=> console.log(currentSessionData))

      const fields = currentSessionData.campos

      let hasSomeNotFilled = fields?.some((item) => item.obrigatorio && !item.conteudo)
      if(hasSomeNotFilled){
        return {
          canContinueForm: false,
          errors: ["Existem campos obrigatórios que não foram preenchidos"]
        }
      }

      
      let fieldContentError: string[] = []
      fields?.forEach((field)=>{
        if(field.campoApi == "nrCnpj" && field.obrigatorio && field.conteudo?.length !== 14){
          const errorMessage = `O campo ${field.nome} precisa ser preenchido corretamente`
          fieldContentError.push(errorMessage)
          return
        }

        if(field.campoApi == "nrCpf" && field.obrigatorio && field.conteudo?.length !== 11){
          const errorMessage = `O campo ${field.nome} precisa ser preenchido corretamente`
          fieldContentError.push(errorMessage)
          return
        }

        if(field.campoApi == "telefone" && field.obrigatorio && field.conteudo?.length !== 9){
          const errorMessage = `O campo ${field.nome} precisa ser preenchido corretamente`
          fieldContentError.push(errorMessage)
          return
        }

        if(field.campoApi == "nrCep" && field.obrigatorio && field.conteudo?.length !== 8){
          const errorMessage = `O campo ${field.nome} precisa ser preenchido corretamente`
          fieldContentError.push(errorMessage)
          return
        }

      })

      if(fieldContentError.length > 0){
        return {
          canContinueForm: false,
          errors: fieldContentError
        }
      }

      return {
        canContinueForm: true,
      }
    },
    onFinish: async (sessionsData) => {
      try {
        updateFinishLoader(true)
        let allFieldsOffSession: Partial<FieldType>[] = []
        
        sessionsData.forEach(item => {
          if(item.campos && item.campos.length > 0){
            allFieldsOffSession.push(...item.campos)
          }
        })

        dev_log(()=>console.log(allFieldsOffSession))

        allFieldsOffSession = allFieldsOffSession.filter(item => item.type !== "titulo_subtitulo")

        const resultado = allFieldsOffSession.reduce((acc, item) => {

          if (item.campo === "externo") {
            return acc;
          }
          if (!item.campoApi ) return acc;

          if(item.campoApi == "dsEmail"){
            acc.email = [{dsEmail: item.conteudo}]
          }else if(item.campoApi == "nrDdd" || item.campoApi == "telefone"){
            acc.contato = acc.contato ? [{
              ...acc.contato[0],
              [item.campoApi]: item.conteudo
            }] : [{
              [item.campoApi]: item.conteudo,
              tpTelefone: "2"
            }]
          }else if(item.campoApi == "dtNascimento"){
            acc.dtNascimento = formatData(item.conteudo ?? "")
          }else if(item.campoApi == "tabelaColaboradores"){
            try {
              acc[item.campoApi] = item.conteudo ? JSON.parse(item.conteudo) : ""
            } catch {
              console.error(`Não foi possível converter para objeto json o conteúdo da tabela ${item.campoApi}: ${JSON.stringify(item.conteudo)}`)
              acc[item.campoApi] = item.conteudo
            }
          }else{
            acc[item.campoApi] = item.conteudo;
          }

          return acc;
        }, {} as Record<string, any>);

        const resultadoExterno = allFieldsOffSession.reduce((acc, item) => {

            if (!item.campo || item.campo !== "externo") {
            return acc;
          }
          if (!item.campoApi ) return acc;

          if(item.campoApi == "dsEmail"){
            acc.email = [{dsEmail: item.conteudo}]
          }else if(item.campoApi == "nrDdd" || item.campoApi == "telefone"){
            acc.contato = acc.contato ? [{
              ...acc.contato[0],
              [item.campoApi]: item.conteudo
            }] : [{
              [item.campoApi]: item.conteudo,
              tpTelefone: "2"
            }]
          }else if(item.campoApi == "dtNascimento"){
            acc.dtNascimento = formatData(item.conteudo ?? "")
          }else if(item.campoApi == "tabelaColaboradores"){
            try {
              acc[item.campoApi] = item.conteudo ? JSON.parse(item.conteudo) : ""
            } catch {
              console.error(`Não foi possível converter para objeto json o conteúdo da tabela ${item.campoApi}: ${JSON.stringify(item.conteudo)}`)
              acc[item.campoApi] = item.conteudo
            }
          }else{
            acc[item.campoApi] = item.conteudo;
          }

          return acc;
        }, {} as Record<string, any>);

        dev_log(() => console.log(resultado))

        const finalData: any = {
          empresaOperacao: resultado,
          idOperacao: idOperation,
          ...resultadoExterno
        }

        dev_log(() => console.log(finalData))

      
        const res: any = await execApi({
          url: "api/crm/company/register/operation",
          method: "POST",
          data: finalData,
          needLogout: true,
          isCrmApi: true
        })
  
        if(res && "sucesso" in res.data){
          dev_log(()=>console.log(res))
          toast.error("Algum problema aconteceu ao tentar cadastrar empresa")
          return
        }
  
        toast.success("Empresa registrada com sucesso!")
        
        updateFinishLoader(false)
        closeDialog?.()
      } catch (error: any) {
        dev_log(()=>console.log(error))
        let message = ""

        try {
          const errors = error.response && error.response.data.errors

          if(!errors){
            return
          }

          message = "Ocorreu algum problema no registro da empresa:"

          // Obj com keys variadas, cada key sendo um array de string com mensagens de erro
          Object.keys(errors).map(key =>{
            message += `\n${errors[key][0]}`
          })
        } catch {
          message = "Ocorreu algum problema no registro da empresa. \n\n" + error.message
        }
        toast.error(message)
        updateFinishLoader(false)
      }

    },
    onBlankLayout: (fields) => {
      dev_log(()=>console.log(fields))
    },
    addLoggerFn: false,
    onInit: (sessions) => {
      dev_log(()=>console.log("sessões", sessions))
      
    },
    onErrorSubmitStep: (error)=>{
      const errorMsg = error.errors?.join(".\n")
      toast.error(errorMsg)
    }
  }
}

function getPersonFormConfig({layout, idOperation, closeDialog, updateFinishLoader}: Readonly<getEntityFormConfigType>): StepFormConfig {
  return {
    layoutObj: layout,
    onSubmitStep: async (currentSessionData) => {
      dev_log(()=> console.log(currentSessionData))

      const fields = currentSessionData.campos

      let hasSomeNotFilled = fields?.some((item) => item.obrigatorio && !item.conteudo)
      if(hasSomeNotFilled){
        return {
          canContinueForm: false,
          errors: ["Existem campos obrigatórios que não foram preenchidos"]
        }
      }

      return {
        canContinueForm: true,
      }
    },
    onFinish: async (sessionsData) => {
      updateFinishLoader(true)
      let allFieldsOffSession: Partial<FieldType>[] = []
      
      sessionsData.forEach(item => {
        if(item.campos && item.campos.length > 0){
          allFieldsOffSession.push(...item.campos)
        }
      })

      dev_log(()=>console.log(allFieldsOffSession))

      allFieldsOffSession = allFieldsOffSession.filter(item => item.type !== "titulo_subtitulo")

      const resultado = allFieldsOffSession.reduce((acc, item) => {
        if (!item.campoApi ) return acc;

        if(item.campoApi == "dsEmail"){
          acc.email = [{dsEmail: item.conteudo}]
        }else if(item.campoApi == "ddd" || item.campoApi == "telefone"){
          acc.contato = acc.contato ? [{
            ...acc.contato[0],
            [item.campoApi]: item.conteudo
          }] : [{
            [item.campoApi]: item.conteudo,
            tpTelefone: "2"
          }]
        }else{
          acc[item.campoApi] = item.conteudo;
        }

        return acc;
      }, {} as Record<string, any>);

      dev_log(() => console.log(resultado))

      const finalData: any = {
        ...resultado,
        idOperacao: idOperation,
        adicional: {}
      }

      dev_log(()=>console.log(finalData))

      try {
        const res:any = await execApi<any>({
          url: "api/crm/lead/register",
          data: finalData,
          method: "POST",
          isCrmApi: true,
        });

        dev_log(() => console.log(res))

        if(!res || !res.data){
          toast.error("Algum problema aconteceu ao tentar cadastrar lead")
          return
        }
    
        closeDialog?.()
      } catch (error: any) {
        dev_log(()=>console.log(error))
        let message = ""

        try {
          const errors = error.response && error.response.data.errors

          if(!errors){
            return
          }

          message = "Ocorreu algum problema no registro do lead:"

          // Obj com keys variadas, cada key sendo um array de string com mensagens de erro
          Object.keys(errors).map(key =>{
            message += `\n${errors[key][0]}`
          })
        } catch {
          message = "Ocorreu algum problema no registro do lead. \n\n" + error.message
        }
        toast.error(message)
      } finally {
        updateFinishLoader(false)
      }
    },
    onBlankLayout: (fields) => {
      dev_log(()=>console.log(fields))
    },
    addLoggerFn: false,
    onInit: (sessions) => {
      dev_log(()=>console.log("sessões", sessions))
    },
    onErrorSubmitStep: (error)=>{
      const errorMsg = error.errors?.join(".\n")
      toast.error(errorMsg)
    }
  }
}

function formatData(data: string) {
  if(!data) return data
  if(data?.includes("/") || data?.includes("-")) {
    data = data.replace(/\//g, "").replace(/-/g, "")
  }

  const dia = data?.slice(0, 2)
  const mes = data?.slice(2, 4)
  const ano = data?.slice(4, 8)
  return `${ano}-${mes}-${dia}`
}