const { i18n } = require('./next-i18next.config.js')

const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  env: {
    VIVO_URL_BASE: process.env.VIVO_URL_BASE,
    LANGUAGES: process.env.LANGUAGES,
    VIVO_URL_HOME: process.env.VIVO_URL_HOME,
  },
  i18n,
}

module.exports = nextConfig
