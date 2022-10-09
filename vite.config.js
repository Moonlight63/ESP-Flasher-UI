import Path from 'path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { createHtmlPlugin } from 'vite-plugin-html'

// const Path = require('path');
// const vuePlugin = require('@vitejs/plugin-vue')

// const { defineConfig } = require('vite');

/**
 * https://vitejs.dev/config
 */
const config = defineConfig({
    root: Path.join(__dirname, 'src', 'renderer'),
    publicDir: 'public',
    server: {
        port: 8080,
    },
    open: false,
    build: {
        outDir: Path.join(__dirname, 'build', 'renderer'),
        emptyOutDir: true,
        manifest: true,
        rollupOptions: {}
    },
    plugins: [
        Vue(),
        Pages({
            dirs: [
                Path.join(__dirname, 'src', 'renderer', 'pages')
            ]
        }),
        AutoImport({
            imports: ['vue', 'vue-router'],
            dts: Path.join(__dirname, 'src', 'renderer', 'auto-imports.d.ts')
        }),
        Components({
            dts: Path.join(__dirname, 'src', 'renderer', 'components.d.ts'),
            dirs: [
                Path.join(__dirname, 'src', 'renderer', 'components')
            ]
        }),
        createHtmlPlugin({
            minify: true,
        })
    ],
    optimizeDeps: {
        include: ['vue', 'vue-router']
    }
});

module.exports = config;
