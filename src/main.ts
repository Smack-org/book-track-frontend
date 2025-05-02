import { createApp } from "vue"
import "./style.css"
import "./reset.css"
import App from "./App.vue"
import router from "./router"
import { createPinia } from "pinia"
import { generateMockBookDTOs } from "./utils/mockBooks"

const initApp = () => {
    const app = createApp(App)
    app.use(createPinia())
    app.use(router)

    if (import.meta.env.VITE_ENABLE_MSW_WORKER === "on") {
        import("./mocks/browser")
            .then(({ worker }) => {
                const books = generateMockBookDTOs(20)
                return worker(books)
                    .start({ quiet: true })
                    .then(() => {
                        return app
                    })
            })
            .catch((error) => {
                console.error("MSW initialization failed:", error)
                return app
            })
            .then((app) => {
                app.mount("#app")
            })
    } else {
        app.mount("#app")
    }
}

initApp()
