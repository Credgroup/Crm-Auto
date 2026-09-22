import { useState } from "react";
import { useParams } from "react-router-dom";
import { FileSignature, ShieldCheck, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { addMockLead } from "@/mocks/leadMocks";
import { addMockProposal } from "@/mocks/proposalMocks";
import { addMockInsurance } from "@/mocks/insuranceMocks";
import { addMockSale, addMockDashboardProposal } from "@/mocks/dashboardMocks";

export default function ClientSignature() {
  const { id } = useParams();
  const [signing, setSigning] = useState(false);
  const [signed, setSigned] = useState(false);

  const handleSign = () => {
    setSigning(true);
    setTimeout(() => {
      try {
        const existingDbStr = localStorage.getItem("proposals_db") || "{}";
        const proposalsDb = JSON.parse(existingDbStr);
        const proposalData = proposalsDb[id as string];

        if (proposalData) {
          const vehicleInfo = proposalData.vehicleInfo || {};
          const clientChoice = proposalData.clientChoice || {};
          const clientInfo = proposalData.clientInfo || {};
          const selectedFin = clientChoice.selectedFin || proposalData.finQuotes?.[0];
          const selectedSeg = clientChoice.selectedSeg || proposalData.segQuotes?.[0];

          // Dados reais do formulário de checkout
          const nome = clientInfo.nome || "Cliente Digital";
          const cpf = clientInfo.cpf || "000.000.000-00";
          const dataNascimento = clientInfo.dataNascimento || "01/01/1990";
          const rg = clientInfo.rg || "";
          const telefone = clientInfo.telefone || "";
          const email = clientInfo.email || "";
          const kmRodado = clientInfo.kmRodado || "0";

          // Converter data nascimento DD/MM/AAAA -> ISO
          const dtParts = dataNascimento.replace(/\D/g, '');
          const dtNascISO = dtParts.length === 8
            ? `${dtParts.slice(4, 8)}-${dtParts.slice(2, 4)}-${dtParts.slice(0, 2)}T00:00:00`
            : "1990-01-01T00:00:00";

          // Extrair DDD e telefone
          const telClean = (telefone || '').replace(/\D/g, '');
          const ddd = telClean.slice(0, 2) || "11";
          const telNum = telClean.slice(2) || "999999999";

          // 1) Criar Lead com dados reais
          const newLead = addMockLead({
            idEmpresaOperacao: "1",
            nome,
            cpf: cpf.replace(/\D/g, ''),
            sexo: "N/I",
            estadoCivil: "N/I",
            dataNascimento: dtNascISO,
            idExterno: `EXT-${id}`,
            idOperacao: 1,
            contato: [{ ddd, telefone: telNum, tpTelefone: "Celular" }],
            email: [{ dsEmail: email }],
            adicional: JSON.stringify({
              cep: (clientInfo.cep || '').replace(/\D/g, ''),
              logradouro: clientInfo.logradouro || '',
              numero: clientInfo.numero || '',
              complemento: clientInfo.complemento || '',
              bairro: clientInfo.bairro || '',
              cidade: clientInfo.cidade || '',
              estado: clientInfo.uf || '',
              rg,
              kmRodado,
            }),
            qtSeguros: selectedSeg ? 1 : 0,
          });

          // 2) Criar Proposta
          const produtoContratado = selectedSeg ? "Combo (Financiamento + Seguro)" : "Financiamento";
          const valorVeiculoFormatado = vehicleInfo.valorVeiculo
            ? `R$ ${(parseFloat(vehicleInfo.valorVeiculo.replace(/\D/g, '') || "0") / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
            : "N/A";

          const newProposal = addMockProposal({
            idSegurado: newLead.idSegurado,
            idSeguradoI2k: newLead.idSeguradoI2k,
            nmSegurado: nome,
            cpfSegurado: cpf,
            nmProposta: `${produtoContratado} - ${nome}`,
            dsStatus: "Aprovada",
            chStatusProposta: 1,
            vlPremio: selectedSeg?.valorPremio ? String(selectedSeg.valorPremio) : "0.00",
            idProduto: selectedSeg ? 5 : 4,
            nmProduto: produtoContratado,
            idEmpresaOperacao: "1",
            cotacaoEscolhida: JSON.stringify({
              financing: selectedFin || null,
              insurance: selectedSeg || null,
            }),
            simulacoesFinanciamento: proposalData.finQuotes || [],
            simulacoesSeguro: proposalData.segQuotes || [],
            historico: [
              { dtEvento: new Date(Date.now() - 3600000).toISOString(), dsEvento: "Proposta criada pelo vendedor e enviada ao cliente", usuario: "Vendedor Mock" },
              { dtEvento: new Date(Date.now() - 1800000).toISOString(), dsEvento: `Cliente selecionou: ${selectedFin?.banco || "N/A"} ${selectedFin?.parcelas || ""}x`, usuario: nome },
              { dtEvento: new Date().toISOString(), dsEvento: "Contrato assinado digitalmente pelo cliente", usuario: nome },
            ],
            respostas: [
              { idPergunta: 1, dsPergunta: "Modelo do Veículo", dsResposta: vehicleInfo.modelo || "N/A" },
              { idPergunta: 2, dsPergunta: "Ano de Fabricação", dsResposta: vehicleInfo.anoFabricacao || "N/A" },
              { idPergunta: 3, dsPergunta: "Valor do Veículo", dsResposta: valorVeiculoFormatado },
              { idPergunta: 4, dsPergunta: "Entrada", dsResposta: selectedFin?.entrada ? `R$ ${parseFloat(selectedFin.entrada).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : "N/A" },
              { idPergunta: 5, dsPergunta: "Banco Escolhido", dsResposta: selectedFin?.banco || "N/A" },
              { idPergunta: 6, dsPergunta: "Parcelas", dsResposta: selectedFin?.parcelas ? `${selectedFin.parcelas}x de R$ ${parseFloat(String(selectedFin.valorParcela).replace(/[^0-9.-]/g, '') || '0').toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "N/A" },
              { idPergunta: 7, dsPergunta: "RG", dsResposta: rg || "N/A" },
              { idPergunta: 8, dsPergunta: "KM Rodado", dsResposta: kmRodado || "N/A" },
              { idPergunta: 9, dsPergunta: "Data de Nascimento", dsResposta: dataNascimento || "N/A" },
            ],
            documentos: [
              { idDocumento: Date.now(), nmDocumento: `Contrato_Financiamento_${id}.pdf`, tpDocumento: "Proposta", dtUpload: new Date().toISOString() },
            ],
          });

          // 3) Criar Seguro se selecionado
          if (selectedSeg) {
            addMockInsurance({
              idSegurado: newLead.idSegurado,
              idSeguradoI2k: newLead.idSeguradoI2k,
              idProposta: newProposal.idProposta,
              idProduto: selectedSeg.idCotacao || 3,
              nmProduto: `Seguro Auto - ${selectedSeg.seguradora}`,
              dsProduto: selectedSeg.cobertura,
              vlPremio: selectedSeg.valorPremio || 0,
              vlCapital: parseFloat(vehicleInfo.valorVeiculo?.replace(/\D/g, '') || "0") / 100,
              vlParcela: (selectedSeg.valorPremio || 0) / 12,
              qtParcelas: 12,
              nmSegurado: nome,
              cpfSegurado: cpf,
              idEmpresaOperacao: "1",
            });
          }

          // 4) Injetar no Dashboard de Vendas
          addMockSale({
            nmCliente: nome,
            cpfCliente: cpf,
            nmProduto: produtoContratado,
            vlPremio: selectedSeg?.valorPremio ? String(selectedSeg.valorPremio) : "0.00",
            dtVenda: new Date().toISOString(),
            dsStatus: "Aprovada",
          });

          // 5) Injetar no Dashboard de Propostas
          addMockDashboardProposal({
            idProposta: newProposal.idProposta,
            nmProposta: `${produtoContratado} - ${nome}`,
            account: "Vendedor Mock",
            statusProposta: "Aprovada",
            dtCadastro: new Date().toISOString(),
          });

          // 6) Marcar proposta como assinada no localStorage
          proposalsDb[id as string].status = "signed";
          proposalsDb[id as string].signedBy = nome;
          proposalsDb[id as string].signedAt = new Date().toISOString();
          localStorage.setItem("proposals_db", JSON.stringify(proposalsDb));

          console.log("✅ Lead criado:", newLead.nome || nome);
          console.log("✅ Proposta criada:", newProposal.idProposta);
          console.log("✅ Seguro criado:", selectedSeg ? "Sim" : "Não");
          console.log("✅ Dashboard atualizado com venda de hoje");
        }
      } catch (err) {
        console.error("Erro ao injetar nos mocks:", err);
      }

      setSigning(false);
      setSigned(true);
      toast.success("Contrato assinado com sucesso!");
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4 font-sans">
      <Card className="w-full max-w-lg p-8 sm:p-10 shadow-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-3xl text-center relative overflow-hidden">

        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[var(--cor-principal)] to-emerald-500" />

        {signed ? (
          <div className="space-y-6 flex flex-col items-center animate-in fade-in zoom-in duration-700">
            <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4 ring-8 ring-emerald-50 dark:ring-emerald-950/50">
              <ShieldCheck className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-4xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">Sucesso Absoluto!</h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed font-medium">Seu contrato foi assinado digitalmente e já foi enviado para a concessionária. O vendedor entrará em contato para o agendamento da retirada do seu novo veículo.</p>
            <div className="pt-8 w-full space-y-3">
              <Button variant="outline" className="w-full h-14 rounded-xl text-base font-bold border-2" onClick={() => window.close()}>
                <Download className="mr-2 w-5 h-5 stroke-[2.5]" /> Baixar Cópia do Contrato
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 flex flex-col items-center">
            <div className="w-20 h-20 bg-[var(--cor-principal)]/10 rounded-full flex items-center justify-center mb-2">
              <FileSignature className="w-10 h-10 text-[var(--cor-principal)]" />
            </div>
            <Badge variant="outline" className="mb-2 font-mono text-xs font-bold tracking-wider px-3 py-1 bg-zinc-100 dark:bg-zinc-800 border-none">
              ID DA PROPOSTA: {id?.toUpperCase()}
            </Badge>
            <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">Assinatura Digital</h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-base leading-relaxed font-medium">Ao clicar em assinar, você concorda com as condições pré-aprovadas e emite a assinatura com validade legal da proposta.</p>

            <div className="bg-zinc-50 dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 w-full text-left my-8 flex items-center justify-between shadow-inner">
               <div className="flex flex-col">
                  <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Contrato_Financiamento_{id}.pdf</span>
                  <span className="text-xs text-muted-foreground mt-1 font-semibold">4 Páginas • 1.2 MB</span>
               </div>
               <FileSignature className="w-6 h-6 text-zinc-400" />
            </div>

            <div className="w-full flex gap-3 pt-4">
              <Button variant="outline" size="lg" className="w-full h-16 rounded-2xl font-bold text-base border-2" onClick={() => window.history.back()} disabled={signing}>
                Voltar
              </Button>
              <Button size="lg" className="w-full h-16 rounded-2xl shadow-xl text-lg font-bold bg-[var(--cor-principal)] hover:bg-[var(--cor-principal)]/90" onClick={handleSign} disabled={signing}>
                {signing ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin text-xl">⏳</span> Autenticando...
                  </span>
                ) : (
                  "Assinar Digitalmente"
                )}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
