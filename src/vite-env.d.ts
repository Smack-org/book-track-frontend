/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_USER_SERVICE_URL: string
    readonly VITE_BOOK_SERVICE_URL: string
    readonly VITE_USER_SERVICE_URL: string
    readonly VITE_AUTH_SERVICE_URL: string

    readonly VITE_ENABLE_MSW_WORKER: "on" | "off"
    readonly VITE_ENABLE_AUTHORIZATION: "on" | "off"
}
