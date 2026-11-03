import { ArrowRight, Check, Copy, MessageCircle, Wifi } from "lucide-react";
import { useState } from "react";
import { paymentInfo } from "../data/pago";
import { whatsappUrl } from "../utils/whatsapp";
import { BentoSection, Dots, Ilustracion, SectionHeading } from "./Bento";

type CopyKey = "clabe" | "card" | "account";

const enGrupos = (valor: string, tam = 4) =>
  valor.replace(new RegExp(`(.{${tam}})(?=.)`, "g"), "$1 ");

const BLANCA =
  "rounded-[2rem] bg-white p-5 shadow-[0_10px_30px_rgba(236,72,153,0.10)] ring-1 ring-pink-100 sm:p-6";

function BotonCopiar({
  id,
  value,
  copied,
  onCopy,
  oscuro = false,
}: {
  id: CopyKey;
  value: string;
  copied: CopyKey | null;
  onCopy: (id: CopyKey, value: string) => void;
  oscuro?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onCopy(id, value)}
      className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-black transition active:scale-95 ${
        copied === id
          ? "bg-emerald-500 text-white"
          : oscuro
            ? "bg-white/15 text-white backdrop-blur hover:bg-white/25"
            : "bg-pink-600 text-white hover:bg-pink-700"
      }`}
    >
      {copied === id ? <Check size={16} /> : <Copy size={16} />}
      {copied === id ? "¡Copiado!" : "Copiar"}
    </button>
  );
}

export function PaymentSection() {
  const [copied, setCopied] = useState<CopyKey | null>(null);

  const copyValue = async (key: CopyKey, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Respaldo para navegadores viejos / sin permiso de portapapeles.
      const area = document.createElement("textarea");
      area.value = value;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    setCopied(key);
    window.setTimeout(() => setCopied(null), 1800);
  };

  const paymentMessage =
    "Hola, ya realicé mi transferencia para mi pedido de CHAROLAS LOCAS. Te envío mi comprobante.";

  return (
    <BentoSection id="pago">
      <SectionHeading
        kicker="Paga fácil 💳"
        title="Datos para transferencia"
        subtitle="Copia el dato que necesites y mándanos tu comprobante por WhatsApp."
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:grid-rows-[auto_auto]">
        {/* Tarjeta tipo plástico */}
        <div className="relative flex min-h-[15rem] flex-col justify-between overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-rose-950 to-pink-700 p-6 text-white shadow-xl shadow-pink-200 sm:col-span-2 sm:p-8 lg:row-span-2">
          <Dots />
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-pink-500/40 blur-3xl" />

          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[.2em] text-pink-200/80">
                Banco
              </p>
              <p className="soft-heading text-2xl font-black">
                {paymentInfo.bank}
              </p>
            </div>
            <Wifi size={26} className="rotate-90 text-white/60" />
          </div>

          <div className="relative mt-6">
            <div className="mb-4 h-9 w-12 rounded-md bg-gradient-to-br from-amber-200 to-amber-400 shadow-inner" />
            <p className="text-xs font-black uppercase tracking-[.2em] text-pink-200/80">
              Número de tarjeta
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-3">
              <p className="font-mono text-xl font-black tracking-wider sm:text-2xl">
                {enGrupos(paymentInfo.card)}
              </p>
              <BotonCopiar copied={copied} onCopy={copyValue} id="card" value={paymentInfo.card} oscuro />
            </div>
          </div>

          <div className="relative mt-6">
            <p className="text-xs font-black uppercase tracking-[.2em] text-pink-200/80">
              Titular
            </p>
            <p className="soft-heading text-xl font-black">
              {paymentInfo.holder}
            </p>
          </div>
        </div>

        {/* CLABE */}
        <div className={`${BLANCA} flex flex-col justify-between gap-4 sm:col-span-2`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[.18em] text-pink-500">
                CLABE interbancaria
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                Para transferir desde cualquier banco
              </p>
            </div>
            <BotonCopiar copied={copied} onCopy={copyValue} id="clabe" value={paymentInfo.clabe} />
          </div>
          <p className="break-all font-mono text-xl font-black tracking-wide text-rose-950 sm:text-2xl">
            {enGrupos(paymentInfo.clabe, 3)}
          </p>
        </div>

        {/* Cuenta */}
        <div className={`${BLANCA} flex flex-col justify-between gap-4`}>
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs font-black uppercase tracking-[.18em] text-pink-500">
              Número de cuenta
            </p>
            <BotonCopiar copied={copied} onCopy={copyValue} id="account" value={paymentInfo.account} />
          </div>
          <p className="break-all font-mono text-lg font-black text-rose-950">
            {paymentInfo.account}
          </p>
        </div>

        {/* Comprobante */}
        <a
          href={whatsappUrl(paymentMessage)}
          target="_blank"
          rel="noreferrer"
          className="group relative flex min-h-[10rem] flex-col justify-between overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-500 to-teal-400 p-5 text-white shadow-lg shadow-emerald-200 transition hover:-translate-y-1 sm:p-6"
        >
          <Dots />
          <Ilustracion
            nombre="brillos"
            className="-right-2 -top-2 w-16 rotate-12 group-hover:rotate-45"
          />
          <span className="relative grid h-11 w-11 place-items-center rounded-2xl bg-white/20 backdrop-blur">
            <MessageCircle size={21} />
          </span>
          <div className="relative">
            <p className="soft-heading text-xl font-black leading-tight">
              ¿Ya pagaste?
            </p>
            <p className="inline-flex items-center gap-1 text-sm font-bold text-white/90">
              Manda tu comprobante
              <ArrowRight size={15} className="transition group-hover:translate-x-1" />
            </p>
          </div>
        </a>
      </div>

      <p className="mt-5 text-center text-sm font-semibold text-rose-950/50">
        Dudas con tu pago: {paymentInfo.phone.replace(/(\d{2})(\d{4})(\d{4})/, "$1 $2 $3")}
      </p>
    </BentoSection>
  );
}
