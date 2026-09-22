import { CardHeader, CardTitle } from "@/components/ui/card";
import DashboardCard from "../DashboardCard";
import { cn } from "@/lib/utils";

type BigNumberProps = {
    title: string;
    value?: number | string;
    color: string;
}

export default function BigNumber({title, value, color}: Readonly<BigNumberProps>) {
  return (
    <DashboardCard>
        <CardHeader className="p-0 py-1 mb-4">
            <CardTitle>
              <div className="flex items-center">
                <div className={cn(`w-3 h-3 rounded-full mr-2`)} style={{backgroundColor: color}}></div>
                <span>{title}</span>
              </div>
            </CardTitle>
          </CardHeader>
          {
            value && (
                <span className="text-3xl font-bold">{value}</span>
            )
          }
    </DashboardCard>
  );
}