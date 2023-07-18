const path = require('path');
const watch = process.argv.includes('--watch')
const svgrPlugin = require('esbuild-plugin-svgr');
const sassPlugin = require('esbuild-sass-plugin');

require("esbuild").build({
    entryPoints: ["application.js"],
    bundle: true,
    sourcemap: true,
    outdir: path.join(process.cwd(), "app/assets/builds"),
    absWorkingDir: path.join(process.cwd(), "app/javascript"),
    publicPath: 'app/assets',
    loader: {
        '.js': 'jsx',
    },
    watch: watch,
    plugins: [svgrPlugin(), sassPlugin.default({type: "style"})],
}).catch(() => process.exit(1));
