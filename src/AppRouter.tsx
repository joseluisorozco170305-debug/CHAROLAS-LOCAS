import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import { AdminPedidos } from "./pages/AdminPedidos";
import { LocalPedidos } from "./pages/LocalPedidos";
import { NoEncontrada } from "./pages/NoEncontrada";
import { useSeoDeRuta } from "./shell/useSeoDeRuta";

function Rutas() {
  useSeoDeRuta();

  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/admin/*" element={<AdminPedidos />} />
      <Route path="/local/*" element={<LocalPedidos />} />
      <Route path="*" element={<NoEncontrada />} />
    </Routes>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Rutas />
    </BrowserRouter>
  );
}
