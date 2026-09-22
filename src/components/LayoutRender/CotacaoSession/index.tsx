import { useEffect, useState, useMemo } from "react";
import { execApi } from "@/hooks/useApi";
import { SessaoType } from "@/types";
import { LuLoaderCircle, LuTrendingUp, LuShieldCheck, LuSparkles } from "react-icons/lu";
import { CheckCircle, Building2, CircleDollarSign, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { t } from "@/lib/i18n";

type CotacaoSessionProps = {
  allSessions?: Partial<SessaoType>[] | null;
  updateNormalField?: (campoApi: string, newValue: string) => void;
  idProduct?: string | null;
};

export default function CotacaoSession({ allSessions, updateNormalField, idProduct }: CotacaoSessionProps) {
  const getBankColor = (banco: string) => {
    const b = (banco || "").toLowerCase();
    if (b.includes("santander")) return "text-red-600 dark:text-red-500";
    if (b.includes("bv")) return "text-blue-600 dark:text-blue-400";
    if (b.includes("pan")) return "text-sky-500 dark:text-sky-400";
    return "text-muted-foreground";
  };

  const [loading, setLoading] = useState(true);
  const [simulacoesFin, setSimulacoesFin] = useState<any[]>([]);
  const [simulacoesSeguro, setSimulacoesSeguro] = useState<any[]>([]);
  const [selectedFinIds, setSelectedFinIds] = useState<number[]>([]);
  const [selectedSegIds, setSelectedSegIds] = useState<number[]>([]);

  // IA - Flags de recomendação
  const [bestForClientFinId, setBestForClientFinId] = useState<number | null>(null);
  const [bestForCompanyFinId, setBestForCompanyFinId] = useState<number | null>(null);

  // Extrai apenas os dados dos inputs para evitar loops infinitos quando allSessions atualiza seleções
  const payloadString = useMemo(() => {
    const payload: Record<string, any> = { idProduto: idProduct };
    allSessions?.forEach(sessao => {
      if (sessao.typeSession === "input" && sessao.campos) {
        sessao.campos.forEach(campo => {
          if (campo.campoApi && campo.conteudo) {
            payload[campo.campoApi] = campo.conteudo;
          }
        });
      }
    });
    return JSON.stringify(payload);
  }, [allSessions, idProduct]);

  useEffect(() => {
    async function loadCotacoes() {
      try {
        setLoading(true);
        const payload = JSON.parse(payloadString);

        const res: any = await execApi({
          url: "api/crm/financing/simulate",
          method: "POST",
          data: payload,
          isCrmApi: true,
        });

        if (res.data?.sucesso) {
          const sims = res.data.simulacoes || [];
          setSimulacoesFin(sims);
          
          if (sims.length > 0) {
            // IA: Melhor para o Cliente = Menor parcela
            const bestClient = sims.reduce((prev: any, curr: any) => {
              const prevVal = parseFloat(String(prev.valorParcela).replace(/[^0-9,.]/g, '').replace(',', '.'));
              const currVal = parseFloat(String(curr.valorParcela).replace(/[^0-9,.]/g, '').replace(',', '.'));
              return (currVal < prevVal) ? curr : prev;
            });
            
            // IA: Melhor para a Empresa = Maior taxa
            const bestCompany = sims.reduce((prev: any, curr: any) => {
              const prevVal = parseFloat(String(prev.taxa).replace(/[^0-9,.]/g, '').replace(',', '.'));
              const currVal = parseFloat(String(curr.taxa).replace(/[^0-9,.]/g, '').replace(',', '.'));
              return (currVal > prevVal) ? curr : prev;
            });

            setBestForClientFinId(bestClient.idCotacao);
            setBestForCompanyFinId(bestCompany.idCotacao);
            
            // Pré-seleciona a melhor para o cliente como sugestão inicial
            setSelectedFinIds([bestClient.idCotacao]);
          }

          if (res.data.seguros) {
            setSimulacoesSeguro(res.data.seguros);
            if (res.data.seguros.length > 0) {
              setSelectedSegIds([res.data.seguros[0].idCotacao]);
            }
          }
        } else {
          toast.error(t("product.errorLoadingLayout"));
        }
      } catch (error) {
        console.error(error);
        toast.error(t("product.errorLoadingLayout"));
      } finally {
        setLoading(false);
      }
    }

    loadCotacoes();
  }, [payloadString]);

  useEffect(() => {
    if (updateNormalField) {
      const numericProductId = Number(idProduct);
      const isCombo = numericProductId === 5 || numericProductId === 9;
      const financingSelected = simulacoesFin.filter(s => selectedFinIds.includes(s.idCotacao));
      const insuranceSelected = simulacoesSeguro.filter(s => selectedSegIds.includes(s.idCotacao));

      const isValid = isCombo
        ? (financingSelected.length > 0 && insuranceSelected.length > 0)
        : (financingSelected.length > 0);

      if (isValid) {
        const escolhas = {
          financiamentos: financingSelected,
          seguros: insuranceSelected
        };
        updateNormalField("cotacoesDisponibilizadas", JSON.stringify(escolhas));
      } else {
        updateNormalField("cotacoesDisponibilizadas", "");
      }
    }
  }, [selectedFinIds, selectedSegIds, simulacoesFin, simulacoesSeguro, updateNormalField, idProduct]);

  const toggleFinSelection = (id: number) => {
    setSelectedFinIds(prev => prev.includes(id) ? [] : [id]);
  };

  const toggleSegSelection = (id: number) => {
    setSelectedSegIds(prev => prev.includes(id) ? [] : [id]);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <LuLoaderCircle className="animate-spin text-4xl text-[var(--cor-principal)]" />
        <p className="text-muted-foreground">{t("product.loadQuotations")}</p>
      </div>
    );
  }

  if (simulacoesFin.length === 0 && simulacoesSeguro.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground">{t("product.noQuotations")}</p>
      </div>
    );
  }

  const selectedFin = simulacoesFin.find(sim => selectedFinIds.includes(sim.idCotacao));
  const selectedInsurance = simulacoesSeguro.find(sim => selectedSegIds.includes(sim.idCotacao));
  const insuranceMonthly = selectedInsurance ? selectedInsurance.valorPremio / 12 : 0;
  const packageMonthly = selectedFin ? Number(selectedFin.valorParcela) + insuranceMonthly : 0;

  return (
    <div className="w-full space-y-6">
      <div className="rounded-xl border bg-muted/30 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--cor-principal)]">Mesa F&amp;I</p>
            <h2 className="mt-1 text-2xl font-bold">Escolha a melhor condição para o cliente</h2>
            <p className="mt-1 text-sm text-muted-foreground">Selecione uma condição de financiamento e complemente a proposta com proteção para o caminhão.</p>
          </div>
          <Badge variant="outline" className="h-fit px-3 py-1.5">Simulação sem compromisso</Badge>
        </div>
      </div>
      <Tabs defaultValue="financiamento" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-sm mb-6">
          <TabsTrigger value="financiamento" className="text-sm font-semibold">
            Financiamento
          </TabsTrigger>
          <TabsTrigger 
            value="seguros" 
            className="text-sm font-semibold"
            disabled={simulacoesSeguro.length === 0}
          >
            Seguro Auto
          </TabsTrigger>
        </TabsList>

        <TabsContent value="financiamento" className="space-y-4 pt-2">
          {simulacoesFin.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <LuTrendingUp className="text-[var(--cor-principal)] text-xl" />
                <h2 className="text-xl font-semibold">{t("product.financingQuotes")}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {simulacoesFin.map((sim) => {
                  const isSelected = selectedFinIds.includes(sim.idCotacao);
                  const isBestClient = bestForClientFinId === sim.idCotacao;
                  const isBestCompany = bestForCompanyFinId === sim.idCotacao;
                  const isPerfectCombo = isBestClient && isBestCompany;

                  return (
                    <Card
                      key={sim.idCotacao}
                      className={`p-4 cursor-pointer border-2 transition-all duration-300 relative hover:shadow-lg ${
                        isSelected 
                          ? "border-[var(--cor-principal)] bg-[var(--cor-principal)]/5 dark:bg-[var(--cor-principal)]/10 shadow-md" 
                          : isPerfectCombo
                            ? "border-amber-300/80 bg-amber-50/10 dark:border-amber-900/50 hover:border-amber-400"
                            : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400"
                      }`}
                      onClick={() => toggleFinSelection(sim.idCotacao)}
                    >
                      <div className="absolute top-4 right-4 flex flex-col items-end gap-1.5">
                        {isPerfectCombo && (
                          <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white border-none rounded-full text-[10px] font-bold px-2 py-0.5 shadow-sm flex items-center gap-1">
                            <LuSparkles className="w-2.5 h-2.5" />
                            Recomendada
                          </Badge>
                        )}
                        {!isPerfectCombo && isBestClient && (
                          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-none rounded-full text-[9px] font-semibold px-2 py-0.5">
                            Menor parcela
                          </Badge>
                        )}
                        {!isPerfectCombo && isBestCompany && (
                          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-none rounded-full text-[9px] font-semibold px-2 py-0.5">
                            Maior retorno F&amp;I
                          </Badge>
                        )}
                      </div>
                      
                      {isSelected && (
                        <div className="absolute -top-3 -right-3 bg-white dark:bg-zinc-950 rounded-full">
                          <CheckCircle className="text-[var(--cor-principal)] text-2xl fill-white dark:fill-zinc-950" />
                        </div>
                      )}

                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center gap-1.5 mb-1">
                            <Building2 className={`w-3.5 h-3.5 ${getBankColor(sim.banco)}`} />
                            <p className={`text-[11px] font-bold uppercase tracking-wider ${getBankColor(sim.banco)}`}>{sim.banco}</p>
                          </div>
                          <p className="text-3xl font-bold text-[var(--cor-principal)] mt-1">
                            {sim.parcelas}x
                          </p>
                        </div>
                        <div className="space-y-1.5 pt-2 border-t border-dashed border-zinc-200 dark:border-zinc-800">
                          <p className="text-sm flex justify-between">
                            <span className="text-muted-foreground">{t("product.valueInstallment")}:</span>
                            <span className="font-semibold text-zinc-950 dark:text-zinc-50">R$ {Number(sim.valorParcela).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </p>
                          <p className="text-sm flex justify-between">
                            <span className="text-muted-foreground">{t("product.monthlyRate")}:</span>
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">{sim.taxa}</span>
                          </p>
                          <p className="text-sm flex justify-between">
                            <span className="text-muted-foreground">{t("product.downPayment")}:</span>
                            <span className="font-semibold text-zinc-600 dark:text-zinc-400">R$ {Number(sim.entrada).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </p>
                        </div>
                        {isPerfectCombo && sim.justificativa && (
                          <div className="mt-3 pt-2 border-t border-amber-100 dark:border-amber-950/30">
                            <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed font-medium">
                              ✨ {sim.justificativa}
                            </p>
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="seguros" className="space-y-4 pt-2">
          {simulacoesSeguro.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <LuShieldCheck className="text-[var(--cor-principal)] text-xl" />
                <h2 className="text-xl font-semibold">{t("product.insuranceQuotes")}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {simulacoesSeguro.map((sim) => {
                  const isSelected = selectedSegIds.includes(sim.idCotacao);
                  const isPorto = sim.seguradora === "Porto Seguro";
                  return (
                    <Card
                      key={sim.idCotacao}
                      className={`p-4 cursor-pointer border-2 transition-all duration-300 relative hover:shadow-lg ${
                        isSelected 
                          ? "border-[var(--cor-principal)] bg-[var(--cor-principal)]/5 dark:bg-[var(--cor-principal)]/10 shadow-md" 
                          : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400"
                      }`}
                      onClick={() => toggleSegSelection(sim.idCotacao)}
                    >
                      {isSelected && (
                        <div className="absolute -top-3 -right-3 bg-white dark:bg-zinc-950 rounded-full">
                          <CheckCircle className="text-[var(--cor-principal)] text-2xl fill-white dark:fill-zinc-950" />
                        </div>
                      )}
                      {isPorto && (
                        <div className="absolute top-4 right-4 flex items-center gap-1.5">
                          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-none rounded-full text-[9px] font-semibold px-2 py-0.5">
                            FIPE 100%
                          </Badge>
                        </div>
                      )}

                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center gap-1.5 mb-1">
                            <Building2 className="w-3.5 h-3.5 text-[var(--cor-principal)]" />
                            <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">{sim.seguradora}</p>
                          </div>
                          <p className="text-lg font-bold text-zinc-800 dark:text-zinc-200 mt-1 line-clamp-1">{sim.cobertura}</p>
                        </div>
                        <div className="space-y-1.5 pt-2 border-t border-dashed border-zinc-200 dark:border-zinc-800">
                          <p className="text-sm flex justify-between">
                            <span className="text-muted-foreground">{t("product.cashPayment")}:</span>
                            <span className="font-bold text-[var(--cor-principal)]">R$ {Number(sim.valorPremio).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </p>
                          <p className="text-sm flex justify-between">
                            <span className="text-muted-foreground">{t("product.deductible")}:</span>
                            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                              {Number(sim.valorFranquia) > 0 
                                ? `R$ ${Number(sim.valorFranquia).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                : "Isenta"
                              }
                            </span>
                          </p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="sticky bottom-0 z-10 rounded-xl border-2 border-[var(--cor-principal)]/20 bg-background/95 p-5 shadow-xl backdrop-blur">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="grid flex-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-[var(--cor-principal)]/10 p-2.5"><CircleDollarSign className="h-5 w-5 text-[var(--cor-principal)]" /></div>
              <div><p className="text-xs text-muted-foreground">Financiamento selecionado</p><p className="font-semibold">{selectedFin ? `${selectedFin.banco} · ${selectedFin.parcelas}x de R$ ${Number(selectedFin.valorParcela).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : "Selecione uma condição"}</p></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-500/10 p-2.5"><ShieldCheck className="h-5 w-5 text-emerald-600" /></div>
              <div><p className="text-xs text-muted-foreground">Proteção selecionada</p><p className="font-semibold">{selectedInsurance ? `${selectedInsurance.seguradora} · ${selectedInsurance.cobertura}` : "Sem seguro selecionado"}</p></div>
            </div>
          </div>
          <div className="border-t pt-4 text-right xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0">
            <p className="text-xs text-muted-foreground">Parcela estimada do pacote</p>
            <p className="text-2xl font-bold text-[var(--cor-principal)]">{selectedFin ? packageMonthly.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : "—"}<span className="text-sm font-normal text-muted-foreground">/mês</span></p>
            {selectedInsurance && <p className="text-xs text-muted-foreground">Financiamento + seguro em 12x</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
