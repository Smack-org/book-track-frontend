import { createApp } from "vue"
import "./style.css"
import "./reset.css"
import App from "./App.vue"
import router from "./router"
import { createPinia } from "pinia"

if (import.meta.env.DEV && import.meta.env.VITE_ENABLE_MSW_WORKER === "on") {
    const { worker } = await import("./mocks/browser")
    await worker.start()
}

createApp(App).use(createPinia()).use(router).mount("#app")
