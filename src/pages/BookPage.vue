<script setup lang="ts">
import { onMounted, ref } from "vue"
import DummyBook from "../components/DummyBook.vue"
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
    <div class="book">
        <p v-if="error">error</p>
        <p v-else-if="isBookLoading">Loading...</p>
        <DummyBook v-else-if="book" :book="book" />
    </div>
</template>
