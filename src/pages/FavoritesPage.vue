<script setup lang="ts">
import { onMounted, ref } from "vue"
import BookList from "../components/BookList.vue"
import useFavoritesStore from "../stores/favorites.store"

const isLoading = ref(true)
const error = ref("")

const favStore = useFavoritesStore()

onMounted(async () => {
    try {
        await favStore.fetchFavoriteBooks()
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
        <BookList v-else :books="favStore.books" />
    </div>
</template>

<style lang="css" scoped></style>
