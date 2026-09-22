import { EnviarDocumentoMenu } from "@/components/EnviarDocumentoMenu";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { copyToClipboard, downloadDocumentByBlobsLink } from "@/lib/utils";
import { DocumentosProdutoItem } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { LuCopy, LuDownload } from "react-icons/lu";

export const columnsDependentesTab: ColumnDef<{nome: string, idade: number, sexo: string}>[] = [
    {
        accessorKey: "nome",
        header: "Nome",
    },
    {
        accessorKey: "idade",
        header: "Idade",
    },
    {
        accessorKey: "sexo",
        header: "Sexo",
    },
];

export const useColumnsDocumentosTab = (idEmpresaOperacao: string | number) =>{
    const columnsDocumentosTab: ColumnDef<DocumentosProdutoItem>[] = [
    {
        accessorKey: "idDocArquivo",
        header: "ID",
        cell: ({row}) => {
            const id = row.original.idDocArquivo
            return (
                <HoverCard>
                    <HoverCardTrigger>
                        <p className="hover:underline">{id.toString()}</p>
                    </HoverCardTrigger>
                    <HoverCardContent className="flex items-center gap-4 w-fit py-2">
                        <p>{id.toString()}</p>
                        <Button variant="ghost" size="icon" onClick={() => copyToClipboard(id.toString())}>
                            <LuCopy />
                        </Button>
                    </HoverCardContent>
                </HoverCard>
            );
        }
    },
    {
        accessorKey: "nmDocOriginal",
        header: "Nome do Documento",
        cell: ({row}) => {
            const name = row.original.nmDocOriginal

            return (
                <HoverCard>
                    <HoverCardTrigger>
                        <p className="hover:underline">{
                            name.length > 20 ? `${name.slice(0, 20)}...` : name
                        }</p>
                    </HoverCardTrigger>
                    <HoverCardContent>
                        <p>{name}</p>
                    </HoverCardContent>
                </HoverCard>
            )
        }
    },
    {
        accessorKey: "dtCadastro",
        header: "Data",
        cell: ({row}) => {
            const date = row.original.dtCadastro
            if(!date){
                return <p>--</p>
            }
            return (
                <p>{format(new Date(date), "dd/MM/yyyy HH:mm")}</p>
            )
        }
    },
    {
        accessorKey: "tpDocumento",
        header: "Tipo de Documento",
        cell: ({row}) => {
            const type = row.original.chDocumento
            return (
                <StatusBadge nmDominio="tpDocumento" cdStatus={type} />
            )
        }
    },
    {
        header: "Download",
        id: "download_button_col",
        cell: ({row}) => {
            const link = row.original.dsDoc
            const VITE_BLOBS_KEY = import.meta.env.VITE_THEME_BLOBS_KEY
            return (
                <Button variant="secondary" size="icon" onClick={() => downloadDocumentByBlobsLink(`${link}${VITE_BLOBS_KEY}`, row.original.nmDocOriginal)}>
                    <LuDownload />
                </Button>
            )
        }
    },
    {
        header: "Enviar",
        id: "send_document_col",
        cell: ({row}) => {
            const link = row.original.dsDoc;
            const docName = row.original.nmDocOriginal;
            return (
                <EnviarDocumentoMenu documentLink={link} documentName={docName} idEmpresa={idEmpresaOperacao}/>
            )
        }
    }
    ];
    return columnsDocumentosTab
}