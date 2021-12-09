module.exports = {
    i18n: {
        locales: ['vn','ja', 'en'],
        defaultLocale: 'vn',
        localeDetection: true,
      },
      domains: [
        {
          domain: 'localhost:3000',
          defaultLocale: 'vn',
        },
        {
          domain: 'localhost:3000/en',
          defaultLocale: 'en',
          // an optional http field can also be used to test
          // locale domains locally with http instead of https
          //http: true,
        },
      ]
  }