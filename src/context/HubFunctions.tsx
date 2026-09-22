// Contexto para funções do Hub de comunicação
import { createContext, useContext, useState, useCallback } from "react";
import { HubConnection, HubConnectionState } from "@microsoft/signalr";
import { useUsuarioStore } from "@/store/usuarioStore";
import useSound from "use-sound";
import notificationSound from '@/assets/audio/notificationSound.mp3';

interface HubFunctionsContextType {
    connection: HubConnection | null;
    setConnection: (connection: HubConnection | null) => void;
    sendNotification: (method: string, data: any) => void;
    changeOperation: (operationId: string) => void;
    playNotificationSound: () => void;
}

const HubFunctionsContext = createContext<HubFunctionsContextType | null>(null);

export const HubFunctionsProvider = ({ children }: { children: React.ReactNode }) => {
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const usuario = useUsuarioStore((state) => state.usuario);
    const [play] = useSound(notificationSound, {
        volume: 0.5,
    });

    const sendNotification = useCallback((method: string, data: any) => {
        if (!connection || !usuario?.idusuario) {
            console.log("Conexão ou usuário não disponível para enviar notificação");
            return;
        }
        
        console.log("Enviando notificação:", { method, data });
        connection.invoke("InvokeService", {
            service: "NotificationService",
            method,
            payload: data
        });
    }, [connection, usuario]);

    const changeOperation = useCallback((operationId: string) => {
        if (!connection || !usuario?.idusuario || connection.state !== HubConnectionState.Connected) {
            console.log("Conexão ou usuário não disponível para mudar operação");
            return;
        }
        
        console.log("Mudando operação para:", operationId);
        connection.invoke("UpdateCurrentOperation", {
            OperationId: operationId
        });
    }, [connection, usuario]);

    const playNotificationSound = useCallback(() => {   
        play();
    }, [play]);
    
    return (
        <HubFunctionsContext.Provider value={{
            connection,
            setConnection,
            sendNotification,
            changeOperation,
            playNotificationSound,
        }}>
            {children}
        </HubFunctionsContext.Provider>
    )
}

export const useHubFunctions = () => {
    const context = useContext(HubFunctionsContext);
    if (!context) {
        throw new Error("useHubFunctions must be used within a HubFunctionsProvider");
    }
    return context;
}
