/// <reference types='vitest' />
import { defineConfig, loadEnv, UserConfig, UserConfigExport } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default ({ mode }: UserConfig): UserConfigExport => {
    process.env = {
        ...process.env,
        ...loadEnv(mode || 'development', process.cwd()),
    };
    return defineConfig({
        root: __dirname,
        cacheDir: '../../node_modules/.vite/apps/web',
        server: {
            port: 4200,
            host: 'localhost',
        },
        preview: {
            port: 4300,
            host: 'localhost',
        },
        plugins: [react(), nxViteTsPaths()],
        build: {
            minify: 'terser',
            sourcemap: mode === 'development',
            chunkSizeWarningLimit: 1024 * 1024,
            outDir: '../../dist/apps/web',
            reportCompressedSize: true,
            commonjsOptions: {
                transformMixedEsModules: true,
            },
        },
        test: {
            globals: true,
            cache: {
                dir: '../../node_modules/.vitest',
            },
            environment: 'jsdom',
            include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

            reporters: ['default'],
            coverage: {
                reportsDirectory: '../../coverage/apps/web',
                provider: 'v8',
            },
        },
        esbuild: {
            logOverride: { 'this-is-undefined-in-esm': 'silent' },
        },
        css: {
            modules: {
                generateScopedName:
                    mode === 'development'
                        ? '[name]__[local]___[hash:base64:5]'
                        : '[hash:base64:8]',
                scopeBehaviour: 'local',
                localsConvention: 'camelCase',
            },
            postcss: {
                plugins: [
                    {
                        postcssPlugin: 'internal:charset-removal',
                        AtRule: {
                            charset: (atRule) => {
                                if (atRule.name === 'charset') {
                                    atRule.remove();
                                }
                            },
                        },
                    },
                ],
            },
        },
    });
};
