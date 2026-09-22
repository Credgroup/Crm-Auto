import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';


function TabOne() {
    return (
        <div className='space-y-4'>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-sm text-gray-500">Produto:</p>
                    <p className="font-medium">Seguro evento</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Data de envio:</p>
                    <p className="font-medium">00/00/0000 às 00:00</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Origem:</p>
                    <p className="font-medium">+00 (00) 00000-0000</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Destinatário:</p>
                    <p className="font-medium">+00 (00) 00000-0000</p>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <p className="font-medium">Formulário inicial</p>
                <Button size="icon" variant="ghost">
                    <Eye className="w-4 h-4" />
                </Button>
            </div>
            <div className="grid grid-cols-4 gap-2">
                <div>
                    <p className="text-sm text-gray-500">Enviado:</p>
                    <Badge className="text-white bg-green-500 hover:bg-green-700 rounded-full">
                        Sim
                    </Badge>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Recebido:</p>
                    <Badge className="text-white bg-green-500 hover:bg-green-700 rounded-full">
                        Sim
                    </Badge>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Aberto:</p>
                    <Badge className="text-white bg-green-500 hover:bg-green-700 rounded-full">
                        Sim
                    </Badge>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Respondido:</p>
                    <Badge className="text-white bg-red-500 hover:bg-red-700 rounded-full">
                        Não
                    </Badge>
                </div>
            </div>
            <div>
                <p className="text-sm text-gray-500">Mensagem enviada</p>
                <div className="p-3 bg-muted rounded-md text-sm">
                    Olá Luci, segue o link do formulário para montar duas cotações de seguro evento e seguro equipamento.
                    <br />
                    <a href="https://shortlink.example.com/123456" className="text-blue-500 underline">https://shortlink.example.com/123456</a>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <p className="font-medium">Página de cotação</p>
                <Button size="icon" variant="ghost">
                    <Eye className="w-4 h-4" />
                </Button>
            </div>
            <div className="grid grid-cols-4 gap-2">
                <div>
                    <p className="text-sm text-gray-500">Enviado:</p>
                    <Badge className="text-white bg-green-500 hover:bg-green-700 rounded-full">
                        Sim
                    </Badge>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Recebido:</p>
                    <Badge className="text-white bg-red-500 hover:bg-red-700 rounded-full">
                        Não
                    </Badge>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Aberto:</p>
                    <Badge className="text-white bg-red-500 hover:bg-red-700 rounded-full">
                        Não
                    </Badge>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Respondido:</p>
                    <Badge className="text-white bg-red-500 hover:bg-red-700 rounded-full">
                        Não
                    </Badge>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <p className="font-medium">Mensagem enviada</p>
            </div>
            <div>
                <Badge className="bg-yellow-200 hover:bg-yellow-300 rounded-full">
                    Nnehuma mensagem enviada
                </Badge>
            </div>
        </div>
    )
}

export default TabOne