import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/api.js'
import { useAuthStore } from '@/stores/authStore.js'

export const useAccountStore = defineStore('accounts', () => {
  const accounts = ref([])
  const loading = ref(false)
  const error = ref('')

  const totalAsset = computed(() => accounts.value.reduce((sum, item) => sum + Number(item.balance || 0), 0))

  async function fetchAccounts() {
    const authStore = useAuthStore()
    if (!authStore.user) return
    loading.value = true
    error.value = ''
    try {
      const { data } = await api.get('/accounts', { params: { userId: authStore.user.id } })
      accounts.value = data
    } catch (err) {
      error.value = '계좌목록을 불러오지 못했습니다.'
    } finally {
      loading.value = false
    }
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat('ko-KR').format(Number(amount || 0)) + '원'
  }

  return { accounts, loading, error, totalAsset, fetchAccounts, formatCurrency }
})
