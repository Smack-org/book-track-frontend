/**
 * @vitest-enviroment
 */

import { describe, it, vi, beforeEach, expect } from "vitest"
import { mount, flushPromises } from "@vue/test-utils"
import { createTestingPinia } from "@pinia/testing"
import { FavoritesService } from "../api/user/favorites.service"
import { BooksWithStatusesService } from "../api/user/booksWithStatus.service"
import Dashboard from "./Dashboard.vue"
import type { BookType } from "../types/book"

vi.mock("../components/BookList.vue", () => ({
    default: {
        name: "BookList",
        props: ["books"],
        template: "<div class='mock-book-list'><slot v-for='book in books' :book='book' /></div>",
    },
}))
vi.mock("../components/DummyBook.vue", () => ({
    default: {
        name: "DummyBook",
        props: ["book"],
        template: "<div class='mock-dummy-book'>{{ book.title }}</div>",
    },
}))

vi.mock("../api/user/favorites.service", () => ({
    FavoritesService: {
        getFavoriteBooks: vi.fn(),
    },
}))
vi.mock("../api/user/booksWithStatus.service", () => ({
    BooksWithStatusesService: {
        get: vi.fn(),
    },
}))

const mockBooks = (label: string = "", n = 2): BookType[] =>
    Array.from({ length: n }, (_, i) => ({
        id: i + 1,
        title: `${label} Book ${i + 1}`,
        authors: [],
        summaries: [],
        translators: [],
        subjects: [],
        bookshelves: [],
        copyright: false,
        is_favorite: false,
        status: "--",
    }))

describe("Dashboard.vue", () => {
    beforeEach(() => {
        vi.mocked(FavoritesService.getFavoriteBooks).mockResolvedValue(mockBooks("favorite", 1))
        vi.mocked(BooksWithStatusesService.get).mockImplementation((status) => {
            return Promise.resolve(mockBooks(status, status === "want" ? 2 : 3))
        })
    })

    it("renders user info and loads books", async () => {
        const wrapper = mount(Dashboard, {
            global: {
                plugins: [
                    createTestingPinia({
                        initialState: {
                            userStore: {
                                user: {
                                    username: "testuser",
                                    login: "testlogin",
                                    created_at: "2023-01-01T00:00:00Z",
                                },
                            },
                        },
                        stubActions: false,
                    }),
                ],
            },
        })

        await flushPromises()

        expect(wrapper.text()).toContain("Welcome, testuser")
        expect(wrapper.text()).toContain("Member since: 01/01/2023")

        expect(FavoritesService.getFavoriteBooks).toHaveBeenCalled()
        expect(BooksWithStatusesService.get).toHaveBeenCalledWith("want")
        expect(BooksWithStatusesService.get).toHaveBeenCalledWith("reading")
        expect(BooksWithStatusesService.get).toHaveBeenCalledWith("done")

        expect(wrapper.findAll(".stat-card")[0]?.text()).toContain("3")
        expect(wrapper.findAll(".stat-card")[1]?.text()).toContain("2")
        expect(wrapper.findAll(".stat-card")[2]?.text()).toContain("3")
        expect(wrapper.findAll(".stat-card")[3]?.text()).toContain("1")

        expect(wrapper.findAll(".mock-dummy-book").length).toBe(5)
    })
})
