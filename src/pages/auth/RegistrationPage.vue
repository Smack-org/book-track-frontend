<script setup lang="ts">
import { reactive, ref } from "vue"
import useAuthStore, { handleAuthError } from "../../stores/auth.store"
import { useRoute, useRouter } from "vue-router"

const isLogging = ref(false)
const creds = reactive({
    login: "",
    password: "",
})
const error = ref("")

const authStore = useAuthStore()

const route = useRoute()
const router = useRouter()

async function register() {
    isLogging.value = true

    try {
        await authStore.register(creds)
    } catch (e) {
        error.value = `Failed to register. ${handleAuthError(e)}`
        return
    } finally {
        isLogging.value = false
    }

    const queryRedirect = route.query.redirect
    if (queryRedirect) {
        router.replace(`${queryRedirect}`)
    } else {
        router.replace({ name: "search" })
    }
}
</script>

<template>
    <form @submit.prevent="register">
        <div>
            <label for="login">login: </label>
            <input id="login" v-model="creds.login" type="login" />
        </div>

        <div>
            <label for="password">password: </label>
            <input id="password" v-model="creds.password" type="password" />
        </div>
        <button>register</button>

        <div v-if="isLogging">Logging...</div>
        <div v-if="error && !isLogging">
            {{ error }}
        </div>
    </form>
</template>

<style lang="css" scoped>
form {
    max-width: 400px;
    margin: 2rem auto;
    padding: 1.5rem;
    background: #f5f5f5;
    border-radius: 8px;
}

div {
    margin-bottom: 1rem;
}

label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
}

input {
    width: 100%;
    padding: 0.7rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
}

button {
    width: 100%;
    padding: 0.8rem;
    background: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.2s;
}

button:hover {
    background: #2980b9;
}

div.error {
    color: #e74c3c;
    margin-top: 1rem;
    padding: 0.5rem;
    background: #fadbd8;
    border-radius: 4px;
}
</style>
