import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "c.dns-shop.ru",
        port: "",
        pathname: "/**"
      }
    ]
  }
};

export default nextConfig;
