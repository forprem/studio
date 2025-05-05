import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
  allowedDevOrigins: [
    'https://9002-idx-studio-1746033160190.cluster-fnjdffmttjhy2qqdugh3yehhs2.cloudworkstations.dev',
    'http://localhost:9002',
    'https://9004-idx-studio-1746033160190.cluster-fnjdffmttjhy2qqdugh3yehhs2.cloudworkstations.dev',
  ],
};

export default nextConfig;
