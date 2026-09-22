import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LuBuilding, LuUser } from "react-icons/lu";
type IndicatorTypeProps = {
  type: "person" | "enterprise";
};
export default function IndicatorType({ type }: Readonly<IndicatorTypeProps>) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="absolute flex items-center justify-center w-8 h-8 border border-zinc-100 dark:border-zinc-900 bg-background rounded-full right-0 top-0 shadow-sm">
          {type === "person" && (
            <LuUser className="text-zinc-600 dark:text-zinc-300" />
          )}
          {type === "enterprise" && (
            <LuBuilding className="text-zinc-600 dark:text-zinc-300" />
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-sm font-semibold">
          {type === "person" ? "Pessoa Física" : "Empresa"}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
