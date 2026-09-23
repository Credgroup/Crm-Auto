import { CardHeader, CardTitle } from "@/components/ui/card";
import DashboardCard from "../DashboardCard";
import { cn } from "@/lib/utils";

type BigNumberProps = {
    title: string;
    value?: number | string;
    color: string;
}

export default function BigNumber({title, value, color}: Readonly<BigNumberProps>) {
  const strVal = value !== undefined && value !== null ? String(value) : "";
  
  // Tamanho adaptativo com base no comprimento do texto (ex: valores monetários longos como R$ 42.873.500,00)
  const getAdaptiveTextSize = (len: number) => {
    if (len >= 17) {
      return "text-sm sm:text-base lg:text-sm xl:text-base 2xl:text-lg";
    }
    if (len >= 13) {
      return "text-base sm:text-lg lg:text-base xl:text-lg 2xl:text-xl";
    }
    if (len >= 8) {
      return "text-lg sm:text-xl lg:text-lg xl:text-xl 2xl:text-2xl";
    }
    return "text-2xl sm:text-3xl";
  };

  return (
    <DashboardCard className="overflow-hidden min-w-0">
        <CardHeader className="p-0 py-1 mb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              <div className="flex items-center min-w-0">
                <div className={cn("w-2.5 h-2.5 rounded-full mr-2 shrink-0")} style={{backgroundColor: color}}></div>
                <span className="truncate">{title}</span>
              </div>
            </CardTitle>
          </CardHeader>
          {
            value !== undefined && value !== null && (
                <span 
                  className={cn(
                    "font-bold block tracking-tight truncate leading-tight w-full",
                    getAdaptiveTextSize(strVal.length)
                  )}
                  title={strVal}
                >
                  {value}
                </span>
            )
          }
    </DashboardCard>
  );
}