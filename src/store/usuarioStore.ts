import { UsuarioItem } from "@/types";
import { create } from "zustand";

interface UsuarioState {
  usuario: UsuarioItem | null;
  setUsuario: (item: UsuarioItem | null) => void;
}

export const useUsuarioStore = create<UsuarioState>((set) => ({
  usuario: null,
  setUsuario: (item) => set(() => ({ usuario: item })),
}));

export const usuario = useUsuarioStore.getState().usuario;
export const setUsuario = useUsuarioStore.getState().setUsuario;
