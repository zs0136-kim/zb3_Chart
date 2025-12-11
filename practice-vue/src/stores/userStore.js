// src/stores/userStore.js
import { reactive } from 'vue'

export const userStore = reactive({
  currentUser: {
    id: 'main',
    name: 'Harumi Torikoshi',
    dept: 'IT事業部',
    avatar: '/user.png',
  },
})
