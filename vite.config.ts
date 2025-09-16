import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
        plugins: [react()],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
                '@src': path.resolve(__dirname, './src'),
                '@layouts': path.resolve(__dirname, './src/layouts'),
                '@pages': path.resolve(__dirname, './src/pages'),
                '@components': path.resolve(__dirname, './src/components'),
                '@constants': path.resolve(__dirname, './src/constants'),
                '@styles': path.resolve(__dirname, './src/styles'),
                '@recoil': path.resolve(__dirname, './src/recoil'),
                '@utils': path.resolve(__dirname, './src/utils'),
                '@router': path.resolve(__dirname, './src/router'),
            },
            extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.cjs'],
        },
        server: {
            port: 3000,
            open: true,
        },
        build: {
            outDir: 'build',
            sourcemap: env.GENERATE_SOURCEMAP !== 'false',
        },
        define: {
            'process.env': JSON.stringify(env),
            global: 'globalThis',
        },
        esbuild: {
            drop: command === 'build' ? ['console', 'debugger'] : [],
        },
    };
});
