import { cn } from "@/lib/utils";
import { AlertCircleIcon } from "lucide-react";

export default function DashboardCardErrorBoudary({error, className}: Readonly<{error: Error, className?: string}>) {
    return (
        <div className={cn("flex items-center justify-center flex-col shadow-md dark:bg-zinc-800 bg-zinc-200/80 w-full min-h-full rounded-md p-4", className)}>
            <AlertCircleIcon className="w-10 h-10 text-red-500" />
            <p className="text-red-500 text-lg font-semibold ml-2">Erro ao carregar os dados</p>
            <p className="text-red-500 text-sm">{error?.message}</p>
        </div>
    )
}