<script setup lang="ts">
import { defineProps, defineSlots, defineEmits, ref, watch } from "vue"

const { pagesNum, curPage } = defineProps<{
    pagesNum: number
    curPage: number
}>()

defineSlots<{
    default(): undefined
}>()

const emit = defineEmits<{
    (e: "selectedPage", page: number): void
}>()

const currentPage = ref<number>(Math.min(Math.max(curPage, 1), pagesNum))

watch(currentPage, (newVal) => {
    if (newVal >= 1 && newVal <= pagesNum) {
        emit("selectedPage", newVal)
    } else {
        currentPage.value = Math.min(Math.max(newVal, 1), pagesNum)
    }
})
</script>

<template>
    <div class="pagination">
        <slot />

        <div class="pagination-controls">
            <button class="pagination-button" :disabled="currentPage <= 1" @click="currentPage--">&lt;</button>
            <div class="page-input">
                <input v-model.number="currentPage" type="number" min="1" :max="pagesNum" @keydown.enter="$emit('selectedPage', currentPage)" />
            </div>
            <button class="pagination-button" :disabled="currentPage >= pagesNum" @click="currentPage++">&gt;</button>
        </div>
        <span class="page-indicator"> Page {{ currentPage }} of {{ pagesNum }} </span>
    </div>
</template>

<style lang="css" scoped>
.pagination {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 1rem 0;
    font-family: Arial, sans-serif;
}

.pagination-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 1rem 0;
    font-family: Arial, sans-serif;
}

.pagination-button {
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    background-color: #f8f8f8;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.pagination-button:hover:not(:disabled) {
    background-color: #e8e8e8;
}

.pagination-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.page-indicator {
    padding: 0.5rem;
    font-size: 0.9rem;
    color: #555;
}

.page-input input {
    width: 60px;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    text-align: center;
}

.page-input input:focus {
    outline: none;
    border-color: #646cff;
}

@media (max-width: 480px) {
    .pagination {
        flex-wrap: wrap;
        justify-content: center;
    }

    .page-input {
        order: 1;
        width: 100%;
        margin-top: 0.5rem;
    }

    .page-input input {
        width: 100%;
    }
}
</style>
