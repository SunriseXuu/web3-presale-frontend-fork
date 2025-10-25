import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 静态导出
  output: "export",
  // 代理 API 请求
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "https://api.coinfair.xyz/my-shop/api/v1/:path*", // 代理到后端
      },
    ];
  },
};

export default nextConfig;
