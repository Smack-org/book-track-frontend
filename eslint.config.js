import vueParser from "vue-eslint-parser"
import typescriptParser from "@typescript-eslint/parser"
import vuePlugin from "eslint-plugin-vue"
import typescriptPlugin from "@typescript-eslint/eslint-plugin"
import prettierPlugin from "eslint-plugin-prettier"
import js from "@eslint/js"
import globals from "globals"

export default [
    js.configs.recommended,

    {
        files: ["**/*.vue", "**/*.ts"],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.es2021,
            },
            parser: vueParser,
            parserOptions: {
                parser: typescriptParser,
                ecmaVersion: "latest",
                sourceType: "module",
            },
        },
        plugins: {
            "@typescript-eslint": typescriptPlugin,
            vue: vuePlugin,
            prettier: prettierPlugin,
        },
        rules: {
            "vue/no-multiple-template-root": "off",
            "prettier/prettier": "error",
            ...typescriptPlugin.configs.recommended.rules,
            ...vuePlugin.configs["recommended"].rules,
        },
    },

    {
        ignores: ["node_modules", "dist"],
    },
]
