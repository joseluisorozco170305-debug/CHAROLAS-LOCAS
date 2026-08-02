export const horarios = {
  Monday: { closed: true, open: null, close: null },
  Tuesday: { closed: false, open: "12:00", close: "22:00" },
  Wednesday: { closed: false, open: "12:00", close: "22:00" },
  Thursday: { closed: false, open: "12:00", close: "22:00" },
  Friday: { closed: false, open: "12:00", close: "22:00" },
  Saturday: { closed: false, open: "15:00", close: "22:00" },
  Sunday: { closed: false, open: "15:00", close: "22:00" },
} as const;
