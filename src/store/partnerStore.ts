import { create } from "zustand";

interface PartnerStore {
  partnerId: string | null;
  setPartnerId: (id: string) => void;
}

export const usePartnerStore = create<PartnerStore>((set) => {
  const storedPartnerId = localStorage.getItem("partner");

  return {
    partnerId: storedPartnerId,
    setPartnerId: (id: string) => {
      localStorage.setItem("partner", id);
      set({ partnerId: id });
    },
  };
});

export const setPartnerId = usePartnerStore.getState().setPartnerId;
export const partnerId = usePartnerStore.getState().partnerId;
