import { execApi } from "@/hooks/useApi"
import { Product } from "@/types"
import { toast } from "sonner"

type fetchProductsProps = {
    idOperation: number | string | null,
    pageNumber: number,
    pageSize: number,
    busca?: string,
    categoria?: string,
    subCategoria?: string,
}

export async function fetchProducts({ idOperation, pageNumber, pageSize, busca, categoria, subCategoria }:Readonly<fetchProductsProps>){

    try {
        
        if(!idOperation){
            throw new Error("Nenhum id operação identificado")
        }

        // Construir a URL com os parâmetros de busca
        let url = `api/crm/product/find/operation/${idOperation}?pageNumber=${pageNumber}&pageSize=${pageSize}`;
        
        // Adicionar parâmetro de busca se fornecido
        if (busca && busca.trim()) {
            url += `&busca=${encodeURIComponent(busca.trim())}`;
        }
        if (categoria) {
            url += `&categoria=${categoria}`;
        }
        if (subCategoria && subCategoria !== "all") {
            url += `&subCategoria=${subCategoria}`;
        }

        const res: any = await execApi({
            url,
            data: {},
            method: "GET",
            needLogout: true,
            isCrmApi: true
        })

        if(!res.data){
            throw new Error(`Algum problema no response da api: ${JSON.stringify(res)}`)
        }

        return res.data as {
            items: Partial<Product>[],
            totalCount: number,
            pageNumber: number,
            pageSize: number
        }

    } catch (error: any) {
        toast.error("Algum erro aconteceu", {
            description: error.message
        })
    }

}