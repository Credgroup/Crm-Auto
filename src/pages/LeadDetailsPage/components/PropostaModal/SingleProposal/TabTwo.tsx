import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';


function TabTwo() {
    return (
        <>
            <div className='space-y-4'>
                <div className="flex items-center space-x-2">
                    <p className="font-medium text-xl">Resposta formulário</p>
                    <Button size="icon" variant="ghost">
                        <Eye className="w-4 h-4" />
                    </Button>
                </div>
                <div className="text-lg font-medium">
                    Dados Gerais
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-500">Nome da empresa:</p>
                        <p className="font-medium">Keepins</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">CNPJ:</p>
                        <p className="font-medium">27.013.880/0001-97</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Endereço:</p>
                        <p className="font-medium">Estrada da Ypioca</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">CEP:</p>
                        <p className="font-medium">61946-600</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Cidade:</p>
                        <p className="font-medium">Maranguape</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Telefone:</p>
                        <p className="font-medium">+00 (00) 00000-0000</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Responsável:</p>
                        <p className="font-medium">Itamar Soares</p>
                    </div>
                </div>
                <div className="text-lg font-medium">
                    Dados do Evento
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-500">Nome do evento:</p>
                        <p className="font-medium">Insurtech Brasil</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Local do evento:</p>
                        <p className="font-medium">Amcham Business Center</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Endereço:</p>
                        <p className="font-medium">Rua da Paz, 1431 - São Paulo</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Categoria do evento:</p>
                        <p className="font-medium">Inovação de tecnologia</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Quantidade de dias efetivos do evento:</p>
                        <p className="font-medium">1 dia</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Quantidade de público diário:</p>
                        <p className="font-medium">1.000 pessoas</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">O evento será realizado ao ar livre?:</p>
                        <p className="font-medium">Não</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Haverá utilização de fogos de artifício?:</p>
                        <p className="font-medium">Não</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Haverá utilização de fogos de estruturas temporárias?:</p>
                        <p className="font-medium">Sim</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TabTwo