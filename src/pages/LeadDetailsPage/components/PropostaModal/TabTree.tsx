import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Card } from "@/components/ui/card";
import { obterIniciais } from "@/lib/obterIniciais";
import { AvatarImage } from "@radix-ui/react-avatar";
import { EllipsisVertical, Plus, Send } from 'lucide-react';

function TabTree() {
    return (
        <>
            <div className="flex justify-between mb-4 mr-6">
                <Button className="flex items-center gap-2 text-white bg-green-500 hover:bg-green-700">
                    <Plus className="w-4 h-4" /> Nova Cotação
                </Button>
                <Button className="flex items-center gap-2 text-white bg-[#002c77] hover:bg-[#002c55]">
                    <Send className="w-4 h-4" /> Enviar Cotações
                </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
                {[
                    { id: "123456", name: "Zurich", status: "Ativo", logo: "/maior-seguros-zurich.jpg" },
                    { id: "654321", name: "Akad", status: "Ativo", logo: "/akad.png" },
                    { id: "123654", name: "HDI", status: "Ativo", logo: "/HDI_Seguros_Brasil_-_Logo_2020.png" }
                ].map((item) => (
                    <Card key={item.id} className="p-4 flex flex-col space-y-2">
                        <div className="flex justify-between">
                            <Badge className="text-white bg-green-500 hover:bg-green-700 rounded-full">{item.status}</Badge>
                            <Button size="icon" variant="ghost">
                                <EllipsisVertical className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="flex justify-between">
                            <Avatar className="w-16 h-16 rounded-sm">
                                <AvatarImage src={item.logo} alt={"profile"} />
                                <AvatarFallback className="rounded-sm"><span className="text-2xl font-bold">{obterIniciais(item.name)}</span></AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm text-gray-500">{item.id}</p>
                                <p className="font-medium">{item.name}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </>
    )
}

export default TabTree