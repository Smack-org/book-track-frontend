<script lang="ts">
import { defineComponent } from "vue";
import BookList from "./BookList.vue";
import { BookService } from "../api/book.service";
import { debounce } from "lodash-es";
import type { Book } from "../types/book";

type SearchProps = {
  query: string;
  sort: "ascending" | "descending";
  topic: string;
};

export default defineComponent({
  components: { BookList },
  data() {
    return {
      books: [] as Book[],
      searchProps: {
        query: this.$route.query.query || "",
        sort: this.$route.query.sort || "descending",
        topic: this.$route.query.topic || "",
      } as SearchProps,
      isLoading: false,
      error: "",
    };
  },
  methods: {
    updateBooks() {
      this.updateUrl();

      const debouncedUpdate = debounce(
        async ({ query, sort, topic }: SearchProps) => {
          const searchParams = {
            query,
            sort,
            topic,
          };

          this.isLoading = true;
          this.error = "";

          try {
            this.books = await BookService.searchBooks(searchParams);
          } catch (e) {
            console.log(`[LOG] (SearchBooks.vue:82): ${e}`);
            this.error = `${e}`;
          } finally {
            this.isLoading = false;
          }
        },
        300,
      );

      debouncedUpdate(this.searchProps);
    },
    updateUrl() {
      this.$router.push({
        query: {
          query: this.searchProps.query || undefined,
          sort:
            this.searchProps.sort !== "descending"
              ? this.searchProps.sort
              : undefined,
          topic: this.searchProps.topic || undefined,
        },
      });
    },
  },
  created() {
    this.updateBooks();
  },
});
</script>

<template>
  <article>
    <form @submit.prevent="updateBooks">
      <div>
        <label for="query">search (title or author): </label>
        <input v-model="searchProps.query" id="query" type="text" />
      </div>

      <div>
        <label for="popularity">popularity sort: </label>
        <select v-model="searchProps.sort" name="popularity" id="">
          <option value="ascending">ascending</option>
          <option value="descending">descending</option>
        </select>
      </div>

      <div>
        <label for="topic">topic: </label>
        <input v-model="searchProps.topic" id="topic" type="text" />
      </div>

      <button>search</button>
    </form>
  </article>

  <div>
    <p v-if="isLoading">Loading...</p>
    <p v-else-if="!isLoading && error">{{ error }}</p>
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
