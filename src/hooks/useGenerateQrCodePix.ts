import { dev_log } from "@/lib/utils";
import { useState, useCallback } from "react";

// Remove espaços e quebras de linha
function normalizePixCode(pixCode: string): string {
  return pixCode.trim();
}

// Checa se parece um código PIX (heurística simples)
function isPixCodeValid(code: string): boolean {
  return code.startsWith("000201") && /BR\.GOV\.BCB\.PIX/.test(code);
}

// ---------- Função Principal ----------
export async function generatePixQrCode(
  pixCode: string,
  setLoading: (loading: boolean) => void,
  setError: (error: string | null) => void,
  setQrCode: (code: string | null) => void
) {
  try {
    setLoading(true);
    setError(null);
    setQrCode(null);

    // 1. Formata
    const normalized = normalizePixCode(pixCode);

    // 2. Valida
    if (!isPixCodeValid(normalized)) {
      setError("Código PIX inválido.");
      return;
    }

    // 3. Seta como QR Code
    setQrCode(normalized);
    dev_log(() => console.log("normalized", normalized))
  } catch (err) {
    console.error("Erro ao gerar QR Code:", err);
    setError("Erro ao gerar QR Code.");
  } finally {
    setLoading(false);
  }
}

export function usePixQrCode() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);

  const generate = useCallback(
    (pixCode: string) => {
      dev_log(() => console.log("pixCode", {code: pixCode}))
      generatePixQrCode(pixCode, setLoading, setError, setQrCode)
    },
    []
  );

  return { loading, error, qrCode, generate };
}