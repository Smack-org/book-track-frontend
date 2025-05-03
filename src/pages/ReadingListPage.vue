<script setup lang="ts">
import { onMounted, ref } from "vue"
import BookList from "../components/BookList.vue"
import { BooksWithStatusesService } from "../api/user/booksWithStatus.service"
import type { BookType } from "../types/book"

const isLoading = ref(true)
const error = ref("")

const books = ref<BookType[]>([])

onMounted(async () => {
    try {
        books.value = await BooksWithStatusesService.get("reading")
    } catch (e) {
        if (e instanceof Error) {
            error.value = e.message
        } else {
            error.value = "failed to get reading list"
        }
    } finally {
        isLoading.value = false
    }
})
</script>

<template>
    <h1>Reading List</h1>

    <div>
        <p v-if="isLoading">Loading reading list...</p>
        <p v-else-if="!isLoading && error">
            {{ error }}
        </p>
        <BookList v-else :books="books" />
    </div>
</template>

<style lang="css" scoped></style>
