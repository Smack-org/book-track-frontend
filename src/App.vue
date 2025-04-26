<script lang="ts">
import { defineComponent } from "vue";
import useAuthStore from "./stores/auth.store";
import Header from "./components/Header.vue";

export default defineComponent({
  components: { Header },
  setup() {
    const userStore = useAuthStore();
    return { userStore };
  },
});
</script>

<template>
  <Header />

  <main>
    <RouterView></RouterView>
  </main>
</template>

<style>
/* Global styles */
body {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  margin: 0;
  padding: 0;
  background: #f9f9f9;
}

main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}
</style>
