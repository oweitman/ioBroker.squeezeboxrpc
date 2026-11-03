// @ts-expect-error no types
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';
import { moduleFederationShared } from '@iobroker/types-vis-2/modulefederation.vis.config';
import { readFileSync } from 'node:fs';

const pack = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

const config = {
    plugins: [
        federation({
            manifest: true,
            name: 'vis2vissqueezeboxrpcWidgets',
            filename: 'customWidgets.js',
            exposes: {
                './PlayersWidget': './src/widgets/players/PlayersWidget',
                './PlayButtonWidget': './src/widgets/controls/PlayButtonWidget',
                './ForwardButtonWidget': './src/widgets/controls/ForwardButtonWidget',
                './RewindButtonWidget': './src/widgets/controls/RewindButtonWidget',
                './ShuffleButtonWidget': './src/widgets/controls/ShuffleButtonWidget',
                './RepeatButtonWidget': './src/widgets/controls/RepeatButtonWidget',
                './VolumeWidget': './src/widgets/values/VolumeWidget',
                './PlaytimeWidget': './src/widgets/values/PlaytimeWidget',
                './StringWidget': './src/widgets/values/StringWidget',
                './NumberWidget': './src/widgets/values/NumberWidget',
                './DateTimeWidget': './src/widgets/values/DateTimeWidget',
                './ImageWidget': './src/widgets/values/ImageWidget',
                './SyncGroupWidget': './src/widgets/sync/SyncGroupWidget',
                './FavoritesWidget': './src/widgets/favorites/FavoritesWidget',
                './PlaylistWidget': './src/widgets/playlist/PlaylistWidget',
                './PlaylistDetailWidget': './src/widgets/playlist-detail/PlaylistDetailWidget',
                './BrowserWidget': './src/widgets/browser/BrowserWidget',
                './translations': './src/translations',
            },
            remotes: {},
            shared: moduleFederationShared(pack),
            dts: false,
        }),
        react(),
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
    resolve: {
        tsconfigPaths: true,
        dedupe: ['react', 'react-dom', '@emotion/react', '@mui/material', '@mui/system', '@mui/icons-material'],
    },
    build: {
        target: ['chrome89', 'edge89', 'firefox89', 'safari15'],
        outDir: './build',
        sourcemap: true,
    },
    oxc: {
        jsx: {
            development: false,
        },
    },
};

export default config;
