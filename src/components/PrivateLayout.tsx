import { AppSidebar } from "./Sidebar/sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { ScrollArea } from "./ui/scroll-area";
import ChangeOpPartnerButton from "./ChangeOpPartnerButton";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export function PrivateLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className="h-screen">
          <div className="flex items-center gap-2 transition-[width,height] ease-linear border-b pl-12 h-20 pr-8">
            <div className="w-full flex items-center justify-between gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarTrigger className="aspect-square !p-2" />
                </TooltipTrigger>
                <TooltipContent>
                  Menu
                </TooltipContent>
              </Tooltip>
              <ChangeOpPartnerButton />
            </div>
          </div>
          <ScrollArea className="relative h-[calc(100vh-5rem)]">
            <div className="relative flex flex-col gap-4 pl-4 overflow-hidden">
              <Outlet />
            </div>
          </ScrollArea>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
