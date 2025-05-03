<script setup lang="ts">
import { onMounted, ref } from "vue"
import BookList from "../components/BookList.vue"
import type { BookType } from "../types/book"
import { FavoritesService } from "../api/user/favorites.service"

const isLoading = ref(true)
const error = ref("")

const books = ref<BookType[]>([])

onMounted(async () => {
    try {
        books.value = await FavoritesService.getFavoriteBooks()
    } catch (e) {
        if (e instanceof Error) {
            error.value = e.message
        } else {
            error.value = "failed to get favorite books"
        }
    } finally {
        isLoading.value = false
    }
})
</script>

<template>
    <h1>Favorites</h1>

    <div>
        <p v-if="isLoading">Loading favoite books...</p>
        <p v-else-if="!isLoading && error">
            {{ error }}
        </p>
        <BookList v-else :books="books" />
    </div>
</template>

<style lang="css" scoped></style>
