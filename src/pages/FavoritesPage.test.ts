import { mount, flushPromises } from "@vue/test-utils"
import { describe, it, expect, vi, beforeEach } from "vitest"
import FavoritesView from "./FavoritesPage.vue"
import { FavoritesService } from "../api/user/favorites.service"
import type { BookType } from "../types/book"

vi.mock("../components/BookList.vue", () => ({
    default: {
        name: "BookList",
        template: "<div class='book-list'><slot :book='book' v-for='book in books' /></div>",
        props: ["books"],
    },
}))

vi.mock("../components/DummyBook.vue", () => ({
    default: {
        name: "DummyBook",
        props: ["book"],
        template: "<div class='dummy-book'>{{ book.title }}</div>",
    },
}))

vi.mock("../api/user/favorites.service", () => ({
    FavoritesService: {
        getFavoriteBooks: vi.fn(),
    },
}))

describe("FavoritesPage", () => {
    beforeEach(() => {
        vi.resetAllMocks()
    })

    it("displays loading text initially", () => {
        const wrapper = mount(FavoritesView)
        expect(wrapper.text()).toContain("Loading favoite books...")
    })

    it("renders books on successful fetch", async () => {
        const mockBooks: BookType[] = [
            { id: 1, title: "Book One", authors: [], summaries: [], translators: [], subjects: [], bookshelves: [], copyright: false, is_favorite: true, status: "want" },
            { id: 2, title: "Book Two", authors: [], summaries: [], translators: [], subjects: [], bookshelves: [], copyright: false, is_favorite: true, status: "done" },
        ]

        vi.mocked(FavoritesService.getFavoriteBooks).mockResolvedValue(mockBooks)

        const wrapper = mount(FavoritesView)
        await flushPromises()

        expect(wrapper.findAll(".dummy-book")).toHaveLength(2)
        expect(wrapper.text()).toContain("Book One")
        expect(wrapper.text()).toContain("Book Two")
    })

    it("displays error message on fetch failure", async () => {
        vi.mocked(FavoritesService.getFavoriteBooks).mockRejectedValue(new Error("Fetch failed"))

        const wrapper = mount(FavoritesView)
        await flushPromises()

        expect(wrapper.text()).toContain("Fetch failed")
    })
})
