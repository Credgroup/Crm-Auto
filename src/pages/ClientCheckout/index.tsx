import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Building2, CheckCircle2, ShieldCheck, Car, Calendar, DollarSign, ArrowRight, Ban, User, MapPin, Gauge, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

// --- Máscaras ---
function maskCPF(v: string) {
  return v.replace(/\D/g, '').slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}
function maskPhone(v: string) {
  return v.replace(/\D/g, '').slice(0, 11).replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d{1,4})$/, '$1-$2');
}
function maskCEP(v: string) {
  return v.replace(/\D/g, '').slice(0, 8).replace(/(\d{5})(\d{1,3})$/, '$1-$2');
}
function maskDate(v: string) {
  return v.replace(/\D/g, '').slice(0, 8).replace(/(\d{2})(\d)/, '$1/$2').replace(/(\d{2})(\d)/, '$1/$2');
}
function maskKM(v: string) {
  const nums = v.replace(/\D/g, '');
  return nums ? parseInt(nums).toLocaleString('pt-BR') : '';
}

type ClientInfo = {
  nome: string; cpf: string; dataNascimento: string; rg: string;
  telefone: string; email: string; cep: string; logradouro: string;
  numero: string; complemento: string; bairro: string; cidade: string;
  uf: string; kmRodado: string;
};

// --- Input helper extraído para não perder foco ---
const FieldInput = ({ label, field: _field, placeholder, type = "text", disabled = false, required = true, value, onChange }: {
  label: string; field: keyof ClientInfo; placeholder: string; type?: string; disabled?: boolean; required?: boolean;
  value: string; onChange: (val: string) => void;
}) => (
  <div className="space-y-1.5">
    <Label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">{label} {required && <span className="text-red-500">*</span>}</Label>
    <Input
      type={type} placeholder={placeholder} value={value} disabled={disabled}
      onChange={e => onChange(e.target.value)}
      className="h-12 rounded-xl border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-base font-medium focus:ring-2 focus:ring-[var(--cor-principal)] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
    />
  </div>
);

const emptyClient: ClientInfo = {
  nome: '', cpf: '', dataNascimento: '', rg: '', telefone: '', email: '',
  cep: '', logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', uf: '', kmRodado: ''
};

