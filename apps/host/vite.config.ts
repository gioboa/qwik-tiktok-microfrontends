import { qwikCity } from '@builder.io/qwik-city/vite';
import { qwikReact } from '@builder.io/qwik-react/vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
import { qwikNxVite } from 'qwik-nx/plugins';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {
  const isDev = mode !== 'production';

  return {
    cacheDir: '../../node_modules/.vite/apps/host',
    plugins: [
      qwikReact(),
      qwikNxVite(),
      qwikCity(),
      qwikVite({
        client: {
          outDir: '../../dist/apps/host/client',
        },
        ssr: {
          outDir: '../../dist/apps/host/server',
        },
      }),

      tsconfigPaths({ root: '../../' }),
    ],
    server: {
      fs: {
        // Allow serving files from the project root
        allow: ['../../'],
      },
    },
    preview: {
      headers: {
        'Cache-Control': 'public, max-age=600',
      },
    },
    test: {
      globals: true,
      cache: {
        dir: '../../node_modules/.vitest',
      },
      environment: 'node',
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    },
  };
});
