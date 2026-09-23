import { useEffect, useState, useMemo } from "react";
import { execApi } from "@/hooks/useApi";
import { SessaoType } from "@/types";
import { LuLoaderCircle, LuTrendingUp, LuShieldCheck, LuCheck } from "react-icons/lu";
import { Building2, CircleDollarSign, ShieldCheck, Car, Check } from "lucide-react";
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
    if (b.includes("mercedes")) return "text-[var(--cor-principal)]";
    if (b.includes("santander")) return "text-red-600 dark:text-red-500";
    if (b.includes("bv")) return "text-blue-600 dark:text-blue-400";
    if (b.includes("pan")) return "text-sky-500 dark:text-sky-400";
    return "text-muted-foreground";
  };

  const [loading, setLoading] = useState(true);
  const [veiculoInfo, setVeiculoInfo] = useState<any>({
    modelo: "Mercedes-Benz Actros 2653 6x4",
    placa: "BRA2E19",
    financiamentoExistente: "Banco Mercedes-Benz · 60x de R$ 8.940,00 (Contratado)"
  });
  const [simulacoesFin, setSimulacoesFin] = useState<any[]>([]);
  const [simulacoesSeguro, setSimulacoesSeguro] = useState<any[]>([]);
  const [selectedFinIds, setSelectedFinIds] = useState<number[]>([]);
  const [selectedSegIds, setSelectedSegIds] = useState<number[]>([]);

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
          if (res.data.veiculoInfo) {
            setVeiculoInfo(res.data.veiculoInfo);
          }
          const sims = res.data.simulacoes || [];
          setSimulacoesFin(sims);
          
          if (sims.length > 0) {
            setSelectedFinIds([sims[0].idCotacao]);
          }

          if (res.data.seguros) {
            setSimulacoesSeguro(res.data.seguros);
            if (res.data.seguros.length > 0) {
              // Pré-seleciona a primeira seguradora (ex: Porto Seguro ou Tokio Marine)
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
      const financingSelected = simulacoesFin.filter(s => selectedFinIds.includes(s.idCotacao));
      const insuranceSelected = simulacoesSeguro.filter(s => selectedSegIds.includes(s.idCotacao));
      const chosenFin = financingSelected[0] || simulacoesFin[0] || null;
      const chosenSeg = insuranceSelected[0] || simulacoesSeguro[0] || null;

      const escolhas = {
        veiculoInfo,
        financiamentos: simulacoesFin,
        seguros: simulacoesSeguro,
        selectedFin: chosenFin,
        selectedSeg: chosenSeg,
      };
      updateNormalField("cotacoesDisponibilizadas", JSON.stringify(escolhas));
    }
  }, [selectedFinIds, selectedSegIds, simulacoesFin, simulacoesSeguro, updateNormalField, veiculoInfo]);

  const toggleFinSelection = (id: number) => {
    setSelectedFinIds([id]);
  };

  const toggleSegSelection = (id: number) => {
    setSelectedSegIds([id]);
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

  const selectedFin = simulacoesFin.find(sim => selectedFinIds.includes(sim.idCotacao)) || simulacoesFin[0];
  const selectedInsurance = simulacoesSeguro.find(sim => selectedSegIds.includes(sim.idCotacao)) || simulacoesSeguro[0];
  const insuranceMonthly = selectedInsurance ? selectedInsurance.valorPremio / 12 : 0;
  const packageMonthly = selectedFin ? Number(selectedFin.valorParcela) + insuranceMonthly : insuranceMonthly;

  const isInsurancePrimary = simulacoesSeguro.length > 0;

  return (
    <div className="w-full space-y-6">
      {/* Banner de Financiamento Já Contratado */}
      <div className="rounded-2xl border-2 border-[var(--cor-principal)]/30 bg-gradient-to-r from-[var(--cor-principal)]/5 via-primary/5 to-transparent p-5 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--cor-principal)] flex items-center justify-center text-white shadow-md">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5">Financiamento Contratado</Badge>
                <span className="text-xs font-semibold text-zinc-500">Placa: {veiculoInfo.placa || "BRA2E19"}</span>
              </div>
              <h2 className="mt-1 text-xl font-bold text-zinc-900 dark:text-white">{veiculoInfo.modelo || "Mercedes-Benz Actros 2653 6x4"}</h2>
              <p className="text-sm font-medium text-muted-foreground">{veiculoInfo.financiamentoExistente || "Banco Mercedes-Benz · 60x de R$ 8.940,00 (Ativo)"}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-muted-foreground block font-semibold uppercase">Mesa Multi-Cálculo F&amp;I</span>
            <Badge variant="outline" className="h-fit px-3 py-1 font-semibold text-xs border-[var(--cor-principal)]/40 text-[var(--cor-principal)]">
              3 Seguradoras Cotadas
            </Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue={isInsurancePrimary ? "seguros" : "financiamento"} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mb-6">
          <TabsTrigger 
            value="seguros" 
            className="text-sm font-semibold"
            disabled={simulacoesSeguro.length === 0}
          >
            {Number(idProduct) === 10 ? "Seguro Auto (3 Cotações)" : "Seguro Caminhão (3 Cotações)"}
          </TabsTrigger>
          <TabsTrigger value="financiamento" className="text-sm font-semibold">
            Financiamento Ativo
          </TabsTrigger>
        </TabsList>

        {/* 3 PROPOSTAS DE SEGURADORAS DISTINTAS */}
        <TabsContent value="seguros" className="space-y-4 pt-2">
          {simulacoesSeguro.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <LuShieldCheck className="text-[var(--cor-principal)] text-2xl" />
                  <div>
                    <h2 className="text-xl font-bold">Propostas de Seguradoras para o Veículo</h2>
                    <p className="text-xs text-muted-foreground">Selecione uma das 3 propostas. A tela externa do cliente será sincronizada com a sua escolha.</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {simulacoesSeguro.map((sim) => {
                  const isSelected = selectedSegIds.includes(sim.idCotacao);
                  return (
                    <Card
                      key={sim.idCotacao}
                      className={`p-5 cursor-pointer border-2 transition-all duration-300 relative rounded-2xl flex flex-col justify-between hover:shadow-xl ${
                        isSelected 
                          ? "border-[var(--cor-principal)] bg-[var(--cor-principal)]/5 dark:bg-[var(--cor-principal)]/10 shadow-lg ring-2 ring-[var(--cor-principal)]" 
                          : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 bg-white dark:bg-zinc-900"
                      }`}
                      onClick={() => toggleSegSelection(sim.idCotacao)}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3 bg-[var(--cor-principal)] text-white rounded-full p-1 shadow-md">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      )}

                      <div>
                        <div className="flex items-center justify-between mb-3 pr-6">
                          <Badge variant="outline" className="text-xs font-bold uppercase tracking-wider py-1 px-2.5 bg-muted/60">
                            {sim.seguradora}
                          </Badge>
                          {sim.destaque && (
                            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-none text-[10px] font-bold">
                              {sim.destaque}
                            </Badge>
                          )}
                        </div>

                        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-2 leading-tight">
                          {sim.cobertura}
                        </h3>

                        {sim.beneficios && (
                          <div className="space-y-1.5 my-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                            {sim.beneficios.map((b: string, i: number) => (
                              <div key={i} className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                                <LuCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                                <span>{b}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-dashed border-zinc-200 dark:border-zinc-800 mt-2 space-y-2">
                        <div className="flex justify-between items-baseline">
                          <span className="text-xs text-muted-foreground font-semibold">Prêmio Anual:</span>
                          <span className="text-lg font-black text-[var(--cor-principal)]">
                            R$ {Number(sim.valorPremio).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground">Parcelamento:</span>
                          <span className="font-bold text-zinc-800 dark:text-zinc-200">12x de R$ {(sim.valorPremio / 12).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground">Franquia:</span>
                          <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                            {Number(sim.valorFranquia) > 0 
                              ? `R$ ${Number(sim.valorFranquia).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                              : "Isenta"
                            }
                          </span>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </TabsContent>

        {/* FINANCIAMENTO EXISTENTE / ATIVO */}
        <TabsContent value="financiamento" className="space-y-4 pt-2">
          {simulacoesFin.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <LuTrendingUp className="text-[var(--cor-principal)] text-xl" />
                <h2 className="text-xl font-semibold">Condição de Financiamento do Veículo</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {simulacoesFin.map((sim) => {
                  const isSelected = selectedFinIds.includes(sim.idCotacao);
                  return (
                    <Card
                      key={sim.idCotacao}
                      className={`p-5 cursor-pointer border-2 transition-all duration-300 relative rounded-2xl ${
                        isSelected 
                          ? "border-[var(--cor-principal)] bg-[var(--cor-principal)]/5 dark:bg-[var(--cor-principal)]/10 shadow-md" 
                          : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400"
                      }`}
                      onClick={() => toggleFinSelection(sim.idCotacao)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1.5">
                          <Building2 className={`w-4 h-4 ${getBankColor(sim.banco)}`} />
                          <p className={`text-xs font-bold uppercase tracking-wider ${getBankColor(sim.banco)}`}>{sim.banco}</p>
                        </div>
                        {sim.status && (
                          <Badge className="bg-emerald-600 text-white text-[10px] font-bold">
                            {sim.status}
                          </Badge>
                        )}
                      </div>

                      <div className="flex justify-between items-end mb-3">
                        <div>
                          <p className="text-3xl font-black text-zinc-900 dark:text-zinc-100">{sim.parcelas}x</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground font-bold uppercase">Parcela</p>
                          <p className="text-2xl font-black text-[var(--cor-principal)]">R$ {Number(sim.valorParcela).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-dashed border-zinc-200 dark:border-zinc-800 flex justify-between text-xs font-semibold text-zinc-500">
                        <span>Entrada: R$ {Number(sim.entrada).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        <span>Taxa: {sim.taxa}</span>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Resumo Fixo Inferior */}
      <div className="sticky bottom-0 z-10 rounded-2xl border-2 border-[var(--cor-principal)]/30 bg-background/95 p-5 shadow-2xl backdrop-blur">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="grid flex-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[var(--cor-principal)]/10 p-3"><CircleDollarSign className="h-6 w-6 text-[var(--cor-principal)]" /></div>
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase">Financiamento Ativo</p>
                <p className="font-semibold text-sm">{selectedFin ? `${selectedFin.banco} · ${selectedFin.parcelas}x de R$ ${Number(selectedFin.valorParcela).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : "Banco Mercedes-Benz (Ativo)"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-500/10 p-3"><ShieldCheck className="h-6 w-6 text-emerald-600" /></div>
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase">Seguradora Selecionada</p>
                <p className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                  {selectedInsurance ? `${selectedInsurance.seguradora} · R$ ${Number(selectedInsurance.valorPremio).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (12x)` : "Selecione uma seguradora"}
                </p>
              </div>
            </div>
          </div>
          <div className="border-t pt-4 text-right xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0">
            <p className="text-xs text-muted-foreground font-bold uppercase">Total Mensal Estimado</p>
            <p className="text-2xl font-black text-[var(--cor-principal)]">
              {packageMonthly.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              <span className="text-xs font-normal text-muted-foreground">/mês</span>
            </p>
            <p className="text-[11px] text-muted-foreground">Financiamento + Seguro Selecionado</p>
          </div>
        </div>
      </div>
    </div>
  );
}
