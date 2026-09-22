import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { SessaoType } from "@/types";
import { LuCheck } from "react-icons/lu";
type FormNavItemProps = {
  disable?: boolean;
  checked?: boolean;
  title?: string;
  description?: string;
  active?: boolean;
  className?: string;
  steps?: Partial<SessaoType>[];
  onClick?: () => void;
  index?: number;
};
export default function FormNavItem({
  checked,
  description,
  disable,
  title,
  active,
  className,
  steps,
  onClick,
  index,
}: Readonly<FormNavItemProps>) {
  return (
    <div
      className={cn(
        "relative transition-all select-none",
        className,
        disable && "opacity-30",
        onClick && !disable && "cursor-pointer hover:opacity-80"
      )}
      onClick={onClick && !disable ? onClick : undefined}
    >
      <div className="flex flex-col gap-2">
        {!steps && active && (
          <div
            className={cn(
              "flex justify-center items-center w-7 h-7 rounded-full border-4 border-[var(--menu-item-step-bg)]"
            )}
          ></div>
        )}
        {!steps && !active && !checked && (
          <div
            className={cn(
              "flex justify-center items-center w-7 h-7 rounded-full border-4 border-zinc-300"
            )}
          ></div>
        )}
        {!steps && checked && !active && (
          <div
            className={cn(
              "flex justify-center items-center w-7 h-7 rounded-full bg-green-500"
            )}
          >
            <LuCheck className="text-xl stroke-4 text-white" />
          </div>
        )}
        {steps && steps.length > 0 && index !== undefined && (
          <Badge className={cn("rounded-full w-fit mb-2", disable && "bg-zinc-300 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400")}>
            Sessão {index + 1} de {steps.length}
          </Badge>
        )}
      </div>

      <h1 className="text-2xl font-bold">{title ?? "--"}</h1>
      <p className="text-base font-regular">{description ?? "--"}</p>
      {
        !disable && (
          <div className="w-full h-1 bg-[var(--cor-principal)] rounded-full mt-4"></div>
        )
      }
    </div>
  );
}
