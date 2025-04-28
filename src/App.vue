<script setup lang="ts">
import Header from "./components/Header.vue"
</script>

<template>
    <Header />

    <main>
        <RouterView />
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
