import svelte from 'rollup-plugin-svelte'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import livereload from 'rollup-plugin-livereload'
import { terser } from 'rollup-plugin-terser'
import scss from 'rollup-plugin-scss'
import url from 'rollup-plugin-url'

const production = !process.env.ROLLUP_WATCH

function getOutput(name) {
	return {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: `public/assets/${name}.js`
	}
}
const plugins = [
		svelte({dev: !production}),
		scss(),
		url({
			include: ['**/*.woff2', '**/*.woff'],
			publicFiles: './public/assets',
			fileName: '[dirname][name][extname]'
		}),
		resolve(),
		commonjs(),
		!production && livereload('public'),
		production && terser()

	]


export default [{
	input: 'src/main.js',
	output: getOutput('index'),
	plugins,
	watch: {clearScreen: false}
}]
