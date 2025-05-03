import { http, HttpResponse } from "msw"
import type { BookDTO } from "../../types/bookDTO"
import withDelay from "../withDelay"
import type {
    AddFavoriteBookRequest,
    RemoveFavoriteBookParameters,
    AddFavoriteBookResponse,
    GetFavoriteBooksParameters,
    GetFavoriteBooksResponse,
    RemoveFavoriteBookResponse,
} from "../../api/user/types/favorites.d.ts"

const USER_SERVICE_URL = import.meta.env.VITE_USER_SERVICE_URL

export default function (allBooks: BookDTO[]) {
    const getFavoriteBooks = (): BookDTO[] => allBooks.filter((book) => book.is_favorite)

    return [
        http.get<GetFavoriteBooksParameters, object, GetFavoriteBooksResponse>(
            USER_SERVICE_URL + "/favourites",

            withDelay(250, () => {
                const resonse = getFavoriteBooks().map((book) => ({ book, added_at: new Date().toISOString() }))

                return HttpResponse.json(resonse)
            })
        ),
        http.post<object, AddFavoriteBookRequest, AddFavoriteBookResponse>(
            USER_SERVICE_URL + "/favourites",

            withDelay(250, async ({ request }) => {
                const { book_id: bookId } = await request.json()

                const addedBook = allBooks.find((book) => book.id === bookId)!
                addedBook.is_favorite = true

                const response = { book: addedBook, added_at: new Date().toISOString() }
                return HttpResponse.json(response)
            })
        ),
        http.delete<RemoveFavoriteBookParameters, object, RemoveFavoriteBookResponse>(
            USER_SERVICE_URL + "/favourites/:book_id",

            withDelay(250, async ({ params }) => {
                const book_id = parseInt(params.book_id)

                const removedBook = allBooks.find((book) => book.id === book_id)!
                removedBook.is_favorite = false

                const response = { book: removedBook, added_at: new Date().toISOString() }
                return HttpResponse.json(response)
            })
        ),
    ]
}