export default function ClientCheckout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [selectedFin, setSelectedFin] = useState<any>(null);
  const [selectedSeg, setSelectedSeg] = useState<any>(null);
  const [isSigned, setIsSigned] = useState(false);
  const [clientInfo, setClientInfo] = useState<ClientInfo>({ ...emptyClient });
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState('');
  const location = useLocation();
  const isSalesmanMode = location.search.includes("mode=salesman") || window.location.href.includes("mode=salesman");
  const [showSalesmanLink, setShowSalesmanLink] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');

  useEffect(() => {
    const existingDbStr = localStorage.getItem("proposals_db") || "{}";
    const proposalsDb = JSON.parse(existingDbStr);
    const savedData = proposalsDb[id as string];
    if (savedData) {
      if (savedData.status === "signed") { setIsSigned(true); setData(savedData); return; }
      setData(savedData);
      setSelectedFin(savedData?.clientChoice?.selectedFin || savedData?.finQuotes?.[0] || null);
      setSelectedSeg(savedData?.clientChoice?.selectedSeg || savedData?.segQuotes?.[0] || null);
      // Pré-preencher nome e CPF que vieram da etapa do vendedor
      if (savedData.clienteNome || savedData.clienteCpf) {
        setClientInfo(prev => ({
          ...prev,
          nome: savedData.clienteNome || '',
          cpf: savedData.clienteCpf ? maskCPF(savedData.clienteCpf) : '',
        }));
      }
    } else {
      const fallbackData = {
        vehicleInfo: { modelo: "Tiggo 5X Pro", anoFabricacao: "2023/2024", valorVeiculo: "14500000" },
        clienteNome: "João da Silva",
        clienteCpf: "123.456.789-00",
        finQuotes: [
          { banco: "Banco Santander", parcelas: 60, valorParcela: "2450.00", taxa: "1.99%", entrada: "50000" },
          { banco: "Banco BV", parcelas: 48, valorParcela: "2850.00", taxa: "1.89%", entrada: "50000" }
        ],
        segQuotes: [
          { seguradora: "Porto Seguro", cobertura: "Compreensiva (100% FIPE)", valorPremio: 3200.00, valorFranquia: 2500.00 },
          { seguradora: "Suhai", cobertura: "Roubo/Furto + PT", valorPremio: 1850.00, valorFranquia: 0.00 }
        ]
      };
      setData(fallbackData);
      setSelectedFin(fallbackData.finQuotes[0]);
      setSelectedSeg(fallbackData.segQuotes[0]);
      setClientInfo(prev => ({
        ...prev,
        nome: fallbackData.clienteNome,
        cpf: maskCPF(fallbackData.clienteCpf),
      }));
    }
  }, [id]);

  // --- ViaCEP ---
  const fetchCep = useCallback(async (cep: string) => {
    const clean = cep.replace(/\D/g, '');
    if (clean.length !== 8) return;
    setCepLoading(true); setCepError('');
    try {
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
      const json = await res.json();
      if (json.erro) { setCepError('CEP não encontrado'); setCepLoading(false); return; }
      setClientInfo(prev => ({
        ...prev,
        logradouro: json.logradouro || '', bairro: json.bairro || '',
        cidade: json.localidade || '', uf: json.uf || '',
      }));
    } catch { setCepError('Erro ao buscar CEP'); }
    setCepLoading(false);
  }, []);

  const handleField = (field: keyof ClientInfo, raw: string) => {
    let value = raw;
    if (field === 'cpf') value = maskCPF(raw);
    else if (field === 'telefone') value = maskPhone(raw);
    else if (field === 'cep') { value = maskCEP(raw); if (raw.replace(/\D/g, '').length === 8) fetchCep(raw); }
    else if (field === 'dataNascimento') value = maskDate(raw);
    else if (field === 'kmRodado') value = maskKM(raw);
    setClientInfo(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = clientInfo.nome && clientInfo.cpf.replace(/\D/g, '').length === 11
    && clientInfo.dataNascimento.replace(/\D/g, '').length === 8 && clientInfo.rg
    && clientInfo.telefone.replace(/\D/g, '').length >= 10 && clientInfo.email.includes('@')
    && clientInfo.cep.replace(/\D/g, '').length === 8 && clientInfo.logradouro
    && clientInfo.numero && clientInfo.bairro && clientInfo.cidade && clientInfo.uf
    && clientInfo.kmRodado;

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <p className="text-xl text-muted-foreground animate-pulse">Carregando proposta segura...</p>
      </div>
    );
  }

  if (isSigned) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4 font-sans">
        <Card className="w-full max-w-lg p-8 sm:p-10 shadow-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-3xl text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-zinc-400 to-zinc-600" />
          <div className="space-y-6 flex flex-col items-center">
            <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 ring-8 ring-zinc-50 dark:ring-zinc-950/50">
              <Ban className="w-12 h-12 text-zinc-400" />
            </div>
            <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">Proposta Já Assinada</h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-base leading-relaxed font-medium">
              Este contrato já foi assinado digitalmente e emitido com sucesso. O link de proposta não pode mais ser utilizado.
            </p>
            <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 w-full">
              <p className="text-sm text-zinc-500 font-mono">ID da Proposta: <strong>{id?.toUpperCase()}</strong></p>
              <p className="text-sm text-zinc-500 font-mono mt-1">Veículo: <strong>{data?.vehicleInfo?.modelo || "N/A"}</strong></p>
            </div>
            <p className="text-xs text-zinc-400 mt-4">Em caso de dúvidas, entre em contato com o vendedor responsável.</p>
          </div>
        </Card>
      </div>
    );
  }

  const { vehicleInfo, finQuotes, segQuotes } = data;

  const handleAccept = () => {
    const existingDbStr = localStorage.getItem("proposals_db") || "{}";
    const proposalsDb = JSON.parse(existingDbStr);
    if (proposalsDb[id as string]) {
      proposalsDb[id as string].clientChoice = { selectedFin, selectedSeg };
      proposalsDb[id as string].clientInfo = clientInfo;
      localStorage.setItem("proposals_db", JSON.stringify(proposalsDb));
    }
    
    if (isSalesmanMode) {
      setGeneratedLink(`${window.location.origin}/#/checkout/${id}/sign`);
      setShowSalesmanLink(true);
    } else {
      navigate(`/checkout/${id}/sign`);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-20 font-sans" style={{ overflowY: 'auto', height: '100vh' }}>
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[var(--cor-principal)] rounded flex items-center justify-center shadow-md">
              <Car className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">AutoPremium</h1>
          </div>
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-bold px-3 py-1 border-none shadow-sm">
            Proposta Ativa
          </Badge>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="w-full bg-zinc-900 h-[320px] relative overflow-hidden shadow-inner">
        <img src="https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=1200&auto=format&fit=crop" alt="Carro"
          className="w-full h-full object-cover opacity-50 mix-blend-overlay object-center scale-105 hover:scale-100 transition-transform duration-1000" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-6 pb-8 max-w-4xl mx-auto">
          <Badge className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-md mb-4 border-none shadow-sm font-bold tracking-widest uppercase text-[10px] px-2 py-1">
            Resumo do Veículo
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-3 tracking-tight">{vehicleInfo?.modelo || "Veículo Selecionado"}</h2>
          <div className="flex items-center gap-6 text-zinc-300 text-sm font-semibold">
            <span className="flex items-center gap-2 bg-zinc-800/50 px-3 py-1.5 rounded-full backdrop-blur-sm"><Calendar className="w-4 h-4 text-[var(--cor-principal)]" /> {vehicleInfo?.anoFabricacao || "2023/2024"}</span>
            <span className="flex items-center gap-2 bg-zinc-800/50 px-3 py-1.5 rounded-full backdrop-blur-sm"><DollarSign className="w-4 h-4 text-emerald-400" /> Avaliado em R$ {(parseFloat(vehicleInfo?.valorVeiculo?.replace(/\D/g, '') || "0") / 100).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 -mt-8 relative z-10 space-y-6">

        {/* Financiamento */}
        {finQuotes && finQuotes.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight flex items-center gap-2">
              <Building2 className="text-[var(--cor-principal)] w-6 h-6" /> Condições de Financiamento
            </h3>
            <p className="text-muted-foreground text-sm font-medium">
              {data?.lockedChoices ? "Opção de parcelamento selecionada para o seu contrato:" : "Selecione a opção de parcelamento que melhor se encaixa no seu bolso:"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(data?.lockedChoices ? finQuotes.filter((f: any) => f.banco === selectedFin?.banco && f.parcelas === selectedFin?.parcelas) : finQuotes).map((fin: any, index: number) => {
                const isSelected = selectedFin?.banco === fin.banco && selectedFin?.parcelas === fin.parcelas;
                return (
                  <Card key={index} className={`p-5 border-2 transition-all duration-300 relative rounded-2xl ${data?.lockedChoices ? 'cursor-default' : 'cursor-pointer'} ${
                    isSelected ? "border-[var(--cor-principal)] bg-[var(--cor-principal)]/5 dark:bg-[var(--cor-principal)]/10 shadow-md ring-1 ring-[var(--cor-principal)]"
                      : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 hover:shadow-lg"
                  }`} onClick={() => !data?.lockedChoices && setSelectedFin(fin)}>
                    {isSelected && (<div className="absolute top-4 right-4 bg-white dark:bg-zinc-950 rounded-full shadow-sm"><CheckCircle2 className="text-[var(--cor-principal)] w-6 h-6 fill-white dark:fill-zinc-950" /></div>)}
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2">{fin.banco}</p>
                    <div className="flex justify-between items-end mb-4">
                      <div><p className="text-3xl font-black text-zinc-900 dark:text-zinc-100">{fin.parcelas}x</p></div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground font-bold uppercase">Parcela</p>
                        <p className="text-2xl font-black text-[var(--cor-principal)]">R$ {fin.valorParcela}</p>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-between">
                      <span className="text-xs font-semibold text-zinc-500">Entrada: R$ {parseFloat(fin.entrada || 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                      <span className="text-xs font-semibold text-zinc-500">Taxa: {fin.taxa}</span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Seguro */}
        {segQuotes && segQuotes.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight flex items-center gap-2">
              <ShieldCheck className="text-blue-600 dark:text-blue-400 w-6 h-6" /> Opções de Seguro Auto
            </h3>
            <p className="text-muted-foreground text-sm font-medium">
              {data?.lockedChoices ? "Cobertura selecionada para inclusão no pacote:" : "As melhores coberturas separadas para você. Escolha uma para incluir no pacote:"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(data?.lockedChoices ? segQuotes.filter((s: any) => s.seguradora === selectedSeg?.seguradora && s.cobertura === selectedSeg?.cobertura) : segQuotes).map((seg: any, index: number) => {
                const isSelected = selectedSeg?.seguradora === seg.seguradora && selectedSeg?.cobertura === seg.cobertura;
                return (
                  <Card key={index} className={`p-5 border-2 transition-all duration-300 relative rounded-2xl ${data?.lockedChoices ? 'cursor-default' : 'cursor-pointer'} ${
                    isSelected ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 shadow-md ring-1 ring-blue-500"
                      : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 hover:shadow-lg"
                  }`} onClick={() => !data?.lockedChoices && setSelectedSeg(seg)}>
                    {isSelected && (<div className="absolute top-4 right-4 bg-white dark:bg-zinc-950 rounded-full shadow-sm"><CheckCircle2 className="text-blue-600 w-6 h-6 fill-white dark:fill-zinc-950" /></div>)}
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2">{seg.seguradora}</p>
                    <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-4">{seg.cobertura}</p>
                    <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-950/50 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                      <div>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase">Franquia</p>
                        <p className="text-sm font-semibold">{seg.valorFranquia > 0 ? `R$ ${parseFloat(seg.valorFranquia).toLocaleString('pt-BR')}` : "Isenta"}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase">Prêmio Anual</p>
                        <p className="text-xl font-black text-blue-600 dark:text-blue-400">R$ {parseFloat(seg.valorPremio || 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* ========== DADOS PESSOAIS ========== */}
        <div className="space-y-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight flex items-center gap-2">
            <User className="text-violet-600 dark:text-violet-400 w-6 h-6" /> Seus Dados Pessoais
          </h3>
          <p className="text-muted-foreground text-sm font-medium">Preencha seus dados para emissão do contrato e registro da proposta.</p>

          <Card className="p-6 sm:p-8 rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg space-y-6">
            {/* Dados Pessoais */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldInput label="Nome Completo" field="nome" placeholder="Ex: João da Silva" disabled={!!data?.clienteNome} value={clientInfo.nome} onChange={(v) => handleField('nome', v)} />
              <FieldInput label="CPF" field="cpf" placeholder="000.000.000-00" disabled={!!data?.clienteCpf} value={clientInfo.cpf} onChange={(v) => handleField('cpf', v)} />
              <FieldInput label="Data de Nascimento" field="dataNascimento" placeholder="DD/MM/AAAA" value={clientInfo.dataNascimento} onChange={(v) => handleField('dataNascimento', v)} />
              <FieldInput label="RG" field="rg" placeholder="00.000.000-0" value={clientInfo.rg} onChange={(v) => handleField('rg', v)} />
              <FieldInput label="Telefone / WhatsApp" field="telefone" placeholder="(11) 99999-9999" value={clientInfo.telefone} onChange={(v) => handleField('telefone', v)} />
              <FieldInput label="E-mail" field="email" placeholder="seu@email.com" type="email" value={clientInfo.email} onChange={(v) => handleField('email', v)} />
            </div>

            {/* Endereço */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <h4 className="text-sm font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-[var(--cor-principal)]" /> Endereço
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5 relative">
                  <Label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">CEP <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Input type="text" placeholder="00000-000" value={clientInfo.cep}
                      onChange={e => handleField('cep', e.target.value)}
                      className="h-12 rounded-xl border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-base font-medium focus:ring-2 focus:ring-[var(--cor-principal)] transition-all pr-10" />
                    {cepLoading && <Loader2 className="w-5 h-5 text-[var(--cor-principal)] animate-spin absolute right-3 top-3.5" />}
                  </div>
                  {cepError && <p className="text-xs text-red-500 font-semibold">{cepError}</p>}
                </div>
                <FieldInput label="Logradouro" field="logradouro" placeholder="Rua, Av..." disabled={cepLoading} value={clientInfo.logradouro} onChange={(v) => handleField('logradouro', v)} />
                <FieldInput label="Número" field="numero" placeholder="123" value={clientInfo.numero} onChange={(v) => handleField('numero', v)} />
                <FieldInput label="Complemento" field="complemento" placeholder="Apto, Bloco..." required={false} value={clientInfo.complemento} onChange={(v) => handleField('complemento', v)} />
                <FieldInput label="Bairro" field="bairro" placeholder="Bairro" disabled={cepLoading} value={clientInfo.bairro} onChange={(v) => handleField('bairro', v)} />
                <FieldInput label="Cidade" field="cidade" placeholder="Cidade" disabled={cepLoading} value={clientInfo.cidade} onChange={(v) => handleField('cidade', v)} />
                <FieldInput label="UF" field="uf" placeholder="SP" disabled={cepLoading} value={clientInfo.uf} onChange={(v) => handleField('uf', v)} />
              </div>
            </div>

            {/* KM */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <h4 className="text-sm font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-2 mb-4">
                <Gauge className="w-4 h-4 text-emerald-500" /> Dados do Veículo
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FieldInput label="KM Rodado" field="kmRodado" placeholder="Ex: 45.000" value={clientInfo.kmRodado} onChange={(v) => handleField('kmRodado', v)} />
              </div>
            </div>
          </Card>
        </div>

        {/* Condições Pré-Aprovadas */}
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border-2 border-emerald-100 dark:border-emerald-900/40 rounded-3xl p-6 sm:p-8 flex gap-5 shadow-lg">
           <CheckCircle2 className="text-emerald-600 dark:text-emerald-500 shrink-0 w-8 h-8 mt-1" />
           <div>
             <h4 className="font-bold text-emerald-900 dark:text-emerald-400 text-xl tracking-tight mb-2">Condições Pré-Aprovadas</h4>
             <p className="text-sm sm:text-base text-emerald-800 dark:text-emerald-500/80 leading-relaxed font-medium">As condições apresentadas são válidas por 48 horas. Para prosseguirmos com a emissão do contrato e assinatura digital, clique no botão abaixo para confirmar as informações e oficializar a proposta.</p>
           </div>
        </div>

        {/* CTA */}
        <div className="pt-6 pb-12 flex justify-end">
          <Button
            size="lg"
            className="w-full sm:w-auto text-lg h-16 px-12 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all bg-[var(--cor-principal)] hover:bg-[var(--cor-principal)]/90 font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            onClick={handleAccept}
            disabled={!isFormValid}
          >
            {isSalesmanMode ? "Salvar e Gerar Link de Assinatura" : "Aceitar Condições e Assinar Contrato"} <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </main>

      <Dialog open={showSalesmanLink} onOpenChange={setShowSalesmanLink}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Link de Assinatura Gerado! 🚀</DialogTitle>
            <DialogDescription>
              As condições e os dados do cliente foram salvos. Copie o link abaixo e envie para o cliente realizar a assinatura digital.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 mt-4">
            <Input value={generatedLink} readOnly className="bg-muted" />
            <Button
              type="button"
              variant="default"
              onClick={() => {
                navigator.clipboard.writeText(generatedLink);
                alert("Link copiado para a área de transferência!");
              }}
            >
              Copiar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
