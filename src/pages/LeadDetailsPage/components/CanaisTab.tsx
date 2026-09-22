import { DataTable } from '@/components/DataTable/DataTable'
import { Canais, columnsCanais } from './CanaisListColumns'


const data: Canais[] = [
    {
        idI2k: 4,
        idExterno: "2027",
        operacao: "CredGroup - Demonstração",
        status: "Ativo",
        data: "05/03/2025 13:00:00",
    },
    {
        idI2k: 3,
        idExterno: "2027",
        operacao: "CredGroup - Demonstração",
        status: "Ativo",
        data: "04/03/2025 12:00:00",
    },
    {
        idI2k: 2,
        idExterno: "2028",
        operacao: "CredGroup - Demonstração",
        status: "Ativo",
        data: "02/03/2025 15:00:00",
    },
    {
        idI2k: 1,
        idExterno: "2028",
        operacao: "CredGroup - Demonstração",
        status: "Ativo",
        data: "02/03/2025 14:00:00",
    }
]

function CanaisTab() {
    const isMock = true;

    return (
        <div className="w-full flex-1 pr-4">
            {
                isMock ? (
                    <div className="w-full flex-1 pr-4">Em desenvolvimento</div>
                ) : (
                    <DataTable columns={columnsCanais} data={data} filter={["idExterno"]} />
                )
            }
        </div>
    )
}

export default CanaisTab