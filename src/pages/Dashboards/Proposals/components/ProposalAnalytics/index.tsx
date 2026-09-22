import { useQuery } from "@tanstack/react-query";
import { execApi } from "@/hooks/useApi";
import DashboardCard from "@/pages/Dashboards/components/DashboardCard";
import { cn } from "@/lib/utils";
import { Filters } from "../../index";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie
} from "recharts";
import { TrendingUpIcon, BuildingIcon, ShieldCheckIcon, ClockIcon, TargetIcon, UsersIcon, StarIcon, ArrowUpIcon } from "lucide-react";

type Props = {
  filters?: Filters;
  className?: string;
};

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316", "#ec4899"];

export default function ProposalAnalytics({ filters, className }: Readonly<Props>) {
  const hasValidFilters = filters?.idsOperacoes && filters.idsOperacoes.length > 0 && !!filters.dataInicio && !!filters.dataFim;

  const { data, isLoading } = useQuery({
    queryKey: ["ProposalAnalytics", filters?.dataInicio, filters?.dataFim, filters?.idsOperacoes],
    queryFn: async () => {
      const res: any = await execApi({
        url: "api/crm/dashboard/proposals/analytics",
        method: "POST",
        data: { dataInicio: filters?.dataInicio, dataFim: filters?.dataFim, idOperacao: filters?.idsOperacoes },
        isCrmApi: true,
      });
      return res.data?.dados;
    },
    enabled: hasValidFilters,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  if (!hasValidFilters) return null;

  if (isLoading) {
    return (
      <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-4", className)}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-72 bg-muted animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* KPIs Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <DashboardCard>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/15 flex items-center justify-center">
              <ClockIcon className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Tempo Médio Aprovação</p>
              <p className="text-xl font-bold">{data.tempoMedioAprovacao}</p>
            </div>
          </div>
        </DashboardCard>
        <DashboardCard>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/15 flex items-center justify-center">
              <TargetIcon className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Ticket Médio</p>
              <p className="text-xl font-bold">{data.ticketMedioGeral?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
            </div>
          </div>
        </DashboardCard>
        <DashboardCard>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/15 flex items-center justify-center">
              <BuildingIcon className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Bancos Ativos</p>
              <p className="text-xl font-bold">{data.topBancos?.length || 0}</p>
            </div>
          </div>
        </DashboardCard>
        <DashboardCard>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/15 flex items-center justify-center">
              <ShieldCheckIcon className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Seguradoras Ativas</p>
              <p className="text-xl font-bold">{data.topSeguradoras?.length || 0}</p>
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Bancos */}
        <DashboardCard>
          <div className="flex items-center gap-2 mb-4">
            <BuildingIcon className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-sm">Ranking de Bancos (Financiamento)</h3>
          </div>
          <div className="space-y-3">
            {data.topBancos?.map((banco: any, index: number) => (
              <div key={banco.banco} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm truncate">{banco.banco}</span>
                    <span className="text-xs font-semibold text-green-500 flex items-center gap-0.5">
                      <ArrowUpIcon className="w-3 h-3" />
                      {banco.taxaAprovacao}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all" style={{ width: `${banco.taxaAprovacao}%` }} />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-muted-foreground">{banco.qtdAprovadas}/{banco.qtdCotacoes} aprovadas</span>
                    <span className="text-[10px] text-muted-foreground">{(banco.vlTotalFinanciado / 1e6).toFixed(1)}M financiado</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        {/* Top Seguradoras */}
        <DashboardCard>
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheckIcon className="w-5 h-5 text-emerald-500" />
            <h3 className="font-semibold text-sm">Ranking de Seguradoras</h3>
          </div>
          <div className="space-y-3">
            {data.topSeguradoras?.map((seg: any, index: number) => (
              <div key={seg.seguradora} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <span className="font-medium text-sm">{seg.seguradora}</span>
                      <span className="text-[10px] text-muted-foreground ml-2">({seg.cobertura})</span>
                    </div>
                    <span className="text-xs font-semibold text-emerald-500 flex items-center gap-0.5">
                      <ArrowUpIcon className="w-3 h-3" />
                      {seg.taxaAceite}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all" style={{ width: `${seg.taxaAceite}%` }} />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-muted-foreground">{seg.qtdAceitas}/{seg.qtdCotacoes} aceitas</span>
                    <span className="text-[10px] text-muted-foreground">Ticket: {seg.ticketMedio?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        {/* Tendência Mensal */}
        <DashboardCard>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUpIcon className="w-5 h-5 text-violet-500" />
            <h3 className="font-semibold text-sm">Tendência de Propostas (Mensal)</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.tendenciaMensal} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="mes" tick={{ fontSize: 11 }} stroke="rgba(255,255,255,0.3)" />
              <YAxis tick={{ fontSize: 11 }} stroke="rgba(255,255,255,0.3)" />
              <Tooltip
                contentStyle={{ background: "rgba(24,24,27,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px" }}
              />
              <Bar dataKey="propostas" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Total" />
              <Bar dataKey="aprovadas" fill="#10b981" radius={[4, 4, 0, 0]} name="Aprovadas" />
            </BarChart>
          </ResponsiveContainer>
        </DashboardCard>

        {/* Distribuição por Produto */}
        <DashboardCard>
          <div className="flex items-center gap-2 mb-4">
            <StarIcon className="w-5 h-5 text-amber-500" />
            <h3 className="font-semibold text-sm">Distribuição por Produto</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={data.distribuicaoProduto}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                dataKey="valor"
                nameKey="produto"
                label={({ produto, percentual }: any) => `${produto} (${percentual}%)`}
                labelLine={false}
              >
                {data.distribuicaoProduto?.map((_: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "rgba(24,24,27,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </DashboardCard>

        {/* Cotações Mais Aceitas */}
        <DashboardCard>
          <div className="flex items-center gap-2 mb-4">
            <TargetIcon className="w-5 h-5 text-cyan-500" />
            <h3 className="font-semibold text-sm">Cotações Mais Aceitas</h3>
          </div>
          <div className="space-y-2">
            {data.cotacoesMaisAceitas?.slice(0, 6).map((cot: any, index: number) => (
              <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <div className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                  cot.tipo === "Financiamento" ? "bg-blue-500/15 text-blue-400" : "bg-emerald-500/15 text-emerald-400"
                )}>
                  {cot.tipo === "Financiamento" ? "FIN" : "SEG"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{cot.descricao}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold">{cot.qtdAceitas}</p>
                  <p className="text-[10px] text-muted-foreground">{cot.percentualTotal}%</p>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        {/* Performance por Vendedor */}
        <DashboardCard>
          <div className="flex items-center gap-2 mb-4">
            <UsersIcon className="w-5 h-5 text-rose-500" />
            <h3 className="font-semibold text-sm">Performance por Vendedor</h3>
          </div>
          <div className="space-y-3">
            {data.propostasPorVendedor?.map((v: any) => (
              <div key={v.vendedor} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {v.vendedor.split(" ").map((w: string) => w[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm truncate">{v.vendedor}</span>
                    <div className="flex items-center gap-2">
                      <span className={cn("text-xs font-bold", v.taxa >= 80 ? "text-green-500" : v.taxa >= 70 ? "text-amber-500" : "text-red-500")}>
                        {v.taxa}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-400 transition-all" style={{ width: `${v.taxa}%` }} />
                  </div>
                  <div className="flex gap-3 mt-1">
                    <span className="text-[10px] text-muted-foreground">{v.total} total</span>
                    <span className="text-[10px] text-green-500">{v.aprovadas} ✓</span>
                    <span className="text-[10px] text-amber-500">{v.pendentes} pendentes</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
