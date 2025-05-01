<script setup lang="ts">
import { onMounted, ref } from "vue"
import BookList from "../components/BookList.vue"
import useBooksWithStatusesStore from "../stores/booksWithStatuses.store"

const isLoading = ref(true)
const error = ref("")

const booksWithStatusesStore = useBooksWithStatusesStore()

onMounted(async () => {
    try {
        await booksWithStatusesStore.fetch()
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
        <BookList v-else :books="booksWithStatusesStore.getBooks('reading')" />
    </div>
</template>

<style lang="css" scoped></style>
