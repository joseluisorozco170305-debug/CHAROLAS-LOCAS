import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppRouter } from "./AppRouter";
import { CartProvider } from "./context/CartContext";
import "../index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CartProvider>
      <AppRouter />
    </CartProvider>
  </StrictMode>,
);

// Quita la pantalla de carga en cuanto la app se dibuja.
requestAnimationFrame(() => {
  const splash = document.getElementById("splash");
  if (!splash) return;
  splash.classList.add("oculto");
  window.setTimeout(() => splash.remove(), 400);
});
