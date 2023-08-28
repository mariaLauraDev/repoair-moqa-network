const { defineConfig } = require('@vue/cli-service');
const CspHtmlWebpackPlugin = require('csp-html-webpack-plugin');

module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "@/assets/styles/variables.scss";`
      }
    }
  },
  configureWebpack: {
    plugins: [
      new CspHtmlWebpackPlugin(
        {
          'default-src': "'self'",
          'script-src': ["'self'", "'unsafe-eval'", "https://*.firebase.com", "https://firebaseio.com"],
          'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          'img-src': ["'self'", "data:"],
          'font-src': ["'self'", "https:"],
          'connect-src': ["'self'", "https:"],
          'frame-src': ["'self'"],
          'media-src': ["'self'"],
          'connect-src': ["'self'", "https:", "https://moqa-portal.vercel.app/", "http://localhost:8080/"],
        },
        {
          enabled: true,
          hashingMethod: 'sha256',
          hashEnabled: {
            'script-src': true,
            'style-src': true,
          },
          nonceEnabled: {
            'script-src': true,
            'style-src': true,
          },
        }
      ),
    ],
  },
});
