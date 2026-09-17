import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  // Falta configurar el archivo .env.local (ver .env.example) con las
  // credenciales del proyecto de Supabase creado para esta página.
  console.error(
    "Faltan VITE_SUPABASE_URL y/o VITE_SUPABASE_ANON_KEY en las variables de entorno.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
