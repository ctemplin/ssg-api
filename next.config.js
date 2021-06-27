const path = require('path')

module.exports = {
  reactStrictMode: true,
  target: "serverless",
  images: {
    domains: ['coverartarchive.org'],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
}
