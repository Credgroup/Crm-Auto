import { createContext, useContext } from "react";

export const LeadContext = createContext<string | null>(null);

export function useLeadId() {
  return useContext(LeadContext);
}
