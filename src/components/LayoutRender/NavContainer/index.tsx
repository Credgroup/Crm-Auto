import FormNavItem from "../FormNavItem";
import type { SessaoType } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { useSidebarContext } from "../../../context/SidebarContext";

type NavContainerProps = {
  navItems: Partial<SessaoType>[];
};
export default function NavContainer({
  navItems,
}: Readonly<NavContainerProps>) {
  const { scrollContainerRef, scrollToActiveItem } = useSidebarContext();

  const handleItemClick = (index: number) => {
    // Pequeno delay para garantir que o DOM foi atualizado
    setTimeout(() => {
      scrollToActiveItem(index);
    }, 50);
  };

  return (
    <>
      <div className="flex sm:hidden w-full flex-wrap">
        <div className="w-full relative -mb-4">
          {navItems &&
            navItems.length > 0 &&
            navItems.map((sessao) => (
              <div
                className={cn(
                  "w-full opacity-0 transition-all h-0 cursor-none pointer-events-none",
                  sessao.active && "opacity-100 h-fit"
                )}
                key={uuidv4()}
              >
                <FormNavItem
                  checked={sessao.checked}
                  title={sessao.title}
                  description={sessao.descricao}
                  disable={sessao.disabled}
                  active={sessao.active}
                  className="w-full"
                  steps={navItems}
                />
              </div>
            ))}
        </div>
      </div>

      <Card className="hidden sm:block w-full">
        {/* <ScrollArea className="w-full scroll-mr-4 overflow-x-auto border border-red-500"> */}
          <div 
            ref={scrollContainerRef}
            className="flex flex-row gap-4 p-4 px-6 overflow-x-scroll scrollbar-none" 
            style={{ scrollbarWidth: 'none' }}
          >
            {navItems &&
              navItems.length > 0 &&
              navItems.map((sessao, index) => (
                <FormNavItem
                  key={`${sessao.title}-${index}`}
                  checked={sessao.checked}
                  title={sessao.title}
                  description={sessao.descricao}
                  disable={sessao.disabled}
                  active={sessao.active}
                  className={cn(
                    "min-w-[200px] max-w-[350px] flex-shrink-0"
                  )}
                  steps={navItems}
                  onClick={() => handleItemClick(index)}
                  index={index}
                />
              ))}
          </div>
          {/* <ScrollBar orientation="horizontal" /> */}
        {/* </ScrollArea> */}
      </Card>

    </>
  );
}
