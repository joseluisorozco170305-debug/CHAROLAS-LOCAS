import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import { AdminPedidos } from "./pages/AdminPedidos";
import { EstatusPedido } from "./pages/EstatusPedido";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/estatus" element={<EstatusPedido />} />
        <Route path="/admin" element={<AdminPedidos />} />
      </Routes>
    </BrowserRouter>
  );
}
