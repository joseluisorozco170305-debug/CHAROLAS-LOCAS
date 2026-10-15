/** Bloques grises animados mientras carga la info. */
const pulse = "animate-pulse rounded-2xl bg-pink-100/70";

export function ProductCardSkeleton() {
  return (
    <div
      aria-hidden
      className="overflow-hidden rounded-[1.75rem] border border-pink-100 bg-white"
    >
      <div className="flex h-36 items-start justify-between bg-gradient-to-br from-pink-50 to-fuchsia-50 p-6">
        <div className={`${pulse} h-24 w-24 rounded-[1.4rem]`} />
        <div className={`${pulse} h-11 w-11`} />
      </div>
      <div className="space-y-3 p-6">
        <div className={`${pulse} h-6 w-3/4`} />
        <div className={`${pulse} h-4 w-full`} />
        <div className={`${pulse} h-4 w-5/6`} />
        <div className="flex items-end justify-between pt-6">
          <div className={`${pulse} h-9 w-20`} />
          <div className={`${pulse} h-12 w-32`} />
        </div>
      </div>
    </div>
  );
}

export function PedidoSkeleton() {
  return (
    <div
      aria-hidden
      className="flex items-center gap-3 rounded-2xl border border-pink-100 bg-white p-4"
    >
      <div className="flex-1 space-y-2">
        <div className={`${pulse} h-5 w-32`} />
        <div className={`${pulse} h-4 w-48`} />
      </div>
      <div className={`${pulse} h-6 w-16`} />
      <div className={`${pulse} h-10 w-10 rounded-xl`} />
      <div className={`${pulse} h-10 w-10 rounded-xl`} />
    </div>
  );
}
