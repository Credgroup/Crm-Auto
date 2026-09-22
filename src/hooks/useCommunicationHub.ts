import { dev_log } from "@/lib/utils";
import { useOperationStore } from "@/store/operationStore";
import { Notification, UsuarioItem } from "@/types";
import { HttpTransportType, HubConnection, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { toast } from "sonner";
// Imports de som removidos - agora gerenciados pelo contexto
import useNotificationHook from "./useNotificationHook";
import { useHubFunctions } from "@/context/HubFunctions";

interface UseCommunicationHubProps {
    user?: UsuarioItem | null;
}

interface HubEventsListenersReturn {
    event: string;
    fn: (data?: any) => void;
}

export default function useCommunicationHub({ user }: Readonly<UseCommunicationHubProps>) {

    const [connectionState, setConnectionState] = useState<HubConnection | null>(null);
    const idOperation = useOperationStore((state) => state.idOperation);
    const { addNotification, setNotifications } = useNotificationHook();
    const { setConnection, playNotificationSound } = useHubFunctions();

    useEffect(()=>{
        if(!isUserLoggedIn(user)) return;

        const urlConnection = import.meta.env.VITE_COMMUNICATIONHUB_URL ?? ""

        if(!urlConnection) return;
        dev_log(()=>console.log(urlConnection))

        const connection = new HubConnectionBuilder()
        .withUrl(urlConnection, {
            withCredentials: false, 
            transport: HttpTransportType.WebSockets | HttpTransportType.LongPolling
          })
        .withAutomaticReconnect()
        .build();

        const events = HubEventsListeners();

        events.forEach(event => {
            connection.on(event.event, event.fn);
        });

        connection.start().then(() => {
            dev_log(()=> console.log("Iniciou a conexão com o hub"))

            const registerClientPayload = {
                userId: user!.idusuario.toString(),
                platform: import.meta.env.VITE_PLATFORM.toString(),
                eventNotificationScope: "all-notifications",
                currentOperationId: idOperation?.toString() ?? ""
            }

            connection.invoke("RegisterClient", registerClientPayload);
        }).catch((error) => {
            console.error('Error starting connection:', error);
        });

        setConnectionState(connection);
        setConnection(connection);

        return () => {
            if (connection.state === HubConnectionState.Connected) {
                connection.stop();
                console.log('Connection stopped on cleanup.');
            }
            setConnection(null); // Limpa a conexão do contexto
        };

    }, [user]) 

    // Função playNotificationSound removida - agora é gerenciada pelo contexto

    function HubEventsListeners(): HubEventsListenersReturn[] {

        const events: HubEventsListenersReturn[] = [
            {
                event: 'ReceiveNotification',
                fn: (data: Notification) => {
                    dev_log(()=> console.log('ReceiveNotification', data));
                    if(data.type === 1) {
                        toast.message(data.title, {
                            description: data.message
                        })
                    } else if(data.type === 2) {
                        toast.success(data.title, {
                            description: data.message
                        })
                    } else if(data.type === 3) {
                        toast.error(data.title, {
                            description: data.message
                        })
                    } else {
                        toast.message(data.title, {
                            description: data.message
                        })
                    }
                    playNotificationSound()
                    addNotification(data)
                }
            },
            {
                event: 'AllNotificationsByOpPlat',
                fn: (data: any) => {
                    dev_log(()=> console.log('AllNotificationsByOpPlat', data));
                    setNotifications(data)
                }
            },
        ];
    
        return events;
    }
    
    function isUserLoggedIn(user?: UsuarioItem | null): boolean {
        return user !== undefined && user !== null && user.idusuario !== 0;
    }

    return {
        connectionState
    }

  
}

