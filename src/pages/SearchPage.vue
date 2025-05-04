<script setup lang="ts">
import BookList from "../components/BookList.vue"
import { BookService } from "../api/book.service"
import { debounce } from "lodash-es"
import type { BookType } from "../types/book"
import { reactive, ref, watch } from "vue"
import Pagination from "../components/Pagination.vue"

type SearchProps = {
    query: string
    sort: "ascending" | "descending"
    topic: string
}

const books = ref<BookType[]>([])
const isLoading = ref(false)
const error = ref("")

const searchProps: SearchProps = reactive({
    query: "",
    sort: "ascending",
    topic: "",
})

const currentPage = ref(1)
const totalBooks = ref(1)
const BOOKS_PER_PAGE = 20

watch(searchProps, () => {
    currentPage.value = 1
})

updateBooks()

function totalPages() {
    return Math.ceil(totalBooks.value / BOOKS_PER_PAGE)
}

function updateBooks() {
    const debouncedUpdate = debounce(async ({ query, sort, topic }: SearchProps) => {
        const searchParams = {
            query,
            sort,
            topic,
        }

        isLoading.value = true
        error.value = ""

        try {
            const response = await BookService.searchBooks(searchParams)
            books.value = response.books
            totalBooks.value = response.count
        } catch (e) {
            if (e instanceof Error) {
                error.value = `${e.message}`
            } else {
                error.value = `failed to get books ${e}`
            }
        } finally {
            isLoading.value = false
        }
    }, 300)

    debouncedUpdate(searchProps)
}

function updateSelectedPage(page: number) {
    currentPage.value = page
    updateBooks()
}
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
        <Pagination v-else :cur-page="currentPage" :pages-num="totalPages()" @selected-page="updateSelectedPage">
            found {{ totalBooks }} books
            <BookList :books="books" />
        </Pagination>
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
