import { defineConfig } from 'vite'
import { execSync } from 'node:child_process';
import react from '@vitejs/plugin-react'
import packageJson from './package.json';

let version = `v${packageJson.version}`;
try {
    const commitHash = execSync('git rev-parse HEAD').toString().trim();
    version = `${version} (commit hash: ${commitHash})`;
} catch {
    console.warn('Git commit hash could not be retrieved. Using version only.');
}

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:5259',
                changeOrigin: true,
                secure: false,
            },
        },
    },
    define: {
        'import.meta.env.FRONTEND_VERSION': JSON.stringify(version)
    }
})
