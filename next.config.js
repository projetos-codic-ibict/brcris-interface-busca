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
    INDEX_PUBLICATION: process.env.INDEX_PUBLICATION,
    INDEX_PERSON: process.env.INDEX_PERSON,
    INDEX_ORGUNIT: process.env.INDEX_ORGUNIT,
    INDEX_JOURNAL: process.env.INDEX_JOURNAL,
    INDEX_PROGRAM: process.env.INDEX_PROGRAM,
    INDEX_PATENT: process.env.INDEX_PATENT,
    INDEX_GROUP: process.env.INDEX_GROUP,
    INDEX_SOFTWARE: process.env.INDEX_SOFTWARE,
    BRCRIS_HOST_BASE: process.env.BRCRIS_HOST_BASE,
  },
  i18n,
  // webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
    };

    return config;
  },
};

module.exports = nextConfig;
