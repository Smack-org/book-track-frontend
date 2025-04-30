import type { BookDTO } from "../../types/bookDTO"
import favoriteHandlers from "./favorites"
import booksHandlers from "./books"

export const handlers = (mockBooks: BookDTO[]) => {
    return [...favoriteHandlers(mockBooks), ...booksHandlers(mockBooks)]
}
