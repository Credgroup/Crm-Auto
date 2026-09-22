import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LuTrendingUp, LuShieldCheck, LuSparkles, LuCheck } from "react-icons/lu";
import { t } from "@/lib/i18n";

type ProposalQuotesTabProps = {
  proposal: any;
};

export default function ProposalQuotesTab({ proposal }: ProposalQuotesTabProps) {
  let escolhas: any = null;
  try {
    if (proposal.cotacaoEscolhida) {
      escolhas = typeof proposal.cotacaoEscolhida === "string" 
        ? JSON.parse(proposal.cotacaoEscolhida) 
        : proposal.cotacaoEscolhida;
    }
  } catch (e) {
    console.error("Erro ao fazer parse de cotacaoEscolhida", e);
  }

  const finEscolhidaId = escolhas?.financiamento?.idCotacao || escolhas?.financiamento?.id || null;
  const segEscolhidaId = escolhas?.seguro?.idCotacao || escolhas?.seguro?.id || null;

  const simulacoesFin = proposal.simulacoesFinanciamento || [];
  const simulacoesSeg = proposal.simulacoesSeguro || [];

  const hasFin = simulacoesFin.length > 0;
  const hasSeg = simulacoesSeg.length > 0;

  if (!hasFin && !hasSeg) {
    return (
      <div className="flex flex-col justify-center items-center py-12 text-center">
        <LuShieldCheck className="text-muted-foreground w-12 h-12 mb-3" />
        <p className="text-zinc-600 dark:text-zinc-400 font-medium">
          {t("product.noQuotations")}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Esta proposta não possui simulações de F&I salvas no histórico.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4">
      <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{t("product.quoteDetails")}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Histórico comparativo de taxas e prêmios gerados para o lead.</p>
      </div>

      {/* Financiamento */}
      {hasFin && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <LuTrendingUp className="text-[var(--cor-principal)] w-5 h-5" />
            <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{t("product.financingQuotes")}</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {simulacoesFin.map((sim: any) => {
              const isSelected = sim.idCotacao === finEscolhidaId;
              const isBV = sim.banco === "Banco BV";
              return (
                <Card
                  key={sim.idCotacao}
                  className={`p-5 border-2 transition-all relative ${
                    isSelected
                      ? "border-[var(--cor-principal)] bg-blue-50/20 dark:bg-blue-900/10 shadow-sm"
                      : isBV
                        ? "border-amber-200 bg-amber-50/5 dark:border-amber-900/20"
                        : "border-zinc-200 dark:border-zinc-800"
                  }`}
                >
                  <div className="absolute top-4 right-4 flex gap-1.5 items-center">
                    {isBV && (
                      <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-full text-[9px] border-none font-bold px-2 py-0.5">
                        <LuSparkles className="w-2 h-2 mr-1" />
                        {t("product.recommended")}
                      </Badge>
                    )}
                    {isSelected && (
                      <Badge className="bg-emerald-500 text-white rounded-full text-[9px] border-none font-bold px-2 py-0.5 flex items-center gap-0.5">
                        <LuCheck className="w-2.5 h-2.5" />
                        Escolhida
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{sim.banco}</p>
                      <p className="text-2xl font-bold text-[var(--cor-principal)] mt-0.5">{sim.parcelas}x</p>
                    </div>

                    <div className="space-y-1 text-xs border-t border-dashed border-zinc-200 dark:border-zinc-800 pt-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t("product.valueInstallment")}:</span>
                        <span className="font-semibold text-zinc-950 dark:text-zinc-50">R$ {sim.valorParcela}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t("product.monthlyRate")}:</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">{sim.taxa}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t("product.downPayment")}:</span>
                        <span className="font-semibold text-zinc-600 dark:text-zinc-400">R$ {sim.entrada.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                    {isBV && sim.justificativa && (
                      <p className="text-[10px] text-amber-700 dark:text-amber-400 italic mt-1 font-medium bg-amber-500/5 p-1.5 rounded">
                        ✨ {sim.justificativa}
                      </p>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Seguro */}
      {hasSeg && (
        <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <LuShieldCheck className="text-[var(--cor-principal)] w-5 h-5" />
            <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{t("product.insuranceQuotes")}</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {simulacoesSeg.map((sim: any) => {
              const isSelected = sim.idCotacao === segEscolhidaId;
              const isPorto = sim.seguradora === "Porto Seguro";
              return (
                <Card
                  key={sim.idCotacao}
                  className={`p-5 border-2 transition-all relative ${
                    isSelected
                      ? "border-[var(--cor-principal)] bg-blue-50/20 dark:bg-blue-900/10 shadow-sm"
                      : "border-zinc-200 dark:border-zinc-800"
                  }`}
                >
                  <div className="absolute top-4 right-4 flex gap-1.5 items-center">
                    {isPorto && (
                      <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-[9px] border-none font-semibold px-2 py-0.5">
                        FIPE 100%
                      </Badge>
                    )}
                    {isSelected && (
                      <Badge className="bg-emerald-500 text-white rounded-full text-[9px] border-none font-bold px-2 py-0.5 flex items-center gap-0.5">
                        <LuCheck className="w-2.5 h-2.5" />
                        Escolhida
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{sim.seguradora}</p>
                      <p className="text-base font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{sim.cobertura}</p>
                    </div>

                    <div className="space-y-1 text-xs border-t border-dashed border-zinc-200 dark:border-zinc-800 pt-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t("product.cashPayment")}:</span>
                        <span className="font-bold text-[var(--cor-principal)]">R$ {sim.valorPremio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t("product.deductible")}:</span>
                        <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                          {sim.valorFranquia > 0 
                            ? `R$ ${sim.valorFranquia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                            : "Isenta"
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
