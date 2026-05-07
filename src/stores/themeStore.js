import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'neon-ledger-theme'

export const useThemeStore = defineStore('theme', () => {
  const savedTheme = localStorage.getItem(STORAGE_KEY)
  const darkMode = ref(savedTheme ? savedTheme === 'dark' : true)

  function applyTheme() {
    document.documentElement.setAttribute('data-theme', darkMode.value ? 'dark' : 'light')
    document.body.classList.toggle('dark-mode', darkMode.value)
  }

  function toggleDarkMode() {
    darkMode.value = !darkMode.value
  }

  watch(darkMode, (value) => {
    localStorage.setItem(STORAGE_KEY, value ? 'dark' : 'light')
    applyTheme()
  })

  applyTheme()

  return { darkMode, toggleDarkMode, applyTheme }
})
