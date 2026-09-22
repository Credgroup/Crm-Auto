export type ProdutoMock   = {
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
  tags: string[] | null
  subProdutos?: {
    id: string
    nome: string;
    descricao: string;
    imagem: string;
    criadoEm: string;
    paginaJson: string;
  }[];

};

import imageProduto from "@/../public/imagemProduto.jpg"
import { Product } from "@/types";

export const produtosArr: Partial<Product>[] = [
  
]

export const produtosMock: ProdutoMock[] = [
  {
    id: "1",
    nome: "Akad Proteção Total",
    codigo: "AKD-001",
    preco: 120.5,
    status: "Disponível",
    imagem: imageProduto,
    qtdParcelas: 12,
    valorParcela: 10.04,
    criadoEm: "2024-06-01T10:00:00Z",
    tags: ["Proteção", "saúde", "benefícios", "pessoal"],
    descricao:
      "O Akad Proteção Total é um seguro completo voltado para a segurança pessoal e familiar, com diferentes níveis de cobertura para atender a todos os perfis. Ele inclui coberturas por morte acidental, capitalização, auxílio funeral, assistência PET e serviços de saúde digital.",
    paginaJson: JSON.stringify({
      caracteristicas: [
        { nome: "Parcelamento", valor: "Em até 12x" },
        { nome: "Coberturas", valor: "De R$ 50 mil a R$ 150 mil" },
        { nome: "Telemedicina", valor: "Inclusa em todos os planos" },
      ],
      descricao:
        "Os produtos Akad oferecem proteção pessoal com coberturas variadas, capitalização e benefícios como assistência PET e clube de descontos.",
      faq: [
        {
          question: "Como posso contratar um plano Akad?",
          answer:
            "Você pode contratar diretamente pela plataforma digital ou através de um corretor credenciado.",
        },
        {
          question: "Os produtos possuem carência?",
          answer:
            "Sim, há carência de 30 dias para eventos cobertos, salvo em casos de acidente pessoal.",
        },
      ],
    }),
  },
  {
    id: "2",
    nome: "Akad Vida Essencial",
    codigo: "AKD-002",
    preco: 89.9,
    status: "Disponível",
    imagem: imageProduto,
    qtdParcelas: 10,
    valorParcela: 8.99,
    criadoEm: "2024-06-10T09:30:00Z",
    tags: [],
    descricao:
      "O Akad Vida Essencial oferece proteção com coberturas práticas e benefícios que fazem a diferença no dia a dia da família.",
    subProdutos: [
      {
        id: "22198312",
        nome: "Essencial Plus",
        descricao:
          "Cobertura de R$ 40 mil por morte acidental, R$ 20 mil em capitalização, R$ 3 mil de auxílio funeral e acesso à rede de descontos em saúde e farmácias.",
        imagem: "...",
        criadoEm: "2024-06-10T09:30:00Z",
        paginaJson: JSON.stringify({
          caracteristicas: [
            { nome: "Cobertura por Morte Acidental", valor: "R$ 40.000,00" },
            { nome: "Capitalização", valor: "R$ 20.000,00" },
            { nome: "Auxílio Funeral", valor: "R$ 3.000,00" },
            { nome: "Rede de Descontos", valor: "Farmácias e exames" },
            { nome: "Carência", valor: "30 dias" },
          ],
          descricao:
            "Plano econômico para quem busca um seguro acessível com coberturas básicas e benefícios úteis no dia a dia.",
          faq: [
            {
              question: "É possível contratar online?",
              answer: "Sim, a contratação é 100% digital.",
            },
            {
              question: "O plano cobre morte natural?",
              answer:
                "Não. A cobertura se limita a morte acidental e serviços associados.",
            },
          ],
        }),
      },
      {
        id: "22198313",
        nome: "Essencial Max",
        descricao:
          "Cobertura de R$ 60 mil por morte acidental, R$ 30 mil em capitalização, R$ 7 mil de auxílio funeral, acesso a rede de saúde com descontos e seguro de assistência residencial.",
        imagem: "...",
        criadoEm: "2024-06-10T09:30:00Z",
        paginaJson: JSON.stringify({
          caracteristicas: [
            { nome: "Cobertura por Morte Acidental", valor: "R$ 60.000,00" },
            { nome: "Capitalização", valor: "R$ 30.000,00" },
            { nome: "Auxílio Funeral", valor: "R$ 7.000,00" },
            { nome: "Assistência Residencial", valor: "Inclusa (hidráulica e elétrica)" },
          ],
          descricao:
            "Um plano intermediário para quem quer um pouco mais de proteção e benefícios agregados.",
          faq: [
            {
              question: "Inclui cobertura para acidentes domésticos?",
              answer:
                "Sim, qualquer acidente pessoal dentro ou fora da residência está incluso.",
            },
            {
              question: "Como funciona a assistência residencial?",
              answer:
                "Em caso de emergência, a seguradora envia um profissional para reparos básicos.",
            },
          ],
        }),
      },
    ],
  },
  {
    id: "3",
    nome: "Akad Família Segura",
    codigo: "AKD-003",
    preco: 149.9,
    status: "Disponível",
    imagem: imageProduto, // string path da imagem
    qtdParcelas: 12,
    valorParcela: 12.49,
    criadoEm: "2024-06-15T11:00:00Z",
    tags: ["familia", "segurança", "proteção", "24h"],
    descricao:
      "O Akad Família Segura é ideal para quem busca proteção estendida para todos os membros da família, com ampla cobertura, assistência 24h e serviços digitais.",
  },
  
];