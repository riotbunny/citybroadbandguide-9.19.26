import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client', 'prisma'],
  outputFileTracingIncludes: {
    "/*": ["./prisma/dev.db"],
    "/internet/**/*": ["./prisma/dev.db"],
    "/admin/**/*": ["./prisma/dev.db"]
  }
};

export default nextConfig;