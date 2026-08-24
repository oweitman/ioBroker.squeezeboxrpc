import react from '@vitejs/plugin-react';
import path from 'node:path';
import commonjs from 'vite-plugin-commonjs';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import { federation } from '@module-federation/vite';
import { moduleFederationShared } from '@iobroker/types-vis-2/modulefederation.vis.config';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const pack = JSON.parse(readFileSync('./package.json').toString());
const sourceDirectory = path.dirname(fileURLToPath(import.meta.url));

export default {
    plugins: [
        federation({
            manifest: true,
            name: 'vis2squeezeboxrpc',
            filename: 'customWidgets.js',
            exposes: {
                './PlayersWidget': './src/PlayersWidget',
                './translations': './src/translations',
            },
            remotes: {},
            shared: moduleFederationShared(pack),
        }),
        react(),
        viteTsConfigPaths(),
        commonjs(),
    ],
    server: {
        port: 4173,
        proxy: {
            '/_socket': 'http://localhost:8082',
            '/vis.0': 'http://localhost:8082',
            '/adapter': 'http://localhost:8082',
            '/vis': 'http://localhost:8082',
            '/widgets': 'http://localhost:8082/vis',
        },
    },
    base: './',
    build: {
        target: 'chrome89',
        outDir: './build',
        rollupOptions: {
            output: {
                entryFileNames: 'assets/e-[hash].js',
                chunkFileNames: 'assets/c-[hash].js',
                assetFileNames: 'assets/a-[hash][extname]',
            },
        },
    },
    resolve: {
        alias: {
            fs: path.resolve(sourceDirectory, 'src/empty.js'),
            path: path.resolve(sourceDirectory, 'src/empty.js'),
        },
    },
};
