module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'loading...',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  env: {
    baseUrl: process.env.BASE_URL || 'http://localhost:3000'
  },
  /*
   ** Global CSS
   */
  css: [
    'element-ui/lib/theme-chalk/index.css'
  ],
  build: {
    vendor: [
      'axios',
      'element-ui',
      'babel-polyfill'
    ]
  },
  /*
   ** Customize the p rogress-bar color
   */
  loading: {color: '#3B8070'},
  plugins: [
    '~plugins/element-ui',
    '~plugins/global'
  ]
}
