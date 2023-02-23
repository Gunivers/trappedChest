/** @type {import('next').NextConfig} */
const nextTranslate = require('next-translate')

module.exports =
  nextTranslate({
    reactStrictMode: true,
    images: {
      domains: ['secure.gravatar.com'],
    },
    // async redirects() {
    //   return [
    //     {
    //       source: '/docs',
    //       destination: 'https://stackoverflow.com/posts/66662033',
    //       permanent: false,
    //       basePath: false
    //     },
    //   ]
    // },
  })