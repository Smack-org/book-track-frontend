import { http, HttpResponse } from "msw"
import type { BookDTO, BookDTOStatus } from "../../types/bookDTO"
import withDelay from "../withDelay"
import type {} from "../../api/user/types/favorites"
import type { GetReadingListsParameters, GetReadingListsResponse } from "../../api/user/types/booksStatuses"

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
    ]
}
