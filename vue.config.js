const { mergeSassVariables } = require('@vuetify/cli-plugin-utils')
const path = require('path')

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/demo/materio-vuetify-vuejs-admin-template-free/demo' : '/',
  transpileDependencies: ['vuetify'],
  chainWebpack: config => {
    const modules = ['vue-modules', 'vue', 'normal-modules', 'normal']
    modules.forEach(match => {
      config.module
        .rule('sass')
        .oneOf(match)
        .use('sass-loader')
        .tap(opt => mergeSassVariables(opt, "'@/styles/variables.scss'"))
      config.module
        .rule('scss')
        .oneOf(match)
        .use('sass-loader')
        .tap(opt => mergeSassVariables(opt, "'@/styles/variables.scss';"))
    })
  },
  configureWebpack: {
    devtool: 'source-map',
  },

  // devServer: {
  //   static: {
  //     directory: path.join(__dirname, 'public'),
  //   },
  //   compress: true,
  //   port: 9000,
  // },
}
