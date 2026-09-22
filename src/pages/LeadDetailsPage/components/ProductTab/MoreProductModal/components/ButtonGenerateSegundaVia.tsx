import { useState } from "react";
import { Button } from "@/components/ui/button";
import { generateTicketOnly } from "@/services/ticketService";
import { LuRefreshCw } from "react-icons/lu";

interface ButtonGenerateSegundaViaProps {
    idSeguro: string;
    idProduct: string;
    onSuccess?: () => Promise<void> | undefined;
}

export default function ButtonGenerateSegundaVia({ idSeguro, idProduct, onSuccess }: Readonly<ButtonGenerateSegundaViaProps>) {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        console.log("generateTicketOnly called", { idSeguro, idProduct });
        setLoading(true);
        try {
            const result = await generateTicketOnly({ idSeguro, idProduct });
            console.log("generateTicketOnly result", result);
            
            // Chama callback de sucesso para refetch dos documentos
            if (onSuccess) {
                await onSuccess();
            }
        } catch (error) {
            console.error("generateTicketOnly error", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button variant="secondary" size="icon" onClick={handleClick} disabled={loading}>
            <LuRefreshCw className={loading ? "animate-spin" : ""} />
        </Button>
    );
}