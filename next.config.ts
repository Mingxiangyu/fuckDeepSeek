import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // 移除或修改这一行，因为 Vercel 会自动处理输出目录
  // distDir: process.env.NODE_ENV === "production" ? "build" : ".next",
  images: {
    domains: [
      "source.unsplash.com",
      "images.unsplash.com",
      "web-assets.same.dev",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "web-assets.same.dev",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
