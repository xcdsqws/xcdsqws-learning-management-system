/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.externals = [...config.externals, "bcrypt"]
    return config
  },
}

module.exports = nextConfig
