import * as React from "react";
import { Users, ShoppingCart, LayoutDashboard, ChartBar, LucideFileText, DollarSign } from "lucide-react";

import { NavMain } from "@/components/Sidebar/nav-main";
import { NavUser } from "@/components/Sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link } from "react-router";

// Configutação do Sidebar
const data = {
  navContent: [
    {
      title: "Dashboards",
      url: "/dashboards",
      icon: LayoutDashboard,
      items: [
        {
          title: "Overview",
          url: "/dashboards/overview",
          icon: ChartBar,
        },
        {
          title: "Vendas",
          url: "/dashboards/sales",
          icon: ShoppingCart,
        },
        {
          title: "Propostas",
          url: "/dashboards/proposals",
          icon: LucideFileText,
        },
      ]
    },
    {
      title: "Clientes",
      url: "/lead",
      icon: Users,
    },
    {
      title: "Vendas",
      url: "/sales",
      icon: ShoppingCart,
    },
    {
      title: "Comissões",
      url: "/commission",
      icon: DollarSign,
    },
  ],
  navFooter: [
    {
      title: "theme",
    }
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();

  const version = import.meta.env.VITE_IMAGE_VERSION;

  return (
    <Sidebar collapsible="icon" {...props} className="">
      <SidebarHeader className="bg-[var(--paleta-branco-300)] dark:bg-[var(--paleta-preto-400)]">
        <Link
          to="/"
          aria-label="Mercedes-Benz Trucks F&I Hub"
          className={`block w-full h-10 mt-4 bg-contain bg-no-repeat flex items-center justify-center bg-center ${
            state == "collapsed"
              ? "bg-[image:var(--image-logo-compact)] dark:bg-[image:var(--image-logo-compact-dark)]"
              : "bg-[image:var(--image-logo-extended)] dark:bg-[image:var(--image-logo-extended-dark)]"
          }`}
        ></Link>
        {state !== "collapsed" && (
          <div className="mb-4 mt-2 flex items-center justify-center gap-2 border-t pt-3">
            <span className="text-[8px] font-semibold uppercase tracking-widest text-zinc-400">Powered by</span>
            <img src="/assets/branding/ekio-logo.png" alt="Ekio" className="h-5 w-auto object-contain dark:brightness-0 dark:invert" />
          </div>
        )}
      </SidebarHeader>
      <SidebarContent className="bg-[var(--paleta-branco-300)] dark:bg-[var(--paleta-preto-400)]">
        <NavMain items={data.navContent} />
      </SidebarContent>
      <SidebarFooter className="bg-[var(--paleta-branco-300)] dark:bg-[var(--paleta-preto-400)]">
        <NavMain items={data.navFooter} />

        {/* Menu usuario */}
        <NavUser />
        <span className="text-zinc-500 text-xs font-semibold block w-full text-center mb-2">
          V{version}
        </span>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
