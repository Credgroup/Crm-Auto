import { useEffect, Suspense, lazy } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";

import { PrivateRoute } from "./components/PrivateRoute";
import { PrivateLayout } from "./components/PrivateLayout";
import { LoginLayout } from "./components/LoginLayout";
import { setUsuario, useUsuarioStore } from "./store/usuarioStore";
import { setAutenticado } from "./store/autenticadoStore";
import { loadUserState, validateLoginByParameters } from "./hooks/useLogin";
// import useCommunicationHub from "./hooks/useCommunicationHub";
import NotFound from "./pages/NotFound"; // 404 é estático, precisa carregar rápido.
import Login from "./pages/Login"; // Tela de Login é o primeiro ponto de contato.
import { Loader2 } from "lucide-react";
import LeadPage from "./pages/LeadPage";
import LeadDetailsPage from "./pages/LeadDetailsPage";
import ComissionPage from "./pages/ComissionPage";


// Rotas Públicas (pós-login)
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const AccessCode = lazy(() => import("./pages/AccessCode"));
const CreateNewPassword = lazy(() => import("./pages/CreateNewPassword"));
const Terms = lazy(() => import("./pages/Terms"));
const ClientCheckout = lazy(() => import("./pages/ClientCheckout"));
const ClientSignature = lazy(() => import("./pages/ClientSignature"));

// Rotas Privadas
const OverviewPage = lazy(() => import("./pages/Dashboards/Overview"));
const SalesDashboard = lazy(() => import("./pages/Dashboards/Sales"));
const ProposalsDashboard = lazy(() => import("./pages/Dashboards/Proposals"));
const ProdutosPage = lazy(() => import("./pages/ProdutosPage"));
const Vendas = lazy(() => import("./pages/Vendas"));
const ProductFormPage = lazy(() => import("./pages/Vendas/ProductFormPage"));


function App() {
  const usuario = useUsuarioStore((state) => state.usuario);
  const navigate = useNavigate();
  //useCommunicationHub({ user: usuario }); // Apenas inicializa a conexão

  useEffect(() => {
    if (!usuario?.idusuario) {
      const validatedByParams = validateLoginByParameters({
        setAutenticado,
        setUsuario,
      });
      if (!validatedByParams) {
        loadUserState({
          navigate,
          setAutenticado,
          setUsuario,
          stayInLastPage: true,
        });
        return;
      }
      navigate("/");
    }
  }, []);

  // Um componente simples que será exibido enquanto o código da rota é baixado.
  const loadingFallback = <div className="flex items-center justify-center flex-col h-[calc(100vh-5rem)] w-full">
    <div className="relative logo top-1 w-28 h-8 rounded-md bg-[image:var(--image-logo-extended)] dark:bg-[image:var(--image-logo-extended-dark)] bg-contain bg-no-repeat bg-center mb-6 animate-pulse"></div>
    <Loader2 className="w-6 h-6 text-zinc-700 dark:text-zinc-300 animate-spin" />
  </div>;

  return (
    <Routes>
      {/* Rota pública */}
      <Route element={<LoginLayout />}>
        <Route path="/login" element={<Login />} /> 
        
        {/* Envolvendo rotas públicas secundárias em Suspense */}
        <Route path="/resetSenha" element={<Suspense fallback={loadingFallback}><ForgotPassword /></Suspense>} />
        <Route path="/resetSenha/new" element={<Suspense fallback={loadingFallback}><CreateNewPassword /></Suspense>} />
        <Route path="/code" element={<Suspense fallback={loadingFallback}><AccessCode /></Suspense>} />
        <Route path="/terms" element={<Suspense fallback={loadingFallback}><Terms /></Suspense>} />
      </Route>

      {/* Rotas privadas com layout */}
      <Route element={<PrivateRoute />}>
        <Route element={<PrivateLayout />}>
          <Route path="/" element={<Navigate to="/dashboards/overview" />} />
          <Route path="/dashboards" element={<Navigate to="/dashboards/overview" />} />
          
          {/* Envolvendo TODAS as rotas privadas em Suspense */}
          <Route path="/dashboards/overview" element={<Suspense fallback={loadingFallback}><OverviewPage /></Suspense>} />
          <Route path="/dashboards/sales" element={<Suspense fallback={loadingFallback}><SalesDashboard /></Suspense>} />
          <Route path="/dashboards/proposals" element={<Suspense fallback={loadingFallback}><ProposalsDashboard /></Suspense>} />
          <Route path="/lead" element={<LeadPage />} />
          <Route path="/lead/details/:search" element={<LeadDetailsPage />} />
          <Route path="/produtos" element={<Suspense fallback={loadingFallback}><ProdutosPage /></Suspense>} />
          <Route path="/sales" element={<Suspense fallback={loadingFallback}><Vendas /></Suspense>} />
          <Route path="/sales/product/:id" element={<Suspense fallback={loadingFallback}><ProductFormPage /></Suspense>} />
          <Route path="/commission" element={<Suspense fallback={loadingFallback}><ComissionPage /></Suspense>} />
          
        </Route>
      </Route>

      {/* Rotas Públicas do Cliente Final (Sem Login) */}
      <Route path="/checkout/:id" element={<Suspense fallback={loadingFallback}><ClientCheckout /></Suspense>} />
      <Route path="/checkout/:id/sign" element={<Suspense fallback={loadingFallback}><ClientSignature /></Suspense>} />

      {/* 404 */}
      <Route path="/*" element={<NotFound />} />
      <Route path="/notfound" element={<NotFound />} />
    </Routes>
  );
}

export default App;