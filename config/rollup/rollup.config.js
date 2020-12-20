import resolve from 'rollup-plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import commonjs from 'rollup-plugin-commonjs'

const opts = {
  'fluent-behavior-tree': [
    'BehaviorTreeBuilder',
    'BehaviorTreeStatus',
    'StateData',
    'BehaviorTreeNodeInterface',
  ],
}

export default {
  input: './src/index.ts',
  output: {
    file: './dist/index.js',
    format: 'es',
  },
  plugins: [
    commonjs(opts),
    typescript({
      typescript: require('typescript'),
    }),
    resolve(),
  ],
  treeshake: true,
}
