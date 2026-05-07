<template>
  <header class="app-header shadow-sm border-bottom">
    <nav class="container navbar navbar-expand-lg py-3">
      <RouterLink to="/" class="navbar-brand d-flex align-items-center gap-3">
        <span class="brand-mark d-inline-flex align-items-center justify-content-center text-white fw-bold rounded-4">NL</span>
        <span>
          <span class="d-block fw-bold brand-title">Neon Ledger</span>
          <small class="text-secondary">Cyberpunk Finance Dashboard · Vue3 + json-server</small>
        </span>
      </RouterLink>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div id="mainNav" class="collapse navbar-collapse justify-content-end">
        <ul class="navbar-nav align-items-lg-center gap-lg-2">
          <li class="nav-item"><RouterLink to="/" class="nav-link">🏠 홈</RouterLink></li>
          <template v-if="authStore.isLoggedIn">
            <li class="nav-item"><RouterLink to="/dashboard" class="nav-link">📊 돈관리</RouterLink></li>
            <li class="nav-item"><RouterLink to="/game" class="nav-link">🎮 금융게임</RouterLink></li>
            <li class="nav-item dropdown">
              <button class="btn profile-button dropdown-toggle d-flex align-items-center gap-2" data-bs-toggle="dropdown">
                <img :src="defaultAvatar" alt="기본 사용자 이미지" class="avatar-sm" />
                <span class="fw-bold">{{ authStore.userName }}</span>
              </button>
              <div class="dropdown-menu dropdown-menu-end profile-menu p-3 shadow-lg border-0 rounded-4">
                <div class="d-flex align-items-center gap-3 mb-3">
                  <img :src="defaultAvatar" alt="기본 사용자 이미지" class="avatar-md" />
                  <div>
                    <div class="fw-bold">{{ authStore.userName }}</div>
                    <small class="text-secondary">{{ authStore.user?.email }}</small>
                    <div class="small text-primary fw-bold mt-1">{{ gameStore.level }}</div>
                  </div>
                </div>
                <RouterLink to="/profile" class="dropdown-item rounded-3">👤 사용자프로필 보기</RouterLink>
                <RouterLink to="/game" class="dropdown-item rounded-3">🎲 게임 레벨 확인</RouterLink>
                <button class="dropdown-item rounded-3" @click="themeStore.toggleDarkMode">
                  {{ themeStore.darkMode ? '☀️ 라이트모드' : '🌙 다크모드' }} 적용
                </button>
                <hr class="dropdown-divider" />
                <button class="dropdown-item rounded-3 text-danger" @click="logout">🚪 로그아웃</button>
              </div>
            </li>
          </template>
          <template v-else>
            <li class="nav-item"><RouterLink to="/login" class="nav-link">로그인</RouterLink></li>
            <li class="nav-item"><RouterLink to="/signup" class="btn btn-kb rounded-3 px-4">회원가입</RouterLink></li>
          </template>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore.js'
import { useAccountBookStore } from '@/stores/accountBookStore.js'
import { useThemeStore } from '@/stores/themeStore.js'
import { useGameStore } from '@/stores/gameStore.js'

const router = useRouter()
const authStore = useAuthStore()
const accountBookStore = useAccountBookStore()
const themeStore = useThemeStore()
const gameStore = useGameStore()

const defaultAvatar = computed(() => authStore.profile?.avatar || 'https://api.dicebear.com/8.x/thumbs/svg?seed=kb-user&backgroundColor=b6f0ff')

onMounted(async () => {
  if (authStore.isLoggedIn) {
    await authStore.fetchProfile()
    await gameStore.fetchResults()
  }
})

function logout() {
  authStore.logout()
  accountBookStore.transactions = []
  router.push('/login')
}
</script>
