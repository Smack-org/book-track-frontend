import { setupWorker } from "msw/browser"
import { handlers } from "./handlers"
import type { BookDTO } from "../types/bookDTO"

export const worker = (mockBooks: BookDTO[]) => {
    return setupWorker(...handlers(mockBooks))
}
