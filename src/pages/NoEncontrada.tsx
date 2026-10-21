import { Link } from "react-router-dom";
import logo from "../assets/logo-charolas-locas.png";

/** Vista 404 dentro de la app (en Vercel, lo desconocido cae en public/404.html). */
export function NoEncontrada() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#fff8fb] px-4 text-center text-slate-900">
      <div className="max-w-sm">
        <img
          src={logo}
          alt="Logo de Charolas Locas"
          className="mx-auto h-24 w-24 rounded-3xl object-cover shadow-lg shadow-pink-100"
        />
        <p className="mt-6 text-sm font-black uppercase tracking-[.22em] text-orange-500">
          Error 404
        </p>
        <h1 className="mt-2 text-3xl font-black">
          Esta charola no existe 🍓
        </h1>
        <p className="mt-2 text-slate-600">
          La página que buscas no está aquí. Regresa al menú y arma tu pedido.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-2xl bg-pink-600 px-6 py-4 font-black text-white shadow-lg shadow-pink-200"
        >
          Ver el menú
        </Link>
      </div>
    </main>
  );
}
