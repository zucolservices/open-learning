import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Phase 1 is a fully static site: `next build` writes plain files to out/.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
