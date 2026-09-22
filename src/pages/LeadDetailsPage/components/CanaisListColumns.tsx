import { DataTableColumnHeader } from '@/components/DataTable/DataTableColumnHeader'
import { Badge } from '@/components/ui/badge'
import { ColumnDef } from '@tanstack/react-table'
import EnviosModal from './EnviosModal'
import TransacaoModal from './TransacaoModal'

export interface Canais {
    idI2k: number,
    idExterno: string,
    operacao: string,
    status: string,
    data: string,
}

export const columnsCanais: ColumnDef<Canais>[] = [
    {
        accessorKey: "idI2k",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="ID I2K"/>
        ),
    },
    {
        accessorKey: "idExterno",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="ID Externo"/>
        ),
    },
    {
        accessorKey: "operacao",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Operação"/>
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
        accessorKey: "data",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Data"/>
        ),
    },
    {
        accessorKey: "envios",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Ações"/>
        ),
        cell: ({ row }) => {
            const item = row.original
            console.log(item)
            return (
                <div className='flex'>
                    <EnviosModal />
                    <TransacaoModal />
                </div>
            )
            
        }
    }
]