import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { ThemeProvider } from "./components/Theme/theme-provider";
import { HashRouter } from "react-router";
import { Toaster } from "./components/ui/toaster";
import { Toaster as ToasterSonner } from "./components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { HubFunctionsProvider } from "./context/HubFunctions";

const queryClient = new QueryClient();

async function enableMocking() {
  console.log("VITE_USE_MOCK is:", import.meta.env.VITE_USE_MOCK);
  if (import.meta.env.VITE_USE_MOCK === "true" || import.meta.env.VITE_USE_MOCK === true) {
    console.log("Iniciando carregamento dos mocks...");
    await import("./mocks/index");
    console.log("Mocks carregados com sucesso!");
  } else {
    console.log("Mocks desativados. Usando API real.");
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <HashRouter>
      <HubFunctionsProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <App />
            <Toaster />
            <ToasterSonner position="top-center"  />
          </ThemeProvider>
        </QueryClientProvider>
      </HubFunctionsProvider>
    </HashRouter>
  </ErrorBoundary>
  );
});
