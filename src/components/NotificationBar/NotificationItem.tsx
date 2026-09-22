import useNotificationHook from "@/hooks/useNotificationHook";
import { cn } from "@/lib/utils";
import { Notification } from "@/types";
import { format, isToday, isYesterday, parseISO } from "date-fns";

interface NotificationItemProps {
    notification: Notification;
    className?: string;
}

export default function NotificationItem({ notification, className }: Readonly<NotificationItemProps>) {
    
    const { editNotification } = useNotificationHook();

    function readNotification(notification: Notification) {
        if(isRead(notification.status)) return;
        editNotification({ ...notification, status: 2 });
    }

    const displayDate = getDisplayDate(notification.createdAt);

    const isReadValue = isRead(notification.status);

    return (
        <div onClick={() => readNotification(notification)} className={cn("relative flex flex-row justify-between items-start gap-1 px-4 py-3 transition-all border-b", !isRead(notification.status) ? "bg-muted/80 dark:hover:brightness-125 hover:bg-muted-foreground/15" : "dark:hover:bg-muted/30 hover:bg-muted-foreground/15", className)}>
            <div className="flex flex-col gap-1">
                <h1 className="font-medium">{notification.title}</h1>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
            </div>
            <div className="flex flex-row justify-end">
                <span className={cn("text-xs text-muted-foreground", isReadValue ? "text-muted-foreground" : "text-primary font-semibold")}>{displayDate}</span>
            </div>
        </div>
    )
}

// not used
// function isDelivered(status: number) {
//     return status === 1;
// }

export function isRead(status: number) {
    return status === 2;
}

function getDisplayDate(createdAt: string) {
    try {
        const validDate = parseISO(createdAt);

        if (isNaN(validDate.getTime())) return "";
        // if is today, return "HH:mm"
        if(isToday(new Date(validDate))) {
            return format(new Date(validDate), "HH:mm");
        }
        // if is yesterday, return "HH:mm"
        if(isYesterday(new Date(validDate))) {
            return "Ontem às " + format(new Date(validDate), "HH:mm");
        }
        return format(new Date(validDate), "HH:mm dd/MM");
    } catch {
        return "Horário inválido";
    }
}
