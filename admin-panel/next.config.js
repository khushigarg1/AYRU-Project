const path = require('path');

module.exports = {
  env: {
    REACT_APP_BASE_URL: 'http://localhost:3000',
    WHATSAPP_NUMBER: '9166564901',
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };
    return config;
  },
}