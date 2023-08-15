// eslint-disable-next-line @typescript-eslint/no-var-requires
const { i18n } = require('./next-i18next.config.js');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  env: {
    VIVO_URL_BASE: process.env.VIVO_URL_BASE,
    VIVO_URL_ITEM_BASE: process.env.VIVO_URL_ITEM_BASE,
    LANGUAGES: process.env.LANGUAGES,
    ELASTIC_INDEXES: process.env.ELASTIC_INDEXES,
    PUBLIC_RECAPTCHA_SITE_KEY: process.env.PUBLIC_RECAPTCHA_SITE_KEY,
  },
  i18n,
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
    };

    return config;
  },
};

module.exports = nextConfig;
