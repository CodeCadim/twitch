import * as esbuild from 'esbuild';
import sveltePlugin from 'esbuild-svelte';

const host = "localhost";
const port = 5000;
const isWatch = process.argv.includes('-w');

let baseConfig = {
	outdir: 'public',
	entryPoints: ['./waiting-page.svelte'],
	entryNames: '[name]',
	bundle: true,
	format: 'esm',
	plugins: [
		sveltePlugin({
			compilerOptions: { customElement: true },
		})
	],
};
let devConfig = {
	...baseConfig,
	banner: {
		js: `new EventSource("http://${host}:${port}/esbuild").addEventListener("change",()=>location.reload())`,
	},
	logLevel: 'info',
}
let prodConfig = {
	...baseConfig,
	minify: true,
	sourcemap: true,
}

if (isWatch) {
	let ctx = await esbuild.context(devConfig);
	await ctx.watch();
	await ctx.serve({ servedir: './public/', port: port, host: host });
} else {
	await esbuild.build(prodConfig);
}

