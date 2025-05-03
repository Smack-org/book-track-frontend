<script setup lang="ts">
import { onMounted, ref } from "vue"
import useAuthStore from "../stores/auth.store"
import { type BookType } from "../types/book"
import { FavoritesService } from "../api/user/favorites.service"
import { BooksWithStatusesService } from "../api/user/booksWithStatus.service"
import BookList from "../components/BookList.vue"

const auth = useAuthStore()

const favourites = ref<BookType[]>([])
const wantToRead = ref<BookType[]>([])
const currentlyReading = ref<BookType[]>([])
const completedBooks = ref<BookType[]>([])

const memberSince = auth.user ? new Date(auth.user.created_at).toLocaleDateString("en-GB") : ""

onMounted(async () => {
    favourites.value = await FavoritesService.getFavoriteBooks()
    wantToRead.value = await BooksWithStatusesService.get("want")
    currentlyReading.value = await BooksWithStatusesService.get("reading")
    completedBooks.value = await BooksWithStatusesService.get("done")
})
</script>

<template>
    <div class="dashboard">
        <div v-if="auth.user" class="user-info">
            <h2>Welcome, {{ auth.user.username || auth.user.login }}</h2>
            <p v-if="memberSince">Member since: {{ memberSince }}</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <h3>Currently Reading</h3>
                <p class="stat-value">{{ currentlyReading.length }}</p>
            </div>
            <div class="stat-card">
                <h3>Want to Read</h3>
                <p class="stat-value">{{ wantToRead.length }}</p>
            </div>
            <div class="stat-card">
                <h3>Completed</h3>
                <p class="stat-value">{{ completedBooks.length }}</p>
            </div>
            <div class="stat-card">
                <h3>Favorites</h3>
                <p class="stat-value">{{ favourites.length }}</p>
            </div>
        </div>

        <div class="book-sections">
            <section class="book-section">
                <h3>Want to Read</h3>
                <BookList :books="wantToRead" />
            </section>

            <section class="book-section">
                <h3>Recently Completed</h3>
                <BookList :books="completedBooks" />
            </section>
        </div>
    </div>
</template>

<style scoped>
.dashboard {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.user-info {
    margin-bottom: 2rem;
    padding: 1rem;
    background: #f5f5f5;
    border-radius: 8px;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
}

.stat-card {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.stat-card h3 {
    margin-top: 0;
    color: #555;
}

.stat-value {
    font-size: 2rem;
    font-weight: bold;
    margin: 0.5rem 0 0;
    color: #333;
}

.book-sections {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
}

.book-section {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.book-section h3 {
    margin-top: 0;
    border-bottom: 1px solid #eee;
    padding-bottom: 0.5rem;
}

@media (max-width: 768px) {
    .book-sections {
        grid-template-columns: 1fr;
    }
}
</style>
