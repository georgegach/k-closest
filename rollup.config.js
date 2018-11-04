const path = require('path')
const license = require('rollup-plugin-license');
import babel from 'rollup-plugin-babel'
import { uglify as uglifyJS} from 'rollup-plugin-uglify'
import uglifyES from 'rollup-plugin-uglify-es'

export default {
  entry: 'lib/index.js',
  format: 'umd',
  dest: 'lib/index.umd.js',
  name: 'kc',
  plugins: [

    babel({
      exclude: 'node_modules/**' // only transpile our source code
    }),


    license({
      sourceMap: true,

      banner: {
        file: path.join(__dirname, 'LICENSE'),
        encoding: 'utf-8', // Default is utf-8

      },

      thirdParty: {
        output: path.join(__dirname, 'dist', 'dependencies.txt'),
        includePrivate: true, // Default is false.
        encoding: 'utf-8', // Default is utf-8.
      },
    }),


    uglifyES({
      output: {
        comments:"some"
      }
    }),
  ],
  onwarn: function (x) { }
}