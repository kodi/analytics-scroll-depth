import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'

export default {
  entry      : 'src/index.js',
  format     : 'umd',
  moduleId   : 'analytics-scroll-depth',
  moduleName : 'AnalyticsScrollDepth',
  dest       : 'dist/index.js',
  plugins    : [
    resolve(),
    babel({
      exclude: 'node_modules/**',
    }),
  ],
  banner: '/* NICK MICKLEY @TODO */',
}
