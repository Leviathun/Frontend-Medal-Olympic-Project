import { defineStore } from 'pinia'
import axios from 'axios'
import type { AxiosInstance } from 'axios'
import { type Organizer } from '@/types'
import router from '@/router'

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})
export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    user: null as Organizer | null,
    isLoggingOut: false
  }),
  getters: {
    currentUserName(): string {
      return this.user?.name || ''
    }
  },
  actions: {
    login(username: string, password: string) {
      return apiClient.post('/api/v1/auth/authenticate', {
        username,
        password
      }).then((response) => {
        const token = response.data.access_token
        const user = response.data.user

        this.token = token
        this.user = user

        localStorage.setItem('access_token', token)
        localStorage.setItem('user', JSON.stringify(user))

        console.log('Access Token:', token)
        console.log('User:', user)

        return response  // ✅ return ให้ .then() ภายนอกใช้ต่อได้
      })
    },
    register({ email, username, password }: { email: string; username: string; password: string }) {
      // Use the same apiClient, guessing the endpoint and payload
      return apiClient
        .post('/api/v1/auth/register', {
          email,
          username,
          password
        })
        .then((response) => {
          return response
        })
        .catch((err) => {
          throw err
        })
    },
    logout() {
      this.isLoggingOut = true;
      return apiClient.post("/api/v1/auth/logout", {}, {
        headers: { Authorization: `Bearer ${this.token}` }
      })
      .finally(() => {
        this.token = null;
        this.user = null;
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        console.log("Logout successful, localStorage cleared");

        // ✅ Redirect ไปหน้า login
        window.location.href = "/";  
      })
      .catch((err) => {
        console.error("Logout error:", err);
      });
    }
  }
})
