import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { type Filters } from "../../../Sales/index";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CalendarIcon, Filter, RefreshCcw, Search } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePartnerStore } from "@/store/partnerStore";
import { useUsuarioStore } from "@/store/usuarioStore";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { format, subMonths } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { Label } from "@/components/ui/label";
import { fetchOperations, Operation } from "@/components/ChangeOpPartnerButton";

type FiltersProps = {
  filters?: Filters;
  setFilters?: Dispatch<SetStateAction<Filters>>;
}

export default function Filters({filters, setFilters}: Readonly<FiltersProps>) {
    const [isRefetching, setIsRefetching] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const queryClient = useQueryClient();
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const idParceiroOwner = usePartnerStore((state) => state.partnerId);
    const usuario = useUsuarioStore((state) => state.usuario);
    const [idOperationsSelected, setIdOperationsSelected] = useState<string[]>([]);
    const [date, setDate] = useState<DateRange | undefined>(undefined);

    const { data, isLoading: isLoadingOperations, isError, error } = useQuery<Operation[]>({
      queryKey: ["operationsToDisplay", idParceiroOwner],
      queryFn: () =>
        fetchOperations(idParceiroOwner, usuario?.idusuario.toString()),
      enabled: !!usuario && !!idParceiroOwner,
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 0,
    });

    const handleSelectOperation = (idOperation: string) => {
      if(idOperationsSelected.includes(idOperation)){
        setIdOperationsSelected(idOperationsSelected.filter((id) => id !== idOperation));
      } else {
        setIdOperationsSelected([...idOperationsSelected, idOperation]);
      }
    }

    // Função para executar busca/refetch
    const handleSearch = async () => {
      // Verifica se há filtros válidos
      if (!filters?.dataInicio || !filters?.dataFim || idOperationsSelected.length === 0) {
        console.warn("Filtros incompletos para busca");
        return;
      }

      setIsRefetching(true);
      setIsLoading(true);
      
      try {
        // Aplica as operações selecionadas aos filtros antes da busca
        setFilters?.((prev) => ({...prev, idsOperacoes: idOperationsSelected}));
        
        // Invalida todas as queries relacionadas
        queryClient.invalidateQueries({ queryKey: ["ProposalsCockpit"] });
        
        // Marca que já foi feita uma busca
        setHasSearched(true);
        
        // Pequeno delay para mostrar o loading
        setTimeout(() => {
          setIsRefetching(false);
          setIsLoading(false);
          setIsPopoverOpen(false);
        }, 500);
        
      } catch (error) {
        console.error("Erro ao executar busca:", error);
        setIsRefetching(false);
        setIsLoading(false);
      }
    };

    // Reset do estado quando partner muda
    useEffect(() => {
      setHasSearched(false);
      setIdOperationsSelected([]);
      setDate(undefined);
      setIsPopoverOpen(false);
    }, [idParceiroOwner]);

    // Função para formatar o label do range de datas
    const getDateRangeLabel = () => {
      if (!date?.from) {
        return "Selecione um período";
      }
      
      if (date.from && date.to) {
        const fromDate = format(date.from, "dd/MM/yyyy");
        const toDate = format(date.to, "dd/MM/yyyy");
        return `${fromDate} até ${toDate}`;
      }
      
      if (date.from) {
        const fromDate = format(date.from, "dd/MM/yyyy");
        return `${fromDate} até ...`;
      }
      
      return "Selecione um período";
    };

    // Função para formatar o label das operações selecionadas
    const getOperationsLabel = () => {
      if (idOperationsSelected.length === 0) {
        return "Selecione operações";
      }

      const selectedOperations = idOperationsSelected
        .map((id) => data?.find((operation) => operation.idoperacao === parseInt(id))?.nmoperacao)
        .filter(Boolean) as string[];

      if (selectedOperations.length === 0) {
        return "Selecione operações";
      }

      const operationsText = selectedOperations.join(", ");
      
      if (operationsText.length <= 20) {
        return operationsText;
      }

      // Trunca o texto e adiciona a quantidade
      const truncatedText = operationsText.substring(0, 20).trim();
      const lastCommaIndex = truncatedText.lastIndexOf(",");
      
      if (lastCommaIndex > 0) {
        const finalText = truncatedText.substring(0, lastCommaIndex);
        return `${finalText}... (${selectedOperations.length})`;
      }
      
      return `${truncatedText}... (${selectedOperations.length})`;
    };

    // Effect para inicializar o date com os valores dos filtros existentes (apenas uma vez)
    useEffect(() => {
      if (filters?.dataInicio && filters?.dataFim && !date) {
        try {
          const dataInicio = new Date(filters.dataInicio);
          const dataFim = new Date(filters.dataFim);
          
          // Verifica se as datas são válidas
          if (!isNaN(dataInicio.getTime()) && !isNaN(dataFim.getTime())) {
            setDate({ from: dataInicio, to: dataFim });
          }
        } catch (error) {
          // Se houver erro na conversão, mantém o date como undefined
          setDate(undefined);
        }
      }
    }, [filters?.dataInicio, filters?.dataFim, date]);

    // Effect para sincronizar operações selecionadas com filtros
    useEffect(() => {
      if (filters?.idsOperacoes) {
        setIdOperationsSelected(filters.idsOperacoes);
      }
    }, [filters?.idsOperacoes]);

    // Effect para atualizar filtros quando o range de datas for selecionado
    useEffect(() => {
      if (date?.from && date?.to) {
        const dataInicio = format(date.from, 'yyyy-MM-dd');
        const dataFim = format(date.to, 'yyyy-MM-dd');
        
        // Só atualiza se os valores forem diferentes dos atuais
        setFilters?.((prev) => ({...prev, dataInicio, dataFim}));
      }
    }, [date]);
    
  return (
    <>
      <div className="flex md:hidden items-center gap-2">
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="aspect-square">
              <Filter />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end">
            <div className="flex items-center gap-2 flex-col">
              <Label className="flex flex-col items-start gap-2 w-full mb-2">
                <span>Período</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {getDateRangeLabel()}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="range"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => {
                        const today = new Date();
                        const threeMonthsAgo = subMonths(today, 3);
                        return date < threeMonthsAgo || date > today;
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </Label>
              
              <Label className="flex flex-col items-start gap-2 w-full mb-4">
                <span>Operações</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full truncate text-left">
                      <p>{getOperationsLabel()}</p>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    {
                      isLoadingOperations && (
                        <div className="flex flex-col gap-2">
                          <div className="w-full h-4 bg-muted rounded-sm animate-pulse"></div>
                          <div className="w-full h-4 bg-muted rounded-sm animate-pulse"></div>
                        </div>
                      )
                    }
                    {
                      !isLoadingOperations && data && data.length > 0 && (
                        <ScrollArea className="h-fit max-h-[250px] personal_scrollbar">
                          {data.map((operation) => (
                            <div key={operation.idoperacao} className="flex flex-row items-center gap-2 mb-2">
                              <Checkbox id={operation.idoperacao.toString()} checked={idOperationsSelected.includes(operation.idoperacao.toString())} onCheckedChange={() => handleSelectOperation(operation.idoperacao.toString())} />
                              <label htmlFor={operation.idoperacao.toString()}>{operation.nmoperacao}</label>
                            </div>
                          ))}
                        </ScrollArea>
                      )
                    }
                    {
                      !isLoadingOperations && data && data.length === 0 && (
                        <div className="flex flex-col gap-2">
                          <p className="text-muted-foreground">Nenhuma operação encontrada</p>
                        </div>
                      )
                    }
                    {
                      isError && error && (
                        <div className="flex flex-col gap-2">
                          <p className="text-muted-foreground">Erro ao carregar operações</p>
                        </div>
                      )
                    }
                  </PopoverContent>
                </Popover>
              </Label>

              <Button 
                onClick={handleSearch} 
                className="w-full"
                disabled={
                  isRefetching || 
                  isLoading || 
                  !filters?.dataInicio || 
                  !filters?.dataFim || 
                  idOperationsSelected.length === 0
                }
              >
                {hasSearched ? (
                  <span className="flex items-center gap-2">
                    <RefreshCcw className={`${(isRefetching || isLoading) ? "animate-spin" : ""}`}/>
                    Atualizar dados
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Search />
                    Buscar dados
                  </span>
                )}
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="hidden md:flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {getDateRangeLabel()}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="range"
              selected={date}
              onSelect={setDate}
              disabled={(date) => {
                const today = new Date();
                const threeMonthsAgo = subMonths(today, 3);
                return date < threeMonthsAgo || date > today;
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full max-w-[200px] truncate text-left">
              <p>{getOperationsLabel()}</p>
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            {
              isLoadingOperations && (
                <div className="flex flex-col gap-2">
                  <div className="w-full h-4 bg-muted rounded-sm animate-pulse"></div>
                  <div className="w-full h-4 bg-muted rounded-sm animate-pulse"></div>
                </div>
              )
            }
            {
              !isLoadingOperations && data && data.length > 0 && (
                <ScrollArea className="h-fit max-h-[250px] personal_scrollbar">
                  <div className="h-fit">
                    {data.map((operation) => (
                      <div key={operation.idoperacao} className="flex flex-row items-center gap-2 mb-2">
                        <Checkbox id={operation.idoperacao.toString()} checked={idOperationsSelected.includes(operation.idoperacao.toString())} onCheckedChange={() => handleSelectOperation(operation.idoperacao.toString())} />
                        <label htmlFor={operation.idoperacao.toString()}>{operation.nmoperacao}</label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )
            }
            {
              !isLoadingOperations && data && data.length === 0 && (
                <div className="flex flex-col gap-2">
                  <p className="text-muted-foreground">Nenhuma operação encontrada</p>
                </div>
              )
            }
            {
              isError && error && (
                <div className="flex flex-col gap-2">
                  <p className="text-muted-foreground">Erro ao carregar operações</p>
                </div>
              )
            }
          </PopoverContent>
        </Popover>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              onClick={handleSearch} 
              className="aspect-square" 
              size="icon" 
              disabled={
                isRefetching || 
                isLoading || 
                !filters?.dataInicio || 
                !filters?.dataFim || 
                idOperationsSelected.length === 0
              }
            >
              {hasSearched ? (
                <RefreshCcw className={`${(isRefetching || isLoading) ? "animate-spin" : ""}`}/>
              ) : (
                <Search />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {!filters?.dataInicio || !filters?.dataFim 
                ? "Selecione um período" 
                : idOperationsSelected.length === 0 
                  ? "Selecione operações" 
                  : hasSearched 
                    ? "Atualizar dados" 
                    : "Buscar dados"
              }
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
    </>
  );
}