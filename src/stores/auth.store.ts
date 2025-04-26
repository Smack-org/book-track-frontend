import { defineStore } from "pinia";
import type { User } from "../types/user";
import { AuthAPI } from "../api/auth.api";

type AuthCreds = {
  email: string;
  password: string;
};

const useAuthStore = defineStore("userStore", {
  state() {
    return {
      user: null as User | null,
      token: localStorage.getItem("idToken") || null,
      loading: false,
      error: null as string | null,
    };
  },

  getters: {
    isAuthentificated: (state) => !!state.token,
  },

  actions: {
    async login({ email, password }: AuthCreds) {
      this.loading = true;
      this.error = null;
      try {
        const { idToken, localId } = await AuthAPI.login(email, password);

        this.setTokens(idToken);
        this.user = { email, uid: localId };
      } catch (error: any) {
        this.error = error.response?.data?.error?.message || "Login failed";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async register({ email, password }: AuthCreds) {
      this.loading = true;
      try {
        const { idToken, localId } = await AuthAPI.register(email, password);

        this.setTokens(idToken);
        this.user = { email, uid: localId };
      } catch (error: any) {
        this.error =
          error.response?.data?.error?.message || "Registration failed";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem("idToken");
    },

    async fetchUser() {
      if (!this.token) return;

      try {
        const userData = await AuthAPI.getUser(this.token);
        this.user = { email: userData.email, uid: userData.localId };
      } catch (error) {
        await this.logout();
      }
    },

    setTokens(idToken: string) {
      this.token = idToken;
      localStorage.setItem("idToken", idToken);
    },
  },
});

export default useAuthStore;
