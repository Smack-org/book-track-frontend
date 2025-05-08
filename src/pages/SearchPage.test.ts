import { mount, flushPromises } from "@vue/test-utils"
import SearchBooks from "./SearchPage.vue"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { BookService } from "../api/book.service"
import type { BookType } from "../types/book"

vi.mock("../api/book.service", () => ({
    BookService: {
        searchBooks: vi.fn(),
    },
}))

vi.mock("lodash-es", async () => {
    const actual = await vi.importActual("lodash-es")
    return {
        ...actual,
        debounce: (fn: unknown) => fn,
    }
})

describe("SearchBooks", () => {
    const mockBooks: BookType[] = Array.from({ length: 3 }, (_, i) => ({
        id: i,
        title: `Book ${i}`,
        authors: [],
        summaries: [],
        translators: [],
        subjects: [],
        bookshelves: [],
        copyright: false,
        is_favourite: false,
        status: "reading",
    }))

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("renders loading initially and then books on success", async () => {
        vi.mocked(BookService.searchBooks).mockResolvedValueOnce({
            books: mockBooks,
            count: 3,
        })

        const wrapper = mount(SearchBooks)
        expect(wrapper.find(".loading-message")).toBeTruthy()

        await flushPromises()

        expect(wrapper.find(".found-books").text()).toContain("found 3 books")
        expect(wrapper.findAllComponents({ name: "Book" })).toHaveLength(3)
    })

    it("displays an error if fetch fails", async () => {
        vi.mocked(BookService.searchBooks).mockRejectedValueOnce(new Error("API failure"))

        const wrapper = mount(SearchBooks)
        await flushPromises()

        const errorEl = wrapper.find(".error-message")
        expect(errorEl.exists()).toBe(true)
        expect(errorEl.text()).toContain("API failure")
    })

    it("updates search on form input", async () => {
        vi.mocked(BookService.searchBooks).mockResolvedValue({
            books: mockBooks,
            count: 3,
        })

        const wrapper = mount(SearchBooks)
        await flushPromises()

        await wrapper.get("input#query").setValue("vue")
        await wrapper.get("form").trigger("submit.prevent")

        await flushPromises()

        expect(BookService.searchBooks).toHaveBeenCalledWith({
            query: "vue",
            sort: "ascending",
            topic: "",
        })
    })

    it("changes page on pagination click", async () => {
        vi.mocked(BookService.searchBooks).mockResolvedValue({
            books: mockBooks,
            count: 40,
        })

        const wrapper = mount(SearchBooks)
        await flushPromises()

        wrapper.getComponent({ name: "Pagination" }).vm.$emit("selected-page", 2)
        await flushPromises()

        expect(wrapper.text()).toContain("found 40 books")
        expect(BookService.searchBooks).toHaveBeenCalledTimes(2)
    })
})
