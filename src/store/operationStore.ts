import { create } from "zustand";

interface OperationStore {
  idOperation: string | null;
  setIdOperation: (id: string) => void;
}

export const useOperationStore = create<OperationStore>((set) => {
  const storedOperationId = localStorage.getItem("operation");
  return {
    idOperation: storedOperationId,
    setIdOperation: (id: string) => {
      localStorage.setItem("operation", id);
      set({ idOperation: id });
    },
  };
});

export const setPartnerId = useOperationStore.getState().setIdOperation;
