<template>
  <section class="w-100" style="max-width: 1280px">
    <div class="card card-soft p-4 mb-4 dashboard-top">
      <div class="d-flex justify-content-between align-items-center gap-3 flex-wrap">
        <div class="d-flex align-items-center gap-3">
          <img :src="defaultAvatar" alt="기본 사용자 이미지" class="avatar-lg" />
          <div>
            <h2 class="fw-bold mb-1">{{ authStore.userName }}님의 돈관리 페이지 💼</h2>
            <p class="text-secondary mb-0">거래내역, 계좌, 차트, 게임형 분석을 네온 대시보드에서 통합 관리합니다.</p>
          </div>
        </div>
        <div class="d-flex gap-2 flex-wrap">
          <RouterLink to="/profile" class="btn btn-outline-primary rounded-3 px-4">👤 프로필</RouterLink>
          <RouterLink to="/game" class="btn btn-kb rounded-3 px-4">🎮 게임</RouterLink>
          <button class="btn btn-outline-secondary rounded-3 px-4" @click="themeStore.toggleDarkMode">{{ themeStore.darkMode ? '☀️ 라이트' : '🌙 다크' }}</button>
        </div>
      </div>
    </div>

    <div class="row g-4 mb-4">
      <div class="col-md-3">
        <StatCard title="이번 달 지출" icon="💰" :value="store.formatCurrency(store.totalExpense)" tone-class="bg-orange-50 border border-warning-subtle" />
      </div>
      <div class="col-md-3">
        <StatCard title="이번 달 수입" icon="💵" :value="store.formatCurrency(store.totalIncome)" tone-class="bg-blue-50 border border-primary-subtle" value-class="text-primary" />
      </div>
      <div class="col-md-3">
        <StatCard title="이번 달 잔액" icon="🏦" :value="store.formatCurrency(store.balance)" tone-class="bg-green-50 border border-success-subtle" :value-class="store.balance >= 0 ? 'text-success' : 'text-danger'" />
      </div>
      <div class="col-md-3">
        <StatCard title="게임 레벨" icon="🎖️" :value="gameStore.level" tone-class="bg-purple-50 border border-primary-subtle" value-class="text-primary" />
      </div>
    </div>

    <div class="card card-soft p-2 mb-4">
      <div class="nav nav-pills nav-fill gap-2 flex-wrap">
        <button v-for="tab in tabs" :key="tab.key" class="nav-link rounded-3 py-3 fw-bold" :class="activeTab === tab.key ? 'active bg-primary' : 'text-secondary'" @click="activeTab = tab.key">
          {{ tab.label }}
        </button>
      </div>
    </div>

    <FinanceChart v-if="activeTab === 'overview'" />
    <TransactionForm v-else-if="activeTab === 'add'" @saved="activeTab = 'list'" />
    <AccountList v-else-if="activeTab === 'accounts'" />
    <TransactionList v-else />
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAccountBookStore } from '@/stores/accountBookStore.js'
import { useAuthStore } from '@/stores/authStore.js'
import { useThemeStore } from '@/stores/themeStore.js'
import { useGameStore } from '@/stores/gameStore.js'
import { useAccountStore } from '@/stores/accountStore.js'
import StatCard from '@/components/StatCard.vue'
import FinanceChart from '@/components/FinanceChart.vue'
import TransactionForm from '@/components/TransactionForm.vue'
import TransactionList from '@/components/TransactionList.vue'
import AccountList from '@/components/AccountList.vue'

const store = useAccountBookStore()
const authStore = useAuthStore()
const themeStore = useThemeStore()
const gameStore = useGameStore()
const accountStore = useAccountStore()
const activeTab = ref('overview')
const tabs = [
  { key: 'overview', label: '📊 분석' },
  { key: 'accounts', label: '🏦 계좌목록' },
  { key: 'add', label: '➕ 내역 입력' },
  { key: 'list', label: '📝 거래내역' }
]
const defaultAvatar = computed(() => authStore.profile?.avatar || 'https://api.dicebear.com/8.x/thumbs/svg?seed=kb-user&backgroundColor=b6f0ff')

onMounted(async () => {
  await authStore.fetchProfile()
  await store.fetchTransactions()
  await accountStore.fetchAccounts()
  await gameStore.fetchResults()
})
</script>
