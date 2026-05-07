<template>
  <section class="w-100" style="max-width: 860px">
    <div class="card card-soft p-4 p-md-5">
      <div class="d-flex justify-content-between align-items-start gap-3 flex-wrap mb-4">
        <div class="d-flex align-items-center gap-3">
          <img :src="defaultAvatar" alt="기본 사용자 이미지" class="avatar-xl" />
          <div>
            <h2 class="fw-bold mb-1">사용자프로필 👤</h2>
            <p class="text-secondary mb-1">기본 아바타와 미래형 프로필 정보를 표시합니다.</p>
            <span class="badge text-bg-warning rounded-pill">{{ gameStore.level }}</span>
          </div>
        </div>
        <RouterLink to="/dashboard" class="btn btn-outline-secondary rounded-3">대시보드</RouterLink>
      </div>

      <div v-if="authStore.error" class="alert alert-danger rounded-3">{{ authStore.error }}</div>
      <div v-if="saved" class="alert alert-success rounded-3">프로필이 저장되었습니다.</div>

      <form v-if="form" @submit.prevent="save" class="vstack gap-3">
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label fw-semibold">이름</label>
            <input v-model="form.name" class="form-control form-control-lg rounded-3" required />
          </div>
          <div class="col-md-6">
            <label class="form-label fw-semibold">이메일</label>
            <input v-model="form.email" type="email" class="form-control form-control-lg rounded-3" required />
          </div>
        </div>
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label fw-semibold">전화번호</label>
            <input v-model="form.phone" class="form-control form-control-lg rounded-3" />
          </div>
          <div class="col-md-6">
            <label class="form-label fw-semibold">직업/구분</label>
            <input v-model="form.job" class="form-control form-control-lg rounded-3" />
          </div>
        </div>
        <div>
          <label class="form-label fw-semibold">메모</label>
          <textarea v-model="form.memo" rows="4" class="form-control rounded-3"></textarea>
        </div>
        <div class="card bg-light border-0 rounded-4 p-3">
          <h3 class="h6 fw-bold mb-2">🎮 최근 시뮬레이션 결과</h3>
          <p class="mb-1">레벨: <strong>{{ gameStore.level }}</strong></p>
          <p v-if="gameStore.latestResult" class="mb-0 text-secondary">최근 점수: {{ gameStore.latestResult.score }}점 · {{ gameStore.latestResult.resultTitle }}</p>
          <p v-else class="mb-0 text-secondary">아직 저장된 게임 결과가 없습니다.</p>
        </div>
        <button class="btn btn-kb btn-lg rounded-3" :disabled="authStore.loading">
          {{ authStore.loading ? '저장 중...' : '프로필 저장' }}
        </button>
      </form>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/authStore.js'
import { useGameStore } from '@/stores/gameStore.js'

const authStore = useAuthStore()
const gameStore = useGameStore()
const form = ref(null)
const saved = ref(false)
const defaultAvatar = computed(() => authStore.profile?.avatar || 'https://api.dicebear.com/8.x/thumbs/svg?seed=kb-user&backgroundColor=b6f0ff')

onMounted(async () => {
  const profile = await authStore.fetchProfile()
  await gameStore.fetchResults()
  if (profile) form.value = reactive({ ...profile })
})

async function save() {
  saved.value = false
  const ok = await authStore.updateProfile(form.value)
  if (ok) saved.value = true
}
</script>
