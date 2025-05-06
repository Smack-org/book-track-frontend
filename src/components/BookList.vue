<script setup lang="ts">
import type { BookType } from "../types/book"

interface Props {
    books: BookType[]
}

defineSlots<{
    default: (props: { book: BookType }) => unknown
}>()

defineProps<Props>()
</script>

<template>
    <ul>
        <li v-for="book in books" :key="book.id" class="books-item">
            <slot :book="book" />
        </li>
    </ul>
</template>

<style lang="css" scoped>
ul {
    list-style: none;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    margin: 2rem 0;
    width: 100%;
}

li {
    background: #f8f4e8;
    border: 1px solid #e0d6c2;
    border-radius: 8px;
    padding: 1rem;
    transition:
        transform 0.2s,
        box-shadow 0.2s;
}

li:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
