import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  allowedDevOrigins: ['192.168.1.2', '192.168.1.30'],
};

export default nextConfig;
