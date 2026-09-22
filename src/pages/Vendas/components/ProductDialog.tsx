import { Button } from "@/components/ui/button";
import { t } from "@/lib/i18n";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router";
import { cn } from "@/lib/utils";
import { LuBookmark, LuCheck, LuPackage2 } from "react-icons/lu";
import { PopoverContent, Popover, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { v4 } from "uuid";
import { Product } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { execApi } from "@/hooks/useApi";
import { useSidebar } from "@/components/ui/sidebar";
import { useOperationStore } from "@/store/operationStore";

type ProductDialogProps = {
  produto: Partial<Product>;
  onClose?: () => void;
  planos?: Partial<Product>[];
}


type paginaJsonSubProduct = {
    caracteristicas: {nome:string, valor: string}[],
    faq: {answer: string, question: string}[],
    descricao: string
}

type fetchProductDetailsProps = {
    produto: Partial<Product>,
    idOperation?: string | null
}

async function fetchProductDetails ({produto, idOperation}: Readonly<fetchProductDetailsProps>){
    try {
        if(!idOperation){
            throw new Error("Id da operação não existe!")
        }

        console.log(produto)

        if(!produto.idProduto){
            throw new Error("Id do produto não existe!")
        }

        let res: any = await execApi({
            url: `api/crm/product/find/layouts/html/${idOperation}/${produto.idProduto}`,
            data: {},
            method: "GET",
            needLogout: true,
            isCrmApi: true
        })

        if(!res.data){
            throw new Error(`Algum problema no response da api: ${JSON.stringify(res)}`)
        }

        return res.data
    } catch (error: any) {
        toast.error("Algum erro aconteceu", {
            description: error.message
        })
    }
}

export default function ProductDialog({ produto, onClose, planos = [] }: Readonly<ProductDialogProps>) {
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()
    const [productDetails, setProductDetails] = useState<Partial<paginaJsonSubProduct> | null>(null)
    const idOperation = useOperationStore(state => state.idOperation)

    const { setOpen: setSidebarOpen } = useSidebar();
    const [plans] = useState<Partial<Product>[]>(planos.length > 0 ? planos : [produto])
    const [selectedPlan, setSelectedPlan] = useState<Partial<Product> | null>(planos.length > 0 ? planos[0] : produto)
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0)

    const { mutate, isPending, error, isError } = useMutation({
        mutationKey: ["fetchProductDetails", produto, open],
        mutationFn: ({subProduct, idOperation}: {subProduct: Partial<Product>, idOperation?: string | null}) => fetchProductDetails({produto: subProduct, idOperation}) ,
        onSuccess: (data) => {
            console.log(data)
            try {
                const paginaJsonObj = data.filter((item: any) => item.chHtml === 4)
                if(paginaJsonObj[0].idHtml){
                    const details = JSON.parse(paginaJsonObj[0].dsHtml)
                    setProductDetails(details)
                    return
                }
                console.log(paginaJsonObj)
                setProductDetails(null)   
            } catch (error) {
                console.log(error)
                toast.error("Erro ao carregar os detalhes do produto")
                setProductDetails(null)  
            }
        },
        onError: (error) => {
            console.log(error)
        }
    })

    useEffect(() => {
        if(open && selectedPlan?.idProduto){
            mutate({subProduct: selectedPlan, idOperation})
        }
    }, [open])


    const handleSelectProduct = (subProduct: Partial<Product>) =>{
        console.log(subProduct)
        setSelectedPlan(subProduct)

        // search paginaJson of subProduct
        mutate({subProduct, idOperation})
    }

    const nextSlide = () => {
        setCurrentSlideIndex((prev) => (prev + 1) % plans.length)
    }

    const prevSlide = () => {
        setCurrentSlideIndex((prev) => (prev - 1 + plans.length) % plans.length)
    }

    const handleSelectSlide = (subProduct: Partial<Product>) => {
        const index = plans.findIndex(plan => plan.idProduto === subProduct.idProduto)
        setCurrentSlideIndex(index)
    }

    const handleSelectProductAndSlide = (subProduct: Partial<Product>) => {
        handleSelectSlide(subProduct)
        handleSelectProduct(subProduct)
    }

    useEffect(() => {
        if(open){
            handleSelectProduct(plans[currentSlideIndex])
        }
    }, [currentSlideIndex])

    return (
        <Dialog open={open} onOpenChange={(open) => {
            setOpen(open);
            if (!open) {
                onClose?.();
            }else{
                setSidebarOpen(false)
            }
            }
        }
        >
            <DialogTrigger asChild>
                <Button className="w-8 h-8 rounded-full" variant="secondary">
                    <ArrowUpRight className="w-5 h-5"/>
                </Button>
            </DialogTrigger>

            <DialogContent className="w-full max-w-4xl h-fit max-h-[85vh] !p-0">
                <DialogHeader className="hidden">
                    <DialogTitle></DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                
                <ScrollArea className="relative w-full h-full max-h-[83vh] !px-8">
                    <div className="flex flex-col gap-4 h-fit w-full justify-center my-8">
                        
                        <div className="relative flex flex-row gap-8 w-full justify-center items-start md:justify-between flex-wrap md:flex-nowrap ">
                            <div className="relative w-full h-full aspect-square md:max-w-sm bg-muted rounded-lg overflow-hidden">
                                {
                                    produto.dsLogo ? (
                                        <img src={produto.dsLogo+"?sp=r&st=2025-05-21T01:16:44Z&se=2026-05-21T09:16:44Z&spr=https&sv=2024-11-04&sr=c&sig=0o75S62Z761Xs2J5GX5XaVRwz%2BlqaGD3trx2uaKZzYw%3D"} alt={produto.nmProduto} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <LuPackage2 className="text-8xl text-zinc-500 dark:text-zinc-200"/>
                                        </div>
                                    )
                                }
                                {
                                    produto.tags && produto.tags.length > 0 && (
                                        <div className="flex justify-end items-center p-4 w-full z-50 absolute bottom-0 right-0">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button className="aspect-square rounded-full" size="icon" variant="secondary">
                                                        <LuBookmark />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="!p-2 w-fit">
                                                    <div className="w-full flex flex-wrap justify-center gap-2 max-w-64">
                                                        {
                                                        produto.tags.map(item => (
                                                            <Badge key={v4()}>{item}</Badge>
                                                        ))
                                                    }
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    )
                                }
                            </div>
                            <div className="flex flex-col gap-4 w-full md:max-w-sm">
                                <h1 className="text-2xl font-bold flex items-center gap-3">{produto.nmProduto} {selectedPlan && <Badge className="bg-[var(--cor-principal)] text-white">{selectedPlan.nmProduto}</Badge>}</h1>
                                <p className="text-sm text-muted-foreground">{produto.dsProduto}</p>
                                <div className="flex flex-col gap-2 w-full">
                                    {
                                        selectedPlan?.qtParcelas ? (
                                            <>
                                                <span className="text-sm text-muted-foreground">Em até {selectedPlan?.qtParcelas ?? "--"}x de</span>
                                                <span className="font-semibold text-4xl">
                                                    R$ {selectedPlan?.vlParcela 
                                                        ? Number(selectedPlan.vlParcela).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
                                                        : "--"}
                                                </span>
                                                <span className="text-sm text-muted-foreground">ou R$ {selectedPlan?.vlPremio && Number(selectedPlan.vlPremio).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "--"} à vista</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-sm text-muted-foreground">À vista</span>
                                                <span className="font-semibold text-4xl">
                                                    R$ {selectedPlan?.vlPremio 
                                                        ? Number(selectedPlan.vlPremio).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
                                                        : "--"}
                                                </span>
                                            </>
                                        )
                                    }
                                </div>

                                {/* Slide de Planos */}
                                {produto.tpProduto === 260 && plans.length > 0 && (
                                    <div className="w-full">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm font-medium">Planos disponíveis</span>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="link" className="h-auto p-0 text-xs">
                                                        Ver todos ({plans.length})
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-2xl">
                                                    <DialogHeader>
                                                        <DialogTitle>Todos os Planos</DialogTitle>
                                                    </DialogHeader>
                                                    <ScrollArea className="max-h-[400px]">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-2">
                                                            {plans.map((plan) => (
                                                                <button
                                                                    key={plan.idProduto}
                                                                    className={cn(
                                                                        "border-2 p-4 rounded-lg text-left transition-all duration-200",
                                                                        selectedPlan?.idProduto === plan.idProduto 
                                                                            ? "border-[var(--cor-principal)] bg-primary/5" 
                                                                            : "border-border hover:bg-muted/50"
                                                                    )}
                                                                    onClick={() => handleSelectProductAndSlide(plan)}
                                                                >
                                                                    <div className="font-semibold text-sm mb-1">{plan.nmProduto}</div>
                                                                    <div className="text-xs text-muted-foreground line-clamp-2">{plan.dsProduto}</div>
                                                                    {plan.qtParcelas ? (
                                                                        <div className="text-xs font-medium mt-2">
                                                                            R$ {plan.vlParcela 
                                                                                ? Number(plan.vlParcela).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
                                                                                : "--"}
                                                                            /mês
                                                                        </div>
                                                                    ) : (
                                                                        <div className="text-xs font-medium mt-2">
                                                                            R$ {plan.vlPremio 
                                                                                ? Number(plan.vlPremio).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
                                                                                : "--"} à vista
                                                                        </div>
                                                                    )}
                                                                </button>
                                                            ))}
                                                        </div>
                                                        <ScrollBar />
                                                    </ScrollArea>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                        
                                        {/* Carrossel de Planos */}
                                        <div className="relative">
                                            <div className="overflow-hidden h-fit">
                                                <div 
                                                    className="flex flex-row transition-transform duration-300 ease-in-out"
                                                    style={{ transform: `translateX(-${currentSlideIndex * 100}%)` }}
                                                >
                                                    {plans.map((plan) => (
                                                        <button
                                                            key={plan.idProduto}
                                                            className="block text-left h-fit w-full flex-shrink-0 cursor-pointer transition-all duration-200 hover:bg-muted/30"
                                                            onClick={() => handleSelectProduct(plan)}
                                                        >
                                                            <div className={cn(
                                                                "border-2 rounded-lg p-3 transition-all duration-200 h-fit",
                                                                selectedPlan?.idProduto === plan.idProduto 
                                                                    ? "border-[var(--cor-principal)] bg-primary/5" 
                                                                    : "border-border hover:border-primary/30"
                                                            )}>
                                                                <div className="font-semibold text-sm mb-1">{plan.nmProduto}</div>
                                                                <div className="text-xs text-muted-foreground line-clamp-2 mb-2">{plan.dsProduto}</div>
                                                                {plan.qtParcelas ? (
                                                                    <div className="text-sm font-bold text-primary">
                                                                        R$ {plan.vlParcela 
                                                                            ? Number(plan.vlParcela).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
                                                                            : "--"}
                                                                        /mês
                                                                    </div>
                                                                ) : (
                                                                    <div className="text-sm font-bold text-primary">
                                                                        R$ {plan.vlPremio 
                                                                            ? Number(plan.vlPremio).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
                                                                            : "--"} à vista
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            
                                            {/* Navegação */}
                                            {plans.length > 1 && (
                                                <div className="flex justify-end gap-2 mt-3">
                                                    <div className="flex justify-center gap-2">
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    className="h-6 w-6 aspect-square"
                                                                    onClick={prevSlide}
                                                                >
                                                                    <ChevronLeft className="h-4 w-4" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Plano anterior</p>
                                                            </TooltipContent>
                                                        </Tooltip>                                                    
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    className="h-6 w-6 aspect-square"
                                                                    onClick={nextSlide}
                                                                >
                                                                    <ChevronRight className="h-4 w-4" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Próximo plano</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-col gap-2 w-full">
                                    <Button className="w-full" onClick={()=>{
                                        navigate(`/sales/product/${selectedPlan?.idProduto}`)
                                    }} disabled={!selectedPlan?.idProduto}>
                                        <span>
                                            {(Number(produto.tpCategoria) === 4 || Number(produto.tpCategoria) === 5 || Number(produto.tpProduto) === 4 || Number(produto.tpProduto) === 5) ? t("product.simulateNow") : t("product.buyNow")}
                                        </span>
                                    </Button>
                                    <DialogClose asChild>
                                        <Button variant="outline" className="w-full">
                                            <span>{t("product.cancel")}</span>
                                        </Button>
                                    </DialogClose>
                                </div>
                            </div>
                        </div>

                        {
                            productDetails && !isPending && !isError && (
                                <>
                                    <div className="flex flex-col gap-4 w-full mb-10 ">
                                        <span className="text-2xl font-bold mb-4">{t("product.features")}</span>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 w-full gap-y-6">
                                            {
                                                productDetails.caracteristicas?.map((caracteristica: any) => (
                                                    <div key={caracteristica.nome} className="flex flex-col md:flex-row gap-4 w-full items-start md:items-center text-sm">
                                                        <div className="w-7 h-7 aspect-square bg-muted rounded-full flex items-center justify-center">
                                                            <LuCheck className="text-lg text-zinc-500"/>
                                                        </div>
                                                        <div className="flex flex-row flex-wrap gap-x-2">
                                                            <span className="font-semibold">{caracteristica.nome}:</span>
                                                        <span className="">{caracteristica.valor}</span>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-4 w-full">
                                        <span className="text-2xl font-bold mb-4">{t("product.faq")}</span>
                                        <div className="flex flex-col gap-4 w-full">
                                            {
                                                productDetails.faq?.map((pergunta: any) => (
                                                    <div key={pergunta.question} className="flex flex-col gap-2 w-full">
                                                        <span className="font-semibold">{pergunta.question}</span>
                                                        <span className="text-sm text-muted-foreground ml-4">{pergunta.answer}</span>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </>
                            )
                        }

                        {
                            isPending && (
                                <div className="flex flex-col gap-4 w-full">
                                    <div className="w-1/5 h-8 bg-muted rounded-lg animate-pulse"></div>
                                    <div className="flex flex-row gap-4 w-full">
                                        <div className="w-1/3 h-8 bg-muted rounded-lg animate-pulse"></div>
                                        <div className="w-1/3 h-8 bg-muted rounded-lg animate-pulse"></div>
                                        <div className="w-1/3 h-8 bg-muted rounded-lg animate-pulse"></div>
                                    </div>
                                    <div className="flex flex-row gap-4 w-full">
                                        <div className="w-1/3 h-8 bg-muted rounded-lg animate-pulse"></div>
                                        <div className="w-2/3 h-8 bg-muted rounded-lg animate-pulse"></div>
                                    </div>
                                </div>
                            )
                        }

                        {
                            isError && (
                                <div className="flex flex-col gap-4 w-full">
                                    <span className="text-2xl font-bold mb-4">Erro ao carregar os detalhes do produto</span>
                                    <p className="text-sm text-muted-foreground">{error?.message}</p>
                                </div>
                            )
                        }

                        

                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}