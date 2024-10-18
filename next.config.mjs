/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'aire.nl.gob.mx',
        port: '',
        pathname: '/Sima2017phpgoogle/images/**',
      },
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.(png|jpg|gif)$/i,
      type: 'asset/resource',
    });

    return config;
  },
};

export default nextConfig;
