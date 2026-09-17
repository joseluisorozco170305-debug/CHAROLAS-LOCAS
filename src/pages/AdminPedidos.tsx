import { Home, LogOut } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import {
  actualizarEstatusPedido,
  listarPedidosDeHoy,
  suscribirseATodosLosPedidos,
} from "../services/pedidosService";
import type { EstatusPedido, PedidoDB } from "../types/pedido";

const estatusOrden: EstatusPedido[] = [
  "recibido",
  "preparando",
  "listo",
  "entregado",
];

const etiquetas: Record<EstatusPedido, string> = {
  recibido: "Recibido",
  preparando: "Preparando",
  listo: "Listo",
  entregado: "Entregado",
};

export function AdminPedidos() {
  const [sesionIniciada, setSesionIniciada] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [pedidos, setPedidos] = useState<PedidoDB[]>([]);

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

  useEffect(() => {
    if (!sesionIniciada) {
      return;
    }

    const cargar = () => {
      listarPedidosDeHoy()
        .then(setPedidos)
        .catch(() => {});
    };

    cargar();

    const cancelar = suscribirseATodosLosPedidos(cargar);

    return cancelar;
  }, [sesionIniciada]);

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

  const handleCambiarEstatus = async (
    pedido: PedidoDB,
    nuevoEstatus: EstatusPedido,
  ) => {
    try {
      await actualizarEstatusPedido(pedido.id, nuevoEstatus);
    } catch {
      window.alert("No se pudo actualizar el estatus. Intenta de nuevo.");
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
            Inicia sesión para actualizar el estatus de los pedidos.
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
          <h1 className="text-2xl font-black">Pedidos de hoy</h1>

          <button
            type="button"
            onClick={() => supabase.auth.signOut()}
            className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold"
          >
            <LogOut size={16} />
            Salir
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {!pedidos.length && (
            <p className="text-slate-500">Todavía no hay pedidos hoy.</p>
          )}

          {pedidos.map((pedido) => (
            <div
              key={pedido.id}
              className="rounded-3xl border border-pink-100 bg-white p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-black">
                    Pedido #{String(pedido.numero_pedido).padStart(3, "0")}
                  </p>
                  <p className="text-sm text-slate-600">
                    {pedido.nombre_cliente}
                  </p>
                </div>

                <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-black text-pink-700">
                  {etiquetas[pedido.estatus]}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {estatusOrden.map((estatus) => (
                  <button
                    key={estatus}
                    type="button"
                    onClick={() => handleCambiarEstatus(pedido, estatus)}
                    disabled={pedido.estatus === estatus}
                    className={`rounded-xl px-3 py-2 text-sm font-bold ${
                      pedido.estatus === estatus
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {etiquetas[estatus]}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
