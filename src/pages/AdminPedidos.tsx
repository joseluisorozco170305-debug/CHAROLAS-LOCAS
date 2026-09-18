import { Home, LogOut } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { EditarProductos } from "./admin/EditarProductos";
import { HistorialPedidos } from "./admin/HistorialPedidos";
import { PedidosHoy } from "./admin/PedidosHoy";

type Pestana = "hoy" | "historial" | "productos";

const pestanas: { id: Pestana; label: string }[] = [
  { id: "hoy", label: "Pedidos de hoy" },
  { id: "historial", label: "Historial" },
  { id: "productos", label: "Productos" },
];

export function AdminPedidos() {
  const [sesionIniciada, setSesionIniciada] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [pestana, setPestana] = useState<Pestana>("hoy");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSesionIniciada(!!data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, nuevaSesion) => {
        setSesionIniciada(!!nuevaSesion);
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setLoginError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoginError("Correo o contraseña incorrectos.");
    }
  };

  if (sesionIniciada === null) {
    return null;
  }

  if (!sesionIniciada) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#fff8fb] px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-3xl border border-pink-100 bg-white p-6"
        >
          <h1 className="text-2xl font-black">Acceso del equipo</h1>
          <p className="mt-1 text-sm text-slate-600">
            Inicia sesión para administrar pedidos y productos.
          </p>

          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Correo"
            className="mt-4 w-full rounded-2xl border border-pink-200 p-3 font-bold outline-none"
          />

          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Contraseña"
            className="mt-3 w-full rounded-2xl border border-pink-200 p-3 font-bold outline-none"
          />

          {loginError && (
            <p className="mt-3 text-sm font-bold text-red-600">
              {loginError}
            </p>
          )}

          <button
            type="submit"
            className="mt-4 w-full rounded-2xl bg-pink-600 p-3 font-black text-white"
          >
            Entrar
          </button>

          <Link
            to="/"
            className="mt-4 flex items-center justify-center gap-2 text-sm font-bold text-slate-500"
          >
            <Home size={16} />
            Volver al inicio
          </Link>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff8fb] px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black">Panel de Charolas Locas</h1>

          <button
            type="button"
            onClick={() => supabase.auth.signOut()}
            className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold"
          >
            <LogOut size={16} />
            Salir
          </button>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
          {pestanas.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setPestana(item.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-black ${
                pestana === item.id
                  ? "bg-pink-600 text-white"
                  : "bg-white text-slate-600 ring-1 ring-pink-100"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {pestana === "hoy" && <PedidosHoy />}
          {pestana === "historial" && <HistorialPedidos />}
          {pestana === "productos" && <EditarProductos />}
        </div>
      </div>
    </div>
  );
}
