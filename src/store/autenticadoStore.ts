import { create } from "zustand";
import { encrypt, decrypt } from "../hooks/useCrypt";

interface AuthState {
  autenticado: boolean;
  setAutenticado: (value: boolean) => void;
}

function getInitialAuthState(): boolean {
  try {
    const session = localStorage.getItem("staysession");
    if (!session) return false;
    const decrypted = decrypt(session);
    return JSON.parse(decrypted) === true;
  } catch {
    return false;
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  autenticado: getInitialAuthState(),
  setAutenticado: (value: boolean) => {
    localStorage.setItem("staysession", encrypt(JSON.stringify(value)));
    set({ autenticado: value });
  },
}));

export const setAutenticado = useAuthStore.getState().setAutenticado;
