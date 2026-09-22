import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function log(error: Error) {
  const ambiente = import.meta.env.VITE_ENV;
  const stackLine = error.stack?.split("\n")[1]?.trim();
  const stackStyle =
    "color: #aaa; font-size: 14px; background: #1E1E1E; padding: 5px; border-radius: 4px;";
  if (ambiente !== "production") {
    if (stackLine) {
      const msg = `${error.message} | ${stackLine}`;
      console.log(`%c${msg}`, stackStyle);
    } else {
      console.log(error);
    }
  }
}

export function copyToClipboard(text: string) {
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Texto copiado:", text);
        toast.success("Copiado para area de transferência!");
      })
      .catch((err) => {
        console.error("Erro ao copiar:", err);
        toast.error("Não foi possível copiar");
      });
  } else {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand("copy");
      console.log("Texto copiado (fallback):", text);
      toast.success("Copiado para area de transferência!");
    } catch (err) {
      console.error("Erro ao copiar (fallback):", err);
      toast.error("Não foi possível copiar");
    }
    document.body.removeChild(textarea);
  }
}

type FormatValueType = "fixo" | "celular" | "cpf" | "cnpj" | "cep";
export function formatValue(type: FormatValueType, value: string): string {
  let formattedValue = value;

  if (type === "fixo") {
    const cleaned = value.replace(/\D/g, "");
    const areaCode = cleaned.slice(0, 2);
    const part1 = cleaned.slice(2, 6);
    const part2 = cleaned.slice(6, 10);
    return `(${areaCode}) ${part1}-${part2}`;
  }

  if (type === "celular") {
    const cleaned = value.replace(/\D/g, "");
    const areaCode = cleaned.slice(0, 2);
    const part1 = cleaned.slice(2, 3);
    const part2 = cleaned.slice(3, 7);
    const part3 = cleaned.slice(7, 11);
    return `(${areaCode}) ${part1} ${part2}-${part3}`;
  }

  if (type == "cpf") {
    // Format CPF
    const firstPart = value.slice(0, 3);
    const secondPart = value.slice(3, 6);
    const thirdPart = value.slice(6, 9);
    const lastPart = value.slice(9, 11);

    formattedValue = `${firstPart}.${secondPart}.${thirdPart}-${lastPart}`;
  }

  if (type === "cnpj") {
    // Format CNPJ
    const firstPart = value.slice(0, 2);
    const secondPart = value.slice(2, 5);
    const thirdPart = value.slice(5, 8);
    const fourthPart = value.slice(8, 12);
    const lastPart = value.slice(12, 14);

    formattedValue = `${firstPart}.${secondPart}.${thirdPart}/${fourthPart}-${lastPart}`;
  }
  if (type === "cep") {
    // Format CEP
    const firstPart = value.slice(0, 5);
    const secondPart = value.slice(5, 8);

    formattedValue = `${firstPart}-${secondPart}`;
  }

  return formattedValue;
}

export function dev_log(fn: () => void) {
  const env = import.meta.env.VITE_ENV;
  if (env !== "production") {
    fn();
  }
}

export async function downloadDocumentByBlobsLink(link?: string | null, name?: string | null, openInNewTab?: boolean) {
  if(!link) {
    toast.error("Não foi possível identificar o caminho do documento");
    return;
  }

  if (openInNewTab){
    window.open(link, "_blank", "noopener,noreferrer");
    return;
  }

  try {
    // Busca o arquivo via requisição para contornar limitações de Cross-Origin (CORS) com o atributo `download`
    const response = await fetch(link);
    if (!response.ok) {
        throw new Error("Erro durante o download da URL original");
    }
    
    // Converte a resposta em um Blob (arquivo de memória local)
    const blob = await response.blob();
    // Cria uma URL temporária para o Blob (com a mesma origem do site)
    const blobUrl = window.URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = name ?? "document.pdf";
    document.body.appendChild(a); // Necessário para funcionar corretamente no Firefox
    a.click();
    
    // Limpa a URL em memória e o elemento após o download
    window.URL.revokeObjectURL(blobUrl);
    document.body.removeChild(a);
  } catch(error) {
    dev_log(()=>console.error("Fall-back para navegação padrão falhou fetch do blob:", error));
    // Caso de uso falhe por bloqueio de CORS na request, usa o comportamento padrão como Fall-back
    const a = document.createElement("a");
    a.href = link;
    a.download = name ?? "document.pdf";
    a.click();
  }
}

export function handleExtractDataToFileCSV(data: any[], nmFile:string) {
  try {
    if(!Array.isArray(data) || data.length === 0){
      throw new Error("Não existe conteúdo")
    }

    const headers = Object.keys(data[0])
    dev_log(() => console.log(headers))

    let table = [headers]

    data.forEach((obj: any) =>{
      table.push(Object.values(obj))
    })

    let csvContent = "data:text/csv;charset=utf-8,\ufeff";
    csvContent += table.map(row => row.join(",")).join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `${nmFile}${format(new Date(), "ddMMyyyyHHmm")}.csv`);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Erro ao gerar arquivo CSV:", error);
    throw error;
  }

}