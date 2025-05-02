<script setup lang="ts">
import { onMounted, ref } from "vue"
import Book from "../components/Book.vue"
import { BookService } from "../api/book.service"
import type { BookType } from "../types/book"

const isBookLoading = ref(true)
const book = ref<BookType | null>(null)
const error = ref("")
const props = defineProps({
    bookId: { type: Number, required: true },
})

async function loadBook(bookId: number) {
    try {
        book.value = await BookService.getBookById(bookId)
        isBookLoading.value = false
    } catch (e) {
        if (e instanceof Error) {
            error.value = e.message
        } else {
            error.value = `${e}`
        }
        isBookLoading.value = true
    }
}

onMounted(() => {
    loadBook(props.bookId)
})
</script>

<template>
    <p v-if="error">error</p>
    <p v-else-if="isBookLoading">Loading...</p>
    <Book v-else-if="book" :book="book" />
</template>

<style lang="css" scoped></style>
