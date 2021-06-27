const path = require('path')

module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['coverartarchive.org'],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
}
