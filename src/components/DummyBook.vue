<script setup lang="ts">
import { computed, defineProps, reactive } from "vue"
import { type BookType } from "../types/book.d"

interface Props {
    book: BookType
}

const props = defineProps<Props>()

const { book } = reactive(props)

const bookLink = computed(() => {
    return { name: "book", params: { bookId: `${book.id}` } }
})
</script>

<template>
    <article>
        <h3>
            <RouterLink :to="bookLink">
                {{ book.title }}
            </RouterLink>
        </h3>

        <div>
            <h4>Authors</h4>
            <p v-if="book.authors.length === 0">no authors</p>
            <ul v-else>
                <li v-for="author in book.authors">
                    {{ author.name }}
                </li>
            </ul>
        </div>

        <div>
            <h4>Subjects</h4>
            <ul>
                <li v-for="subject in book.subjects">
                    {{ subject }}
                </li>
            </ul>
        </div>
    </article>
</template>

<style lang="css" scoped>
article {
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    height: 100%;
}

h3 {
    margin-top: 0;
    color: #2c3e50;
    font-size: 1.2rem;
}

h4 {
    color: #7f8c8d;
    font-size: 1rem;
    margin: 0.5rem 0 0.3rem;
}

ul {
    list-style: none;
    padding: 0;
    margin: 0.5rem 0;
}

li {
    font-size: 0.9rem;
    color: #34495e;
}

button {
    background: #3498db;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 1rem;
    transition: background 0.2s;
}

button:hover {
    background: #2980b9;
}

select {
    padding: 0.3rem;
    border-radius: 4px;
    border: 1px solid #ddd;
    margin-left: 0.5rem;
}

a {
    color: #2c3e50;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}
</style>
