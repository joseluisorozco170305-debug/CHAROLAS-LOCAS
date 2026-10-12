import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import { AdminPedidos } from "./pages/AdminPedidos";
import { LocalPedidos } from "./pages/LocalPedidos";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<AdminPedidos />} />
        <Route path="/local" element={<LocalPedidos />} />
      </Routes>
    </BrowserRouter>
  );
}
