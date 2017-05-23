const babel       = require('rollup-plugin-babel')
const eslint      = require('rollup-plugin-eslint')
const uglify      = require('rollup-plugin-uglify')
const packageJson = require('../package.json')

const version     = packageJson.version
const projectName = packageJson.name
const moduleName  = 'AnalyticsScrollDepth'
const entry       = 'src/index.js'

const banner =
  `${'/*!\n' +
  ' * Analytics Scroll Depth v'}${version}\n` +
  ` * (c) ${new Date().getFullYear()} Nick Mickley\n` +
  ' * Released under the MIT License.\n' +
  ' */'

const plugins = [
  eslint(),
  babel({
    exclude: 'node_modules/**',
  }),
]

const builds = {
  cjs: {
    entry,
    dest   : `dist/${projectName}.common.js`,
    format : 'cjs',
    banner,
    moduleName,
    plugins,
  },
  esm: {
    entry,
    dest   : `dist/${projectName}.esm.js`,
    format : 'es',
    banner,
    moduleName,
    plugins,
  },
  umd: {
    entry,
    dest   : `dist/${projectName}.umd.js`,
    format : 'umd',
    banner,
    moduleName,
    plugins,
  },
  iife: {
    entry,
    dest   : `dist/${projectName}.js`,
    format : 'iife',
    banner,
    moduleName,
    plugins,
  },
  'iife-min': {
    entry,
    dest    : `dist/${projectName}.min.js`,
    format  : 'iife',
    banner,
    moduleName,
    plugins : plugins.concat([
      uglify(),
    ]),
  },
}

module.exports = builds[process.env.TARGET]
