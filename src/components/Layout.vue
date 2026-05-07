<template>
  <div class="min-h-screen d-flex flex-column app-shell">
    <Header />
    <main class="container py-5 flex-grow-1 d-flex justify-content-center align-items-start">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Header from './Header.vue'
import Footer from './Footer.vue'
import { useThemeStore } from '@/stores/themeStore.js'

useThemeStore()
</script>
