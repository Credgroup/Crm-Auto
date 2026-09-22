import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import CanBindPersonTable from "../CanBindPersonTable";
import { useEffect, useState } from "react";
import { Person } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { handleBindExistentPerson } from "@/hooks/useCadPerson";
import { toast } from "sonner";
import SuccessCheckBlue from "@/components/SuccessCheckBlue";
import { LuLoaderCircle } from "react-icons/lu";
import LayoutRenderForm from "@/pages/LeadPage/Components/NovoLeadModal/LayoutRenderForm";
import { execApi } from "@/hooks/useApi";
import { useOperationStore } from "@/store/operationStore";
import { FieldType } from "@/lib/sbs-form-components/src/core/types";
import { StepFormConfig } from "@/lib/sbs-form-components/src/core/useStepFormCore";
import { SidebarProvider } from "@/lib/sbs-form-components/src/context/SidebarContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SbsConfigProvider } from "@/lib/sbs-form-components/src/context/SbsConfigContext";
import { dev_log } from "@/lib/utils";


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


type getEntityFormConfigType = {
  layout: Partial<FieldType>[];
  closeDialog?: () => void;
  updateFinishLoader: (item: boolean)=> void
}


export default function BindLeadEnterpriseDialog({
  idEmpresaOperacao,
  closeAction,
}: Readonly<{ idEmpresaOperacao?: string | null; closeAction: () => void }>) {
  const [open, setOpen] = useState(false);
  const [layoutObj, setLayoutObj] = useState<Partial<FieldType>[]>([])
  const [person, setPerson] = useState<Partial<Person>>({});
  const [formController, setFormController] = useState<any>({
    step: 0,
    totalStep: 4,
    description: "Dados internos",
  });
  
  const idOperacao = useOperationStore((state) => state.idOperation);
  const [formConfigState, setFormConfigState] = useState<StepFormConfig | null>(null)
  const [isLoadingFinishForm, setIsLoadingFinishForm] = useState(false)

  useEffect(() => {
    if (person.idSeguradoI2k && idEmpresaOperacao) {
      mutate({
        idEmpresaOperacao,
        idSeguradoI2k: parseInt(person.idSeguradoI2k),
      });
    }
  }, [person]);

  useEffect(() => {
    if(!open) return
    async function fetchLayout(){
      try {
        await buscarLayout();
      } catch (error: any) {
        toast.error(error.message)
      }
    }
    fetchLayout()
  }, [open]);

  useEffect(() => {
    if (layoutObj.length === 0) return

    setFormConfigState(
      getPersonFormConfig({
        layout: layoutObj,
        closeDialog: handleCloseDialog,
        updateFinishLoader: (loading) => setIsLoadingFinishForm(loading)
      })
    )
  }, [layoutObj])

  const { mutate, isPending } = useMutation({
    mutationFn: handleBindExistentPerson,
    onSuccess: (data) => {
      console.log("Success:", data);
      toast.success("Vinculo realizado com sucesso!");
      setFormController((prev: any) => ({
        ...prev,
        step: 2,
        totalStep: 2,
        description: "Finalizar",
      }));
    },
    onError: (error) => {
      console.error("Error:", error);
      toast.error("Erro ao vincular a pessoa!");
    },
  });

  function handleCloseDialog() {
    setFormController((prev: any) => ({
      ...prev,
      step: 0,
      totalStep: 2,
      description: "Dados internos",
    }));
    setPerson({});
    closeAction();
    setOpen(false);
  }

  function handleBackStart(){
    setFormController((prev: any) => ({
      ...prev,
      step: 0,
      totalStep: 2,
      description: "Dados internos",
    }));
  }

  async function buscarLayout(){
    const res = await execApi({
      method: "GET",
      url: `api/crm/company/find/layouts/${idOperacao}`,
      data: {},
      needLogout: true,
      isCrmApi: true,
    });

    if(!res || !res.data){
      throw new Error("Erro ao buscar layout de cadastro de representante")
    }

    const data = res.data as LayoutOperationResponse[]
    const layoutCorreto = data.find(
      (item: any) => item.tpLayout === 20943
    );

    if(!layoutCorreto){
      throw new Error("Nenhum layout encontrado para cadastro de representante")
    }

    const layoutParsed: Partial<FieldType>[] = layoutCorreto.dsLayoutTexto
      ? JSON.parse(layoutCorreto.dsLayoutTexto)
      : [];

    dev_log(()=>console.log("layoutParsed", layoutParsed))
    setLayoutObj(layoutParsed)
  }

  function getPersonFormConfig({layout, closeDialog, updateFinishLoader}: Readonly<getEntityFormConfigType>): StepFormConfig {
    return {
      layoutObj: layout,
      onSubmitStep: async (currentSessionData) => {
  
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
  
        allFieldsOffSession = allFieldsOffSession.filter(item => item.type !== "titulo_subtitulo")
  
        const resultado = allFieldsOffSession.reduce((acc, item) => {
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
          }else{
            acc[item.campoApi] = item.conteudo;
          }
  
          return acc;
        }, {} as Record<string, any>);
  
        const finalData: any = {
          pessoaOperacao: resultado,
          idOperacao: 0,
        }
        console.log("deu certo", finalData)

        try {
          await PostRepresentante(finalData?.pessoaOperacao)
          toast.success("Representante vinculado com sucesso!")
          closeDialog?.()
        } catch (error: any) {
          console.log(error)
          try{
            const msg = error.response?.data?.message
            if(msg){
              toast.error(`Houve algum problema ao finalizar o cadastro: \n${msg}`)
            }else{
              toast.error(`Houve algum problema ao finalizar o cadastro: \n${error.message}`)
            }
          } catch {
            toast.error(`Houve algum problema ao finalizar o cadastro: \n${error.message}`)
          }
        } finally {
          updateFinishLoader(false)
        }
      },
      onBlankLayout: (fields) => {
        console.log(fields)
      },
      addLoggerFn: false,
      onInit: (sessions) => {
        console.log("sessões", sessions)
      },
      onErrorSubmitStep: (error)=>{
        const errorMsg = error.errors?.join(".\n")
        toast.error(errorMsg)
      }
    }
  }

  function formatData(data: string) {
  if (!data) return data;

  if (data.includes("/") || data.includes("-")) {
    data = data.replace(/\//g, "").replace(/-/g, "");
  }

  return data;
}

  async function PostRepresentante(data: unknown) {
    const formatDate = (value: any) => {
      if (!value) return value;

      const str = String(value);

      // caso venha como 20260302
      if (/^\d{8}$/.test(str)) {
        return `${str.slice(0, 4)}-${str.slice(4, 6)}-${str.slice(6, 8)}`;
      }

      return value;
    };

    const parsedData = Array.isArray(data)
      ? data.map((item) => {
          const obj = item as Record<string, any>;

          return {
            ...obj,
            dtNascimento: formatDate(obj?.dtNascimento),
            IdOperacao: idOperacao,
            IdEmpresaOperacao: idEmpresaOperacao,
          };
        })
      : (() => {
          const obj = data as Record<string, any>;

          return {
            ...obj,
            dtNascimento: formatDate(obj?.dtNascimento),
            IdOperacao: idOperacao,
            IdEmpresaOperacao: idEmpresaOperacao,
          };
        })();

      const res: any = await execApi({
        method: "POST",
        url: `api/crm/company/register/representative/operation`,
        data: parsedData,
        needLogout: true,
        isCrmApi: true,
      });

      return res
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) {
          handleCloseDialog();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2" />
          Vincular Representante
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[80vh] flex flex-col">
        <ScrollArea className="pr-3 pb-2 overflow-y-scroll personal_scrollbar">
          <SbsConfigProvider>
              <SidebarProvider orientation="horizontal">
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold">
                    Vincular representante
                  </DialogTitle>
                  {formController.step === 0 && (
                    <Button
                      size="sm"
                      onClick={() => {
                        setOpen(true);
                        setFormController((prev: any) => ({
                          ...prev,
                          step: 1,
                        }));
                      }}
                      disabled={layoutObj.length === 0}
                    >
                      <Plus className="mr-2"/>
                      Cadastrar representante
                    </Button>
                  )}
                  <DialogDescription className="opacity-0"></DialogDescription>
                </DialogHeader>

                {formController.step == 0 && (
                  <CanBindPersonTable setSelectPerson={(data) => setPerson(data)} />
                )}

                {formController.step === 1 && formConfigState && (
                    <SidebarProvider>
                    <LayoutRenderForm
                      formsConfig={formConfigState}
                      action={handleBackStart}
                      isLoadingFinishForm={isLoadingFinishForm}
                    />
                  </SidebarProvider>
                )} 
                       
                {formController.step == 2 && (
                  <div className="flex justify-center items-center flex-col gap-3 text-center my-6">
                    <SuccessCheckBlue />
                    <div className="mb-4 space-y-2 w-full max-w-[400px]">
                      <h1 className="text-2xl font-semibold">
                        {person?.nome} vinculado(a) com sucesso!
                      </h1>
                    </div>
                    <div className="flex flex-col-reverse justify-center md:flex-row gap-2">
                      <DialogClose asChild>
                        <Button variant="ghost">Fechar</Button>
                      </DialogClose>
                    </div>
                  </div>
                )}

                {isPending && <LuLoaderCircle className="animate-spin" />}
             </SidebarProvider>
          </SbsConfigProvider>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
