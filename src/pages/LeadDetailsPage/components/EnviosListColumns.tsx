import { DataTableColumnHeader } from '@/components/DataTable/DataTableColumnHeader'
import { Badge } from '@/components/ui/badge'
import { ColumnDef } from '@tanstack/react-table'
import TransacaoModal from './TransacaoModal'
import CallbackModal from './CallbackModal'

export interface Envio {
    idseguradomulticanal: number,
    idoperacaomulticanal: number,
    idseguradoi2k: number,
    idcontato: number,
    idemail: number,
    tpstatus: number,
    status: string,
    chstatus:string,
    idexterno: string,
    mensagem: string,
    assunto: string,
    jsonenvio: string,
    jsonretorno: string,
    dtenvio: string,
    tpstatuscallback: string,
    chstatuscallback: string,
    dsstatuscallback: string,
    tpmulticanal: number,
    chmulticanal: string,
    dsmulticanal: string,
    nmhtml: string,
    nmsms: string,
    ddd: string,
    telefone: string,
    email: string,
    cadastro: string,
    alteracao: string
}

export const columnsEnvio: ColumnDef<Envio>[] = [
    {
        accessorKey: "idseguradomulticanal",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="ID Multicanal"/>
        ),
    },
    {
        accessorKey: "idexterno",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="ID Externo"/>
        ),
    },
    {
        accessorKey: "dsmulticanal",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Tipo"/>
        ),
    },
    {
        accessorKey: "dtenvio",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Data envio"/>
        ),
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status"/>
        ),
        cell: ({ row }) => {
            const item = row.original
            return (
                <Badge className="px-2 text-xs font-bold text-green-800 bg-green-300 hover:bg-green-400  rounded-full">
                    {item.status}
                </Badge>
            )
            
        }
    },
    {
        accessorKey: "dsstatuscallback",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status callback"/>
        ),
        cell: ({ row }) => {
            const item = row.original
            return (
                <Badge className="px-2 text-xs font-bold text-green-800 bg-green-300 hover:bg-green-400  rounded-full">
                    {item.dsstatuscallback}
                </Badge>
            )
            
        }
    },
    {
        accessorKey: "acoes",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Ações"/>
        ),
        cell: ({ row }) => {
            const item = row.original
            console.log(item)
            return (
                <div className='flex'>
                    <CallbackModal />
                    <TransacaoModal />
                </div>
            )
            
        }
    }
]