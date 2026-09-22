import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/autenticadoStore";

export function PrivateRoute() {
  const autenticado = useAuthStore((state) => state.autenticado);

  return autenticado ? <Outlet /> : <Navigate to="/login" replace />;
}
