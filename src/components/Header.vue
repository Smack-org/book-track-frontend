<script lang="ts">
import { defineComponent } from "vue"
import useAuthStore from "../stores/auth.store"

export default defineComponent({
    setup() {
        const authStore = useAuthStore()
        return { authStore }
    },
})
</script>

<template>
    <header>
        <div v-if="authStore.isAuthentificated">
            <div>
                hello, {{ authStore.user?.email }}
                <router-link :to="{ name: 'login', replace: true }" @click="authStore.logout"> logout </router-link>
            </div>
        </div>
        <ul>
            <li v-if="!authStore.isAuthentificated">
                <router-link :to="{ name: 'login' }"> login </router-link>
            </li>
            <li v-if="!authStore.isAuthentificated">
                <router-link :to="{ name: 'register' }"> register </router-link>
            </li>
            <li v-if="authStore.isAuthentificated">
                <router-link :to="{ name: 'search' }"> search books </router-link>
            </li>
            <li v-if="authStore.isAuthentificated">
                <router-link :to="{ name: 'reading-list' }"> reading list </router-link>
            </li>
            <li v-if="authStore.isAuthentificated">
                <router-link :to="{ name: 'dashboard' }"> dashboard </router-link>
            </li>
            <li v-if="authStore.isAuthentificated">
                <router-link :to="{ name: 'favorites' }"> favorites </router-link>
            </li>
        </ul>
    </header>
</template>

<style lang="css" scoped>
header {
    background: #2c3e50;
    padding: 1rem;
    color: white;
}

ul {
    display: flex;
    gap: 1.5rem;
    justify-content: center;
    margin: 0;
    padding: 0;
}

li {
    list-style: none;
}

a {
    color: white;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: background 0.2s;
}

a:hover {
    background: rgba(255, 255, 255, 0.1);
}

a.router-link-active {
    background: #3498db;
}

div {
    text-align: center;
    margin-bottom: 0.5rem;
    color: #ecf0f1;
}
</style>
