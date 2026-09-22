import { ChevronRight, type LucideIcon } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { ModeToggle } from "../Theme/mode-toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import NotificationBar from "../NotificationBar";
import { v4 } from "uuid";

type NavItem = {
  title: string;
  url?: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: NavItem[];
};

export function NavMain({ items }: Readonly<{ items: NavItem[] }>) {
  const location = useLocation();
  const { isMobile, state } = useSidebar()

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const isParentActive = item.url && location.pathname === item.url;
          const isSubActive = item.items?.some(
            (i) => location.pathname === i.url
          );
          const isActive = isParentActive || isSubActive;

          if (item.title === "theme") {
            return <ModeToggle key="mode-toggle" />;
          }
          
          if (item.title === "notification") {
            return <NotificationBar key="notification-bar" />;
          }

          if (item.items && item.items.length > 0) {
            return (
              <Collapsible
                key={v4()}
                asChild
                defaultOpen={isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title} className={isActive ? "opacity-100" : "opacity-80"}>
                      {item.icon && <item.icon className={isActive ? "text-[var(--cor-principal)]" : ""} />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className="border-zinc-300 dark:border-zinc-700">
                      {item.items.map((subItem, i) => {
                        const isSubItemActive =
                          location.pathname === subItem.url;
                        return (
                          <SidebarMenuSubItem key={subItem.title + i} className={isSubItemActive ? "opacity-100" : "opacity-80"}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <SidebarMenuSubButton
                                  asChild
                                  className={
                                    isSubItemActive
                                      ? "bg-[var(--paleta-branco-100)] dark:bg-[var(--paleta-preto-200)] font-semibold"
                                      : ""
                                  }
                                >
                                  <NavLink to={subItem.url ?? ""}>
                                    {subItem.icon && <subItem.icon className={isSubItemActive ? "!text-[var(--cor-principal)]" : ""}/>}
                                    {!(state === "collapsed" || isMobile) && (
                                      <span>{subItem.title}</span>
                                    )}
                                  </NavLink>
                                </SidebarMenuSubButton>
                              </TooltipTrigger>
                              <TooltipContent
                                side="right"
                                align="center"
                                hidden={state !== "collapsed" || isMobile}
                                >
                                  {subItem.title}
                              </TooltipContent>
                            </Tooltip>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          }

          return (
            <SidebarMenuItem key={item.title}>
              {item.url ? (
                <NavLink to={item.url}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={`transition-colors hover:bg-[var(--paleta-branco-200)] dark:hover:bg-[var(--paleta-preto-300)] ${
                      isActive
                        ? "bg-[var(--paleta-branco-100)] dark:bg-[var(--paleta-preto-200)] font-semibold"
                        : "opacity-80"
                    }`}
                  >
                    {item.icon && <item.icon className={isActive ? "text-[var(--cor-principal)]" : ""}/>}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </NavLink>
              ) : (
                <SidebarMenuButton
                  tooltip={item.title}
                  className={`transition-colors hover:bg-[var(--paleta-branco-200)] dark:hover:bg-[var(--paleta-preto-300)] ${
                    isActive
                      ? "bg-[var(--paleta-branco-100)] dark:bg-[var(--paleta-preto-200)]"
                      : ""
                  }`}
                >
                  {item.icon && <item.icon className={isActive ? "text-[var(--cor-principal)]" : ""}/>}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
