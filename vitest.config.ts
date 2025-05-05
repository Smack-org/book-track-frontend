import { defineConfig } from "vitest/config"
import vue from "@vitejs/plugin-vue"

export default defineConfig({
    test: {
        coverage: {
            reporter: ["text", "json", "html"],
        },
    },
    plugins: [vue()],
})
