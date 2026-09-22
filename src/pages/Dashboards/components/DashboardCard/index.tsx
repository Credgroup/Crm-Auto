import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function DashboardCard({children, className}: Readonly<{children?: ReactNode, className?: string}>) {
    return (
        <Card className="shadow-md dark:bg-zinc-900 bg-zinc-100 w-full h-fit hover:bg-zinc-200/60 dark:hover:bg-zinc-800/80 transition-colors">
            <CardContent className={cn("p-4", className)}>
                {children}
            </CardContent>
        </Card>
    )
}