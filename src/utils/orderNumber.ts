const STORAGE_KEY = "charolas-locas-order-counter";
const RESET_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 horas

interface OrderCounterState {
  startedAt: number;
  count: number;
}

const readState = (): OrderCounterState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return { startedAt: Date.now(), count: 0 };
    }

    const parsed = JSON.parse(raw) as Partial<OrderCounterState>;

    if (
      typeof parsed.startedAt !== "number" ||
      typeof parsed.count !== "number"
    ) {
      return { startedAt: Date.now(), count: 0 };
    }

    return { startedAt: parsed.startedAt, count: parsed.count };
  } catch {
    return { startedAt: Date.now(), count: 0 };
  }
};

const writeState = (state: OrderCounterState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

/**
 * Genera el siguiente número de pedido de forma consecutiva.
 * El contador se reinicia automáticamente 24 horas después
 * del primer pedido registrado en el ciclo actual.
 */
export const getNextOrderNumber = (): number => {
  const now = Date.now();
  let state = readState();

  if (now - state.startedAt >= RESET_WINDOW_MS) {
    state = { startedAt: now, count: 0 };
  }

  state = { startedAt: state.startedAt, count: state.count + 1 };
  writeState(state);

  return state.count;
};
