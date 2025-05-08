import { mount } from "@vue/test-utils"
import { describe, it, expect } from "vitest"
import BookList from "./BookList.vue"
import type { BookType } from "../types/book"

const createMockBook = (overrides: Partial<BookType> = {}): BookType => ({
    id: 1,
    title: "Default Book",
    authors: [{ name: "Default Author" }],
    subjects: ["Default Subject"],
    is_favourite: false,
    status: "want",
    summaries: [],
    translators: [],
    bookshelves: [],
    copyright: true,
    ...overrides,
})

const mockBooks: BookType[] = [createMockBook({ id: 1, title: "Book 1" }), createMockBook({ id: 2, title: "Book 2" })]

describe("BookList", () => {
    it("renders correct number of books", () => {
        const wrapper = mount(BookList, {
            props: { books: mockBooks },
            slots: {
                default: `<template #default="{ book }"><div class="test-book">{{ book.title }}</div></template>`,
            },
        })

        expect(wrapper.findAll(".test-book")).toHaveLength(mockBooks.length)
    })

    it("renders correct list structure", () => {
        const wrapper = mount(BookList, {
            props: { books: mockBooks },
        })

        const list = wrapper.find("ul")
        const items = list.findAll("li.books-item")
        expect(list.exists()).toBe(true)
        expect(items).toHaveLength(mockBooks.length)
    })

    it("handles empty book list", () => {
        const wrapper = mount(BookList, {
            props: { books: [] },
        })

        expect(wrapper.find("ul").exists()).toBe(true)
        expect(wrapper.findAll("li")).toHaveLength(0)
    })

    it("reacts to prop changes", async () => {
        const wrapper = mount(BookList, {
            props: { books: [mockBooks[0]] },
            slots: {
                default: `<template #default="{ book }"><div class="test-book">{{ book.title }}</div></template>`,
            },
        })

        expect(wrapper.findAll(".test-book")).toHaveLength(1)
        await wrapper.setProps({ books: mockBooks })
        expect(wrapper.findAll(".test-book")).toHaveLength(2)
    })

    it("maintains proper item order", () => {
        const wrapper = mount(BookList, {
            props: { books: mockBooks },
            slots: {
                default: `<template #default="{ book }"><div>{{ book.title }}</div></template>`,
            },
        })

        const titles = wrapper.findAll("div")
        mockBooks.forEach((book, index) => {
            expect(titles[index].text()).toBe(book.title)
        })
    })
})
