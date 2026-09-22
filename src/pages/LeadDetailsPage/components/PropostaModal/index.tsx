import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ChartPie,
  DollarSign,
  FileText,
  FileTextIcon,
  Send,
  User,
} from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { LuClock, LuEye, LuLoaderCircle } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import ModalMenu from "./components/ModalMenu";
import { ScrollArea } from "@/components/ui/scroll-area";
import AgroupedProposals from "./AgroupedProposals";
import { Proposal } from "@/types";
import SingleProposal from "./SingleProposal";
import useFetchSingleProposal from "./useFetchSingleProposal";

type PropostaModalProps = {
  id?: any;
  type?: "single" | "multiple";
  proposalObj: Partial<Proposal>;
  children?: ReactNode;
  fetchSingleProposal?: boolean; 
};

export type menuItem = {
  id: number;
  name: string;
  icon: any;
  active?: boolean;
  action?: (id?: number) => void;
  tabComponent?: ReactNode;
  actionButtonTrigger?: boolean;
};

function PropostaModal({
  id,
  type,
  proposalObj,
  children: trigger,
  fetchSingleProposal,
}: Readonly<PropostaModalProps>) {
  const [tab, setTab] = useState<menuItem[]>([]);
  const [open, setOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<menuItem | null>(null);
  const [menuType, setMenuType] = useState<"single" | "multiple">("single");

  const { data: proposal, isLoading, isError, isSuccess, error } = useFetchSingleProposal({
    fetchSingleProposal: !!fetchSingleProposal,
    id,
    modalOpen: open
  })

  const tabsSingleProposal: menuItem[] = [
    { id: 1, name: "Status gerais", icon: ChartPie, active: true },
    { id: 2, name: "Respostas", icon: Send, active: false },
    { id: 3, name: "Cotação", icon: DollarSign, active: false },
    { id: 4, name: "Documentos", icon: FileText, active: false },
    { id: 5, name: "Historico", icon: LuClock, active: false },
  ];

  const tabsMultipleProposal: menuItem[] = [
    { id: 1, name: "Propostas", icon: FileTextIcon, active: true },
    { id: 2, name: "Detalhes", icon: ChartPie, active: false },
    { id: 3, name: "Rastreio", icon: Send, active: false },
    { id: 4, name: "Participantes", icon: User, active: false },
  ];

  const handleSelectTab = (id: number) => {
    const newTabs = tab.map((item) => {
      if (item.id === id) {
        return { ...item, active: true };
      }
      return { ...item, active: false };
    });
    setTab(newTabs);
  };

  const resetSelectedTab = () => {
    if(type == "single"){
      setMenuType("single");
      setTab(tabsSingleProposal);
      setCurrentTab(tabsSingleProposal[0]);
    } else {
      setMenuType("multiple");
      setTab(tabsMultipleProposal);
      setCurrentTab(tabsMultipleProposal[0]);
    }
  }

  useEffect(() => {
    resetSelectedTab()
  }, [id, type]);

  useEffect(() => {
    setCurrentTab(tab.find((item) => item.active) ?? null);
  }, [tab]);

  return (
    <Dialog open={open} onOpenChange={(open) => {
      setOpen(open);
      if (!open) {
        resetSelectedTab();
      }
    }}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="secondary" className="aspect-square" size="icon">
            <LuEye className="text-lg" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="!min-w-[600px] !w-full max-w-[80vw] h-[70vh] p-0 box-border overflow-hidden">
        <DialogTitle className="hidden"></DialogTitle>
        <DialogDescription className="hidden"></DialogDescription>
        <div className="flex space-x-2 w-full h-full">
          <ModalMenu
            selectCurrentTabId={(id) => handleSelectTab(id)}
            menuItems={tab}
          />
          {
            fetchSingleProposal ? (
              <>
                {
                  isLoading && (
                    <div className="flex justify-center items-center h-full w-full">
                      <LuLoaderCircle className="animate-spin h-6 w-6" />
                    </div>
                  )
                }
                {
                  isError && error && (
                    <div className="flex justify-center items-center h-full w-full">
                      Erro ao carregar a proposta
                      {error.message}
                    </div>
                  )
                }
                {
                  isSuccess && proposal && (
                    <ScrollArea className="w-full !h-[70vh] rounded-e-sm">
                      <div className="p-4 pl-3 pt-8">
                        {menuType == "single" ? (
                          <SingleProposal
                            currentTab={currentTab}
                            proposal={proposal}
                          />
                        ) : (
                          <AgroupedProposals
                            currentTab={currentTab}
                            agroupedProposal={proposal}
                          />
                        )}
                      </div>
                    </ScrollArea>
                  )
                }
              </>
            ) : (
              <ScrollArea className="w-full !h-[70vh] rounded-e-sm">
                <div className="p-4 pl-3 pt-8">
                  {menuType == "single" ? (
                    <SingleProposal
                      currentTab={currentTab}
                      proposal={proposal ?? proposalObj}
                    />
                  ) : (
                    <AgroupedProposals
                      currentTab={currentTab}
                      agroupedProposal={proposal ?? proposalObj}
                    />
                  )}
                </div>
              </ScrollArea>
            )
          }
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PropostaModal;
