import { mount, flushPromises } from "@vue/test-utils"
import { describe, it, expect, vi, beforeEach } from "vitest"
import ReadingListView from "./ReadingListPage.vue"
import { BooksWithStatusesService } from "../api/user/booksWithStatus.service"
import type { BookType } from "../types/book"

vi.mock("../components/BookList.vue", () => ({
    default: {
        name: "BookList",
        props: ["books"],
        template: `<div class="book-list"><slot v-for="book in books" :book="book" /></div>`,
    },
}))

vi.mock("../components/Book.vue", () => ({
    default: {
        name: "Book",
        props: ["book"],
        template: `<div class="dummy-book">{{ book.title }}</div>`,
    },
}))

vi.mock("../api/user/booksWithStatus.service", () => ({
    BooksWithStatusesService: {
        get: vi.fn(),
    },
}))

const createBook = (id: number, title: string): BookType => ({
    id,
    title,
    authors: [],
    summaries: [],
    translators: [],
    subjects: [],
    bookshelves: [],
    copyright: false,
    is_favourite: false,
    status: "reading",
})

describe("ReadingListView.vue", () => {
    beforeEach(() => {
        vi.resetAllMocks()
    })

    it("shows loading state initially", () => {
        const wrapper = mount(ReadingListView)
        expect(wrapper.text()).toContain("Loading reading list...")
    })

    it("renders books on successful fetch", async () => {
        const mockBooks: BookType[] = [createBook(1, "The Hobbit"), createBook(2, "Dune")]
        vi.mocked(BooksWithStatusesService.get).mockResolvedValue(mockBooks)

        const wrapper = mount(ReadingListView)
        await flushPromises()

        const bookEls = wrapper.findAll(".dummy-book")
        expect(bookEls).toHaveLength(2)
        expect(bookEls[0].text()).toBe("The Hobbit")
        expect(bookEls[1].text()).toBe("Dune")
    })

    it("renders error message on fetch failure", async () => {
        vi.mocked(BooksWithStatusesService.get).mockRejectedValue(new Error("Fetch error"))

        const wrapper = mount(ReadingListView)
        await flushPromises()

        expect(wrapper.text()).toContain("Fetch error")
    })
})
