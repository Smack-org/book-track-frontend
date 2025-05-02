import { createApp } from "vue"
import "./style.css"
import "./reset.css"
import App from "./App.vue"
import router from "./router"
import { createPinia } from "pinia"
import { generateMockBookDTOs } from "./utils/mockBooks"

if (import.meta.env.VITE_ENABLE_MSW_WORKER === "on") {
    const { worker } = await import("./mocks/browser")

    const books = generateMockBookDTOs(20)

    await worker(books).start()
}

createApp(App).use(createPinia()).use(router).mount("#app")
