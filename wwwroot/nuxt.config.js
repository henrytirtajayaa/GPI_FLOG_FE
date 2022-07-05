const pkg = require('./package')

module.exports = {
  mode: 'spa',
  srcDir: 'src/',
  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://use.fontawesome.com/releases/v5.7.2/css/all.css' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#42A5CC' },

  /*
  ** Global CSS
  */
  css: [
    /* Import Font Awesome Icons Set */
    '@/assets/flag-icon-css/css/flag-icon.min.css',
    /* Import Simple Line Icons Set */
    '@/assets/simple-line-icons/css/simple-line-icons.css',
    /* Import Core SCSS */
    '@/assets/scss/style.scss',
    /* Import Custom CSS */
    '@/assets/css/main.css'
  ],
  router: {
    middleware: 'auth',
    linkActiveClass: 'active'
  },
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    //'~/plugins/axios'
    '@/plugins/bootstrap-icon',
    '@/plugins/vee-validate',
    '@/plugins/vue-money',
    '@/plugins/vue-bus-event',
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    'bootstrap-vue/nuxt',
    [
      'nuxt-fontawesome', {
        imports: [
          {
            set: '@fortawesome/free-solid-svg-icons',
            icons: ['fas']
          },
          {
            set: '@fortawesome/free-brands-svg-icons',
            icons: ['fab']
          }
        ]
      }
    ],
    'vue-currency-filter/nuxt',
    ['vue-currency-filter/nuxt', {
      symbol: '', //$
      thousandsSeparator: '.', //','
      fractionCount: 2,
      fractionSeparator: ',', // '.'
      symbolPosition: '',
      symbolSpacing: ''
    }],
  ],
  proxy: {
    '/api': { target: 'http://localhost:5000/' } //66.96.238.237:7000 localhost:5000
  },
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    proxy: true
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      /*
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }*/
    }
  }
}
