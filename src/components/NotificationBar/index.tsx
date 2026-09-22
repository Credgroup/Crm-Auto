import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Bell, LucideMoreHorizontal } from "lucide-react";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { ScrollArea } from "../ui/scroll-area";
import NotificationItem, { isRead } from "./NotificationItem";
import useNotificationHook from "@/hooks/useNotificationHook";
import { Badge } from "../ui/badge";
import { Notification } from "@/types";
import { LuCheck, LuTrash } from "react-icons/lu";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useState } from "react";

export default function NotificationBar() {
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
    const { notifications, clearNotifications, markAllAsRead } = useNotificationHook();

    const unreadNotificationsList = unreadNotifications(notifications);

    function markAllAsReadList() {
        console.log("markAllAsRead");
        markAllAsRead();

    }
    
    function clearNotificationsList() {
        console.log("clearNotifications");
        clearNotifications();
    }

    return (
        <SidebarMenuItem>
            <Popover>
                <PopoverTrigger asChild>
                <SidebarMenuButton
                    key="notification"
                    tooltip="Notificações"
                    className=""
                >
                    <div className="relative">
                        <Bell className="size-4"/>
                        {
                        unreadNotificationsList.length > 0 && (
                            <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                        )
                    }
                    </div>
                    Notificações
                    {
                        unreadNotificationsList.length > 0 && (
                            <Badge className="rounded-full w-4 h-4 aspect-square flex items-center justify-center font-bold text-[10px]">{unreadNotificationsList.length}</Badge>
                        )
                    }
                </SidebarMenuButton>
                </PopoverTrigger>
                <PopoverContent align="end" side="right" className="w-[350px] max-h-[500px] overflow-y-auto p-0">
                    <div className="p-4 flex flex-col gap-2 border-b border-muted-foreground/10">
                        <div className="flex flex-row justify-between items-center gap-2">
                            <h1 className="font-medium">Notificações</h1>
                            <div className="flex items-center justify-center gap-3">
                                <Badge className="rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs">{unreadNotificationsList.length}</Badge>
                                <DropdownMenu open={isSubmenuOpen} onOpenChange={setIsSubmenuOpen} modal={false}>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="icon">
                                            <LucideMoreHorizontal />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onClick={() => markAllAsReadList()}>
                                            <LuCheck />
                                            Marcar todas como lidas
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => clearNotificationsList()}>
                                            <LuTrash />
                                            Limpar notificações
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>

                    {
                        notifications.length > 0 ? (
                            <ScrollArea className="h-[300px]">
                                <div className="">
                                    {notifications.map((notification) => (
                                        <NotificationItem key={notification.id} notification={notification} />
                                    ))}
                                </div>
                            </ScrollArea>
                        ) : (
                            <div className="flex justify-center items-center h-full p-4">
                                <p className="text-sm text-muted-foreground">Nenhuma notificação</p>
                            </div>
                        )
                    }
                    
                </PopoverContent>
            </Popover>

        </SidebarMenuItem>
    )
}

function unreadNotifications(notifications: Notification[]) {
    return notifications.filter((notification) => !isRead(notification.status));
}
