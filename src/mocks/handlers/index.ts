import type { BookDTO } from "../../types/bookDTO"
import favoriteHandlers from "./favorites"
import booksHandlers from "./books"
import bookWithStatusesHandlers from "./statuses"
import authHandlers from "./auth"

export const handlers = (mockBooks: BookDTO[]) => {
    return [...favoriteHandlers(mockBooks), ...booksHandlers(mockBooks), ...bookWithStatusesHandlers(mockBooks), ...authHandlers()]
}
