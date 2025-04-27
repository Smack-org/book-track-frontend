<script lang="ts">
import { defineComponent } from "vue"
import Book from "../components/Book.vue"
import { BookService } from "../api/book.service"
import type { Book as BookType } from "../types/book"

export default defineComponent({
    components: { Book },

    props: {
        bookId: {
            type: Number,
            required: true,
        },
    },

    data() {
        return {
            isBookLoading: true,
            book: null as BookType | null,
            error: "",
        }
    },

    created() {
        this.loadBook()
    },

    methods: {
        async loadBook() {
            try {
                const book = await BookService.getBookById(this.bookId)
                this.book = book
                this.isBookLoading = false
            } catch (e) {
                this.error = `${e}`
                this.isBookLoading = true
            }
        },
    },
})
</script>

<template>
    <p v-if="error">error</p>
    <p v-else-if="isBookLoading">Loading...</p>
    <Book v-else-if="book" :book="book" />
</template>

<style lang="css" scoped></style>
