import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "payroll-matching-figure.ngrok-free.dev",
    "172.20.10.6",
  ],
};

export default nextConfig;
