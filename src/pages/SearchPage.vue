<script setup lang="ts">
import BookList from "../components/BookList.vue"
import { BookService } from "../api/book.service"
import { debounce } from "lodash-es"
import type { BookType } from "../types/book"
import { useRoute, useRouter, type LocationQuery } from "vue-router"
import { ref } from "vue"

const route = useRoute()
const router = useRouter()

type SearchProps = {
    query: string
    sort: "ascending" | "descending"
    topic: string
}

const getSearchQuery = (query: LocationQuery): SearchProps => {
    return {
        query: query.query ? String(query.query) : "",
        topic: query.topic ? String(query.topic) : "",
        sort: query.sort === "ascending" || query.sort === "descending" ? query.sort : "descending",
    }
}

const searchProps: SearchProps = getSearchQuery(route.query)

const books = ref<BookType[]>([])
const isLoading = ref(false)
const error = ref("")

const updateBooks = () => {
    updateUrl()

    const debouncedUpdate = debounce(async ({ query, sort, topic }: SearchProps) => {
        const searchParams = {
            query,
            sort,
            topic,
        }

        isLoading.value = true
        error.value = ""

        try {
            books.value = await BookService.searchBooks(searchParams)
        } catch (e) {
            console.log(`[LOG] (SearchBooks.vue:82): ${e}`)
            error.value = `${e}`
        } finally {
            isLoading.value = false
        }
    }, 300)

    debouncedUpdate(searchProps)
}

const updateUrl = () => {
    router.push({
        query: {
            query: searchProps.query || undefined,
            sort: searchProps.sort !== "descending" ? searchProps.sort : undefined,
            topic: searchProps.topic || undefined,
        },
    })
}

updateBooks()
</script>

<template>
    <article>
        <form @submit.prevent="updateBooks">
            <div>
                <label for="query">search (title or author): </label>
                <input id="query" v-model="searchProps.query" type="text" />
            </div>

            <div>
                <label for="popularity">popularity sort: </label>
                <select id="" v-model="searchProps.sort" name="popularity">
                    <option value="ascending">ascending</option>
                    <option value="descending">descending</option>
                </select>
            </div>

            <div>
                <label for="topic">topic: </label>
                <input id="topic" v-model="searchProps.topic" type="text" />
            </div>

            <button>search</button>
        </form>
    </article>

    <div>
        <p v-if="isLoading">Loading...</p>
        <p v-else-if="!isLoading && error">
            {{ error }}
        </p>
        <BookList v-else :books="books" />
    </div>
</template>

<style scoped>
article {
    background: #f5f5f5;
    padding: 1.5rem;
    border-radius: 8px;
    max-width: 600px;
    margin: 2rem auto;
}

form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

div {
    display: flex;
    flex-direction: column;
}

label {
    font-weight: bold;
    margin-bottom: 0.3rem;
    color: #2c3e50;
}

input,
select {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
}

button {
    background: #27ae60;
    color: white;
    border: none;
    padding: 0.7rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background 0.2s;
}

button:hover {
    background: #219653;
}

p.error {
    color: #e74c3c;
    margin: 1rem 0;
}
</style>
