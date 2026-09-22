import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowRightLeftIcon, Calendar, ChartPie, Clock, File, FilePlus, LucideEdit, Link } from "lucide-react";
import { useEffect, useState } from "react";
import { LuDelete, LuEllipsisVertical } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ModalMenu from "../../PropostaModal/components/ModalMenu";
import { menuItem } from "../../PropostaModal";
import DetailsProduct from "./tabs/DetailsProduct";
import { ProductTable } from "@/types";
import DocumentosTable from "./tabs/DocumentosTable";
import HistoricoProdutoTab from "./tabs/HistoricoProdutoTab";
import TransacoesProdutoTab from "./tabs/TransacoesProdutoTab";
import ParcelasProdutoTab from "./tabs/ParcelasProdutoTab";
import AdicionalProdutoTab from "./tabs/AdicionalProdutoTab";
import CancelarProdutoTab from "./tabs/CancelarProdutoTab";
import { ShortlinksProdutoTab } from "./tabs/ShortlinksProdutoTab";
//import DisparosProdutoTab from "./tabs/DisparosProdutoTab";

type MoreProductModalProps = {
  id: string | number | null;
  product: Partial<ProductTable>;
  idEmpresaOperation?: string
};

export default function MoreProductModal({
  id,
  product,
  idEmpresaOperation
}: Readonly<MoreProductModalProps>) {
  const [tab, setTab] = useState<menuItem[]>([]);
  const [currentTab, setCurrentTab] = useState<menuItem | null>(null);

  const tabsMenuList: menuItem[] = [
    { id: 1, name: "Detalhes", icon: ChartPie, active: true, tabComponent: <DetailsProduct product={product} /> },
    { id: 2, name: "Documentos", icon: File, active: false, tabComponent: <DocumentosTable idSeguro={product.idSeguro} idEmpresaOperation={idEmpresaOperation}/> },
    // { id: 3, name: "Dependentes", icon: Users, active: false, tabComponent: <DependentesTable /> },
    { id: 5, name: "Parcelas", icon: Calendar, active: false, tabComponent: <ParcelasProdutoTab idSeguro={product.idSeguro} /> },
    { id: 6, name: "Transações", icon: ArrowRightLeftIcon, active: false, tabComponent: <TransacoesProdutoTab idSeguro={product.idSeguro} /> },
    { id: 4, name: "Histórico", icon: Clock, active: false, tabComponent: <HistoricoProdutoTab idSeguro={product.idSeguro} /> },
    { id: 7, name: "Adicional", icon: FilePlus, active: false, tabComponent: <AdicionalProdutoTab idSeguro={product.idSeguro} /> },
    // { id: 8, name: "Disparos", icon: Send, active: false, tabComponent: <DisparosProdutoTab idSeguro={product.idSeguro} /> },
    { id: 9, name: "Shortlinks", icon: Link, active: false, tabComponent: <ShortlinksProdutoTab idSeguro={product.idSeguro} chStatusSeguro={product.chStatusSeguro} /> },
    { id: 12, name: "Endosso", icon: FilePlus, active: false, tabComponent: <div>Endosso</div>, actionButtonTrigger: true},
    { id: 13, name: "Cancelar", icon: LuDelete, active: false, tabComponent: <CancelarProdutoTab idSeguro={product.idSeguro} cancelado={product.chStatusSeguro === 3} />, actionButtonTrigger: true},
  ];

  const menuActionsButtons: menuItem[] = [
    {
      id: 12,
      name: "Endosso",
      icon: LucideEdit,
      action: (id) => {
        if(!id) return
        handleSelectTab(id)
      },
      active: false,
    },
    {
      id: 13,
      name: "Cancelar",
      icon: LuDelete,
      action: (id) => {
        if(!id) return
        handleSelectTab(id)
      },
      active: false,
      tabComponent: <div>Cancelar</div>
    },
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

  useEffect(() => {
    setTab(tabsMenuList);
    setCurrentTab(tabsMenuList[0]);
  }, [id]);

  useEffect(() => {
    setCurrentTab(tab.find((item) => item.active) ?? null);
  }, [tab]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="aspect-square" size="icon">
          <LuEllipsisVertical />
        </Button>
      </DialogTrigger>
      <DialogContent className="!min-w-[80vw] !w-full max-w-4xl h-[70vh] p-0 box-border overflow-hidden">
        <DialogTitle className="hidden"></DialogTitle>
        <DialogDescription className="hidden"></DialogDescription>
        <div className="flex space-x-2 w-full h-full min-h-0">
          <ModalMenu
            selectCurrentTabId={(id) => handleSelectTab(id)}
            menuItems={tab}
            actionButtons={menuActionsButtons}
          />
          <ScrollArea className="w-full !h-[70vh] rounded-e-sm">
            <div className="p-4 pl-3 pt-8">{currentTab?.tabComponent}</div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
