import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Genera .next/standalone: un servidor con solo los archivos y paquetes que de
  // verdad usa la app (sin el resto de node_modules), pensado para copiar a una
  // imagen de Docker sin tener que instalar dependencias dentro de ella.
  output: "standalone",
};

export default nextConfig;
