import { http, HttpResponse } from "msw"
import type { BookDTO, BookDTOStatus } from "../../types/bookDTO"
import withDelay from "../withDelay"
import type { AddToReadingListRequest, AddToReadingListResponse, GetReadingListsParameters, GetReadingListsResponse, RemoveFromReadingListParameters } from "../../api/user/types/booksStatuses"

const USER_SERVICE_URL = import.meta.env.VITE_USER_SERVICE_URL

export default function (allBooks: BookDTO[]) {
    const getBooksWithStatus = (status: BookDTOStatus): BookDTO[] => allBooks.filter((book) => book.status === status)
    const getBooksWithAnyStatus = (): BookDTO[] => allBooks.filter((book) => book.status !== "")

    return [
        http.get<GetReadingListsParameters, object, GetReadingListsResponse>(
            USER_SERVICE_URL + "/reading-list",
            withDelay(250, async ({ request }) => {
                const url = new URL(request.url)
                const status = url.searchParams.get("status") as BookDTOStatus | null

                const filteredBooks = status ? getBooksWithStatus(status) : getBooksWithAnyStatus()

                const response = filteredBooks.map((book) => ({
                    book,
                    added_at: new Date().toISOString(),
                }))

                return HttpResponse.json(response)
            })
        ),
        http.delete<RemoveFromReadingListParameters>(
            USER_SERVICE_URL + "/reading-list/:book_id",
            withDelay(250, async ({ params }) => {
                const book_id = Number(params.book_id)

                const bookInx = allBooks.findIndex((book) => book.id === book_id)
                if (bookInx === -1) {
                    return new HttpResponse(null, { status: 404 })
                }

                allBooks[bookInx].status = ""

                return new HttpResponse(null, { status: 204 })
            })
        ),
        http.post<object, AddToReadingListRequest, AddToReadingListResponse>(
            USER_SERVICE_URL + "/reading-list",
            withDelay(250, async ({ request }) => {
                const { book_id, status } = await request.json()

                const bookInx = allBooks.findIndex((book) => book.id === book_id)
                if (bookInx === -1) {
                    return new HttpResponse(null, { status: 404 })
                }

                allBooks[bookInx].status = status

                return new HttpResponse(null, { status: 201 })
            })
        ),
    ]
}
