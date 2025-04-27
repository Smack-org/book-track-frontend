<script lang="ts">
import { defineComponent } from "vue"
import SearchBooks from "../components/SearchBooks.vue"

export default defineComponent({
    components: { SearchBooks },
    beforeRouteEnter(_to, _before, next) {
        next()
    },
})
</script>

<template>
    <SearchBooks />
</template>

<style lang="css" scoped></style>
