const path = require('path')

module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['coverartarchive.org', 'i.ytimg.com'],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  productionBrowserSourceMaps: false,
}
