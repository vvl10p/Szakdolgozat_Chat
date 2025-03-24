import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import fs from 'fs';

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        https: {
            key: fs.readFileSync('./cert/key.pem'),
            cert: fs.readFileSync('./cert/cert.pem')
        }
    }
})
