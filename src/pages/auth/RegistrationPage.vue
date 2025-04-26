<script lang="ts">
import { defineComponent } from "vue";
import { AuthAPI } from "../../api/auth.api";

export default defineComponent({
  data() {
    return {
      isLogging: false,
      creds: {
        email: "",
        password: "",
      },
      error: "",
    };
  },
  methods: {
    async register() {
      this.isLogging = true;

      try {
        await AuthAPI.register(this.creds.email, this.creds.password);
      } catch (e) {
        this.error = `Failed to register. ${e}`;
        return;
      } finally {
        this.isLogging = false;
      }

      this.$router.push("/search");
    },
  },
  beforeRouteLeave(_to, _from, next) {
    if (this.isLogging) {
      if (!confirm("are you sure you want to leave?")) {
        next(false);
      }
    }
    next();
  },
});
</script>

<template>
  <form @submit.prevent="register">
    <div>
      <label for="email">email: </label>
      <input v-model="creds.email" id="email" type="email" />
    </div>

    <div>
      <label for="password">password: </label>
      <input v-model="creds.password" id="password" type="password" />
    </div>
    <button>register</button>

    <div v-if="isLogging">Logging...</div>
    <div v-if="error && !isLogging">Error: {{ error }}</div>
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
