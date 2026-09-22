import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { menuItem } from "..";

type ModalMenuProps = {
  menuItems: menuItem[];
  selectCurrentTabId: (id: number) => void;
  actionButtons?: menuItem[];
};
export default function ModalMenu({
  menuItems,
  selectCurrentTabId,
  actionButtons = [],
}: Readonly<ModalMenuProps>) {
  return (
    <aside className="!w-full !max-w-44 py-8 bg-sidebar rounded-s-sm !h-full flex flex-col justify-between">
      <ScrollArea className="flex-1 h-0">
        {menuItems.length > 0 &&
          menuItems.filter((item) => !item.actionButtonTrigger).map((item: menuItem) => {
            return [
              <button
                key={item.id}
                className={cn(
                  "w-full flex flex-row items-center justify-start gap-3 p-3 hover:bg-muted/100 hover:cursor-pointer transition-all",
                  item.active
                    ? "bg-muted/100 text-zinc-800 dark:text-zinc-200 font-semibold"
                    : "text-zinc-500"
                )}
                onClick={() => selectCurrentTabId(item.id)}
              >
                <item.icon
                  className={cn(
                    "w-5",
                    item.active && "bg-muted/100 text-[var(--cor-principal)]"
                  )}
                />
                <span>{item.name}</span>
              </button>,
            ];
          })}
        {menuItems.length == 0 &&
          [0, 1, 2].map((item) => {
            return (
              <div
                key={item}
                className="w-full h-11 mb-1 flex flex-row items-center justify-start gap-3 p-3 bg-muted/100 hover:cursor-pointer transition-all animate-pulse"
              ></div>
            );
          })}
      </ScrollArea>
      <div className="w-full px-3 bottom-0 relative space-y-1">
        {actionButtons.length > 0 &&
          actionButtons.map((item: menuItem) => {
            return [
              <button
                key={item.id}
                className={cn("w-full flex flex-row items-center justify-between gap-3 px-3 py-1 rounded-sm bg-muted/100 hover:cursor-pointer transition-all hover:bg-muted/200 hover:text-zinc-800 dark:hover:text-zinc-200",
                  item.active
                    ? "!bg-muted/200 dark:text-zinc-200 text-zinc-800 font-semibold"
                    : "text-zinc-500"
                )}
                onClick={() => item.action?.(item.id)}
              >
                <span>{item.name}</span>
                <item.icon className={"w-4"} />
              </button>,
            ];
          })}
      </div>
    </aside>
  );
}