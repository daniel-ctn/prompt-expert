import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // @ts-expect-error -- viewTransition added in Next.js 16.2, types not yet updated
  viewTransition: true,
};

export default nextConfig;
