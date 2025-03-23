import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        globals: true,
        environment: 'happy-dom',
        coverage: {
            include: ['src/**/*.ts'],
            exclude: ['src/index.ts', 'src/types.ts', 'src/*.{spec,spec-d}.ts'],
        },
    },
})
