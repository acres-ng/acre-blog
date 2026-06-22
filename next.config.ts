import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: process.env.NODE_ENV === "production" ? "https" : "http",
        hostname: process.env.STRAPI_HOSTNAME ?? "localhost",
        port: process.env.NODE_ENV === "production" ? "" : "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: 'http',
        hostname: process.env.STRAPI_HOSTNAME ?? "localhost",
        port: '1337',
        pathname: '/uploads/**',
      },
    ],
    dangerouslyAllowLocalIP: true,
  },
};

export default nextConfig;
