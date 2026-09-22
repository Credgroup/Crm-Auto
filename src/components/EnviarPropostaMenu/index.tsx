import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Package2, X } from "lucide-react";
import EtapaSeguro from "./EtapaSeguro";
import { ReactNode, useEffect, useState } from "react";
import EtapaContato from "./EtapaContato";
import EtapaTemplate from "./EtapaTemplate";
import EtapaSucesso from "./EtapaSucesso";
import { Product, CadProposalGroup, Enterprise } from "@/types";
import EtapaInfoProposta from "./EtapaInfoProposta";
import EtapaSimulacaoVendedor from "./EtapaSimulacaoVendedor";
import { execApi } from "@/hooks/useApi";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ScrollArea } from "../ui/scroll-area";
import { usePartnerStore } from "@/store/partnerStore";

interface Props {
  ButtonType?: "text" | "icon";
  cliData?: Partial<Enterprise>;
  ButtonTrigger?: ReactNode;
  selectedProduct?: Partial<Product> | null;
  onClose?: () => void;
}

export function EnviarPropostaMenu({
  ButtonType = "text",
  cliData,
  ButtonTrigger,
  selectedProduct,
  onClose
}: Readonly<Props>) {
  const [etapa, setEtapa] = useState(0);
  const [proposta, setProposta] = useState<Partial<CadProposalGroup>>({});
  const [open, setOpen] = useState(false);
  const [idShortProposta, setIdShortProposta] = useState("");

  const idPartner = usePartnerStore((state) => state.partnerId);
  const title = idPartner === "39" ? "questionário de risco" : "proposta";

  const { mutate, isPending } = useMutation({
    mutationKey: ["cadLeadProposal"],
    mutationFn: async (data: Partial<CadProposalGroup>) => {
      // Usar data de hoje como mock para vigencia final já que removemos do fluxo
      const cadProposalParams = {
        ...data,
        dtVigenciaFinal: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
        dsObservacao: "Simulação via Vendedor"
      };

      const cadProposalResponse: any = await execApi({
        url: "api/crm/proposal/register/group",
        method: "POST",
        data: cadProposalParams,
        isCrmApi: true,
      });

      if (!cadProposalResponse) {
        throw new Error("Erro ao cadastrar proposta");
      }
      return cadProposalResponse.data;
    },
    onError: (error) => {
      console.error("Error:", error);
      toast.error("Erro ao cadastrar proposta, tente novamente mais tarde");
    },
    onSuccess: (data) => {
      console.log("Success:", data);
      setIdShortProposta(data.idGrupoProposta);
      setEtapa(3); // Avança para o Shortlink
    },
  });

  const handleAddDocsToProposal = async (products: Partial<Product>[]) => {
    const proposals = products.map((item) => {
      return {
        idProduto: item.idProduto,
        nmProposta: `${item.nmProduto} - ${cliData?.nmRazaoSocial || 'Lead'}`,
      };
    });
    setProposta({ ...proposta, propostas: proposals });
    setEtapa(1);
  };

  const handleAddInfoToProposal = (data: Partial<CadProposalGroup>) => {
    setProposta({ ...proposta, ...data });
    setEtapa(2); // Avança para a EtapaSimulacaoVendedor
  };

  const handleFinishSimulation = () => {
    // Ao finalizar a simulação, cria o grupo de proposta na API
    mutate(proposta);
  };

  useEffect(() => {
    if (selectedProduct) {
      handleAddDocsToProposal([selectedProduct]);
    }
  }, [open, selectedProduct]);

  return (
    <Sheet
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if(!open) {
          onClose?.();
        } else {
          setEtapa(0);
          setProposta({});
        }
      }}
    >
      <SheetTrigger asChild>
        {ButtonTrigger ??
          (ButtonType === "icon" ? (
            <Button>
              <Package2 />
            </Button>
          ) : (
            <Button>Criar {title}</Button>
          ))}
      </SheetTrigger>
      <SheetContent className="w-[50%] min-w-[600px] h-screen p-0 sm:max-w-none" hasCloseButton={false}>
        <SheetClose asChild>
          <Button variant="ghost" className="absolute top-4 right-4 z-10 aspect-square" size="icon">
            <X />
          </Button>
        </SheetClose>
        <ScrollArea className="w-full h-screen p-6">
          <div className="h-max w-full flex flex-col justify-center items-center">
            {etapa === 0 && (
              <EtapaSeguro onSuccess={(products) => handleAddDocsToProposal(products)} />
            )}
            {etapa === 1 && (
              <EtapaInfoProposta
                onSuccess={(value) => handleAddInfoToProposal(value)}
                navigateTabs={(value) => setEtapa(value)}
                loading={isPending}
                id={String(cliData?.idEmpresaOperacao)}
              />
            )}
            {etapa === 2 && (
              <EtapaSimulacaoVendedor
                idProduto={String(proposta.propostas?.[0]?.idProduto || selectedProduct?.idProduto || "")}
                onSuccess={handleFinishSimulation}
                navigateTabs={(value) => setEtapa(value)}
              />
            )}
            {etapa === 3 && (
              <EtapaContato onSuccess={(value) => setEtapa(value)} idEmpresaOperacao={String(idShortProposta)} />
            )}
            {etapa === 4 && <EtapaTemplate onSuccess={(value) => setEtapa(value)} />}
            {etapa === 5 && <EtapaSucesso />}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
