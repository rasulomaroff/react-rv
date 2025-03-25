import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['./src/index.ts'],
    format: ['esm', 'cjs'],
    target: 'es2020',
    tsconfig: './tsconfig.json',
    minify: true,
    clean: true,
    sourcemap: true,
    dts: true,
})
