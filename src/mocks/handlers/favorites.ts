import { http, HttpResponse } from "msw"
import type { BookDTO } from "../../types/bookDTO"
import withDelay from "../withDelay"
import type {
    AddFavoriteBookRequest,
    AddFavoriteBookResponse,
    GetFavoriteBooksParameters,
    GetFavoriteBooksResponse,
    RemoveFavoriteBookParameters,
    RemoveFavoriteBookResponse,
} from "../../api/user/user.service.types"

const USER_SERVICE_URL = import.meta.env.VITE_USER_SERVICE_URL

export default function (allBooks: BookDTO[]) {
    const getFavoriteBooks = (): BookDTO[] => allBooks.filter((book) => book.is_favorite)

    return [
        http.get<GetFavoriteBooksParameters, object, GetFavoriteBooksResponse>(
            USER_SERVICE_URL + "/favorites",

            withDelay(250, () => {
                const resonse = getFavoriteBooks().map((book) => ({ book, added_at: new Date().toISOString() }))

                return HttpResponse.json(resonse)
            })
        ),
        http.post<object, AddFavoriteBookRequest, AddFavoriteBookResponse>(
            USER_SERVICE_URL + "/favorites",

            withDelay(250, async ({ request }) => {
                const { bookId } = await request.json()

                const addedBook = allBooks.find((book) => book.id === bookId)!
                addedBook.is_favorite = true

                const response = { book: addedBook, added_at: new Date().toISOString() }
                return HttpResponse.json(response)
            })
        ),
        http.delete<RemoveFavoriteBookParameters, object, RemoveFavoriteBookResponse>(
            USER_SERVICE_URL + "/favorites",

            withDelay(250, async ({ request }) => {
                const url = new URL(request.url)
                const bookId = parseInt(url.searchParams.get("bookId")!)
                console.log(bookId)

                const removedBook = allBooks.find((book) => book.id === bookId)!
                removedBook.is_favorite = false

                const response = { book: removedBook, added_at: new Date().toISOString() }
                return HttpResponse.json(response)
            })
        ),
    ]
}
