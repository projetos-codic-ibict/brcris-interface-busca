const { i18n } = require('./next-i18next.config.js')

const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  env: {
    VIVO_URL_BASE: process.env.VIVO_URL_BASE,
    LANGUAGES: process.env.LANGUAGES,
  },
  i18n,
}

module.exports = nextConfig
