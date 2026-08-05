import { Check, Copy, CreditCard, MessageCircle } from "lucide-react";
import { useState } from "react";
import { paymentInfo } from "../data/pago";
import { whatsappUrl } from "../utils/whatsapp";

type CopyKey = "clabe" | "card" | "account" | null;

export function PaymentSection() {
  const [copied, setCopied] = useState<CopyKey>(null);

  const copyValue = async (
    key: Exclude<CopyKey, null>,
    value: string,
  ) => {
    await navigator.clipboard.writeText(value);
    setCopied(key);
    window.setTimeout(() => setCopied(null), 1800);
  };

  const paymentMessage =
    "Hola, ya realicé mi transferencia para mi pedido de CHAROLAS LOCAS. Te envío mi comprobante.";

  const rows = [
    {
      key: "clabe" as const,
      label: "CLABE",
      value: paymentInfo.clabe,
    },
    {
      key: "card" as const,
      label: "Número de tarjeta",
      value: paymentInfo.card,
    },
    {
      key: "account" as const,
      label: "Número de cuenta",
      value: paymentInfo.account,
    },
  ];

  return (
    <section id="pago" className="bg-slate-950 py-20 text-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-pink-500 text-white shadow-lg shadow-pink-950">
            <CreditCard size={26} />
          </div>

          <p className="mt-5 text-sm font-black uppercase tracking-[.22em] text-pink-400">
            Transferencia
          </p>

          <h2 className="mt-2 text-3xl font-black sm:text-4xl">
            Datos de cuenta
          </h2>

          <p className="mt-3 text-slate-300">
            Después de realizar el pago, envía tu comprobante por WhatsApp.
          </p>
        </div>

        <div className="mx-auto max-w-2xl overflow-hidden rounded-[2rem] border border-pink-400/30 bg-gradient-to-br from-pink-500 via-fuchsia-500 to-orange-400 p-[1px] shadow-2xl shadow-pink-950">
          <div className="rounded-[calc(2rem-1px)] bg-slate-950 p-6 sm:p-8">
            <div className="mb-7 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[.22em] text-pink-400">
                  Titular
                </p>
                <h3 className="mt-1 text-2xl font-black">
                  {paymentInfo.holder}
                </h3>
                <p className="mt-2 text-sm font-bold text-slate-300">
                  Banco {paymentInfo.bank}
                </p>
              </div>

              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-pink-500/15 text-pink-300">
                <CreditCard size={26} />
              </div>
            </div>

            <div className="space-y-3">
              {rows.map((row) => (
                <div
                  key={row.key}
                  className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      {row.label}
                    </p>
                    <p className="mt-1 break-all font-mono text-base font-black text-white sm:text-lg">
                      {row.value}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyValue(row.key, row.value)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-black text-slate-900 transition hover:-translate-y-0.5"
                  >
                    {copied === row.key ? (
                      <>
                        <Check size={17} />
                        Copiado
                      </>
                    ) : (
                      <>
                        <Copy size={17} />
                        Copiar
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>

            <a
              href={whatsappUrl(paymentMessage)}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-6 py-4 font-black text-white transition hover:bg-emerald-600"
            >
              <MessageCircle size={20} />
              Enviar comprobante
            </a>

            <p className="mt-4 text-center text-sm text-slate-400">
              Teléfono de contacto: {paymentInfo.phone}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
