/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  env: {
    VIVO_URL_BASE: process.env.VIVO_URL_BASE,
  },
}

module.exports = nextConfig
