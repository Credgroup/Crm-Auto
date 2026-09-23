export type ProdutoMock = {
  id: string;
  nome: string;
  codigo: string;
  preco: number;
  status: string;
  imagem?: string;
  qtdParcelas: number;
  valorParcela: number;
  criadoEm: string;
  paginaJson?: string;
  descricao: string;
  tags: string[] | null;
  subProdutos?: {
    id: string;
    nome: string;
    descricao: string;
    imagem: string;
    criadoEm: string;
    paginaJson: string;
  }[];
};

import { Product } from "@/types";

export const produtosArr: Partial<Product>[] = [];

export const produtosMock: ProdutoMock[] = [
  {
    id: "10",
    nome: "Seguro Auto",
    codigo: "MB-SEG-000",
    preco: 1980.0,
    status: "Disponível",
    imagem: "/assets/fi_products/seguro-auto.png",
    qtdParcelas: 12,
    valorParcela: 165.0,
    criadoEm: "2024-06-01T10:00:00Z",
    tags: ["Auto", "Veículos Leves", "Multi-Seguradoras", "Carro Reserva"],
    descricao:
      "Cobertura completa para automóveis e veículos leves: colisão, roubo, furto, terceiros, vidros e assistência 24h com cotação comparativa entre Porto Seguro, Tokio Marine e Zurich Seguros.",
  },
  {
    id: "3",
    nome: "Seguro Caminhão",
    codigo: "MB-SEG-001",
    preco: 2950.0,
    status: "Disponível",
    imagem: "/assets/fi_products/truck-insurance.png",
    qtdParcelas: 12,
    valorParcela: 245.8,
    criadoEm: "2024-06-01T10:00:00Z",
    tags: ["Caminhão", "Pesados", "Multi-Seguradoras", "Guincho Ilimitado"],
    descricao:
      "Proteção especializada para veículos pesados Mercedes-Benz: colisão, roubo, furto, carga, terceiros (RCF-V) e guincho 24h sem limite de km com cotação multi-seguradora em tempo real.",
  },
  {
    id: "11",
    nome: "Seguro de Proteção Financeira",
    codigo: "MB-SEG-002",
    preco: 4794.0,
    status: "Disponível",
    imagem: "/assets/fi_products/protecao-finan.png",
    qtdParcelas: 60,
    valorParcela: 79.9,
    criadoEm: "2024-06-10T09:30:00Z",
    tags: ["Prestamista", "Quitação", "PJ", "Saldo Remanescente"],
    descricao:
      "Proteção completa para o seu financiamento - Cobertura que garante a quitação da dívida em caso de falecimento (natural ou acidental) ou invalidez permanente total por acidente. Para Pessoa Jurídica, o benefício será conforme a participação societária. Além disso, os beneficiários ou o próprio segurado recebem o saldo remanescente.",
    subProdutos: [
      {
        id: "1101",
        nome: "Proteção Total (Prestamista Plus)",
        descricao:
          "Quitação integral do saldo devedor em caso de morte natural/acidental ou IPTA. Benefício societário para PJ e devolução de saldo remanescente.",
        imagem: "/assets/fi_products/protecao-finan.png",
        criadoEm: "2024-06-10T09:30:00Z",
        paginaJson: JSON.stringify({
          caracteristicas: [
            { nome: "Quitação de Dívida", valor: "100% do saldo devedor" },
            { nome: "Coberturas", valor: "Morte natural/acidental e IPTA" },
            { nome: "Pessoa Jurídica", valor: "Proporcional à participação societária" },
            { nome: "Saldo Remanescente", valor: "Garantido aos beneficiários" },
          ],
          descricao: "Plano completo para proteção total do financiamento.",
          faq: [],
        }),
      },
      {
        id: "1102",
        nome: "Proteção Básica (Prestamista Flex)",
        descricao:
          "Quitação de saldo devedor até R$ 250.000,00 por morte acidental ou IPTA, com devolução de excedente.",
        imagem: "/assets/fi_products/protecao-finan.png",
        criadoEm: "2024-06-10T09:30:00Z",
        paginaJson: JSON.stringify({
          caracteristicas: [
            { nome: "Quitação de Dívida", valor: "Até R$ 250.000,00" },
            { nome: "Cobertura", valor: "Morte acidental e IPTA" },
          ],
          descricao: "Plano acessível para proteção do saldo devedor.",
          faq: [],
        }),
      },
    ],
  },
  {
    id: "12",
    nome: "Seguro de Garantia Estendida",
    codigo: "MB-SEG-003",
    preco: 3576.0,
    status: "Disponível",
    imagem: "/assets/fi_products/insurance-extend.png",
    qtdParcelas: 24,
    valorParcela: 149.0,
    criadoEm: "2024-06-15T11:00:00Z",
    tags: ["Garantia", "Mercedes-Benz", "Extend Plus", "Peças Genuínas"],
    descricao:
      "Proteção completa para o seu veículo - Garantimos a cobertura com peças genuínas do seu caminhão e atendimento nas Concessionárias Mercedes-Benz. Cobertura e benefícios personalizados.",
    subProdutos: [
      {
        id: "1201",
        nome: "Proteção Total (Extend Plus)",
        descricao:
          "Proteção completa para o seu veículo - Cobertura para o Trem de Força (Chassi) e Sistema elétrico; peças genuínas e atendimento nas Concessionárias Mercedes-Benz.",
        imagem: "/assets/fi_products/insurance-extend.png",
        criadoEm: "2024-06-15T11:00:00Z",
        paginaJson: JSON.stringify({
          caracteristicas: [
            { nome: "Trem de Força", valor: "Incluso (Chassi)" },
            { nome: "Sistema Elétrico", valor: "Incluso" },
            { nome: "Peças", valor: "100% Genuínas Mercedes-Benz" },
            { nome: "Atendimento", valor: "Concessionárias Mercedes-Benz" },
          ],
          descricao: "Cobertura máxima incluindo trem de força e sistema elétrico.",
          faq: [],
        }),
      },
      {
        id: "1202",
        nome: "Proteção Básica (Extend)",
        descricao:
          "Proteção completa para o seu veículo - Cobertura para o Trem de Força (Chassi); peças genuínas e atendimento nas Concessionárias Mercedes-Benz.",
        imagem: "/assets/fi_products/insurance-extend.png",
        criadoEm: "2024-06-15T11:00:00Z",
        paginaJson: JSON.stringify({
          caracteristicas: [
            { nome: "Trem de Força", valor: "Incluso (Chassi)" },
            { nome: "Peças", valor: "100% Genuínas Mercedes-Benz" },
            { nome: "Atendimento", valor: "Concessionárias Mercedes-Benz" },
          ],
          descricao: "Cobertura essencial para o trem de força do caminhão.",
          faq: [],
        }),
      },
    ],
  },
];