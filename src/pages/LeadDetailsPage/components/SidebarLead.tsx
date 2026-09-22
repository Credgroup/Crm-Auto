import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { ArrowLeft } from "lucide-react";
import { ReactNode } from "react";
import { useNavigate } from "react-router";

interface MenuItem {
  id: number;
  name: string;
  icon: React.ElementType;
  active: boolean;
  component?: ReactNode;
}

interface SidebarLeadProps {
  menuItems: MenuItem[];
  handleItemClick: (itemId: number) => void;
}

function SidebarLead({
  menuItems,
  handleItemClick,
}: Readonly<SidebarLeadProps>) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <aside className="w-56 min-h-full flex flex-col border-r-2 fixed pr-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            onClick={handleBack}
            className="text-left justify-center text-xs aspect-square w-10 h-10 my-4"
          >
            <ArrowLeft />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Voltar</TooltipContent>
      </Tooltip>
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <Button
              variant="ghost"
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`w-full justify-start ${
                item.active ? "dark:text-white bg-muted/100" : "!text-zinc-500"
              }`}
            >
              <item.icon
                className={`"text-xs" ${
                  item.active && "text-[var(--cor-principal)]"
                }`}
              />
              <span className="capitalize">{item.name}</span>
            </Button>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default SidebarLead;
