import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/api.js'
import { useAuthStore } from '@/stores/authStore.js'
import { useAccountBookStore } from '@/stores/accountBookStore.js'

export const useGameStore = defineStore('game', () => {
  const results = ref([])
  const loading = ref(false)
  const error = ref('')

  const latestResult = computed(() => results.value[0] || null)
  const level = computed(() => {
    const score = latestResult.value?.score || 0
    if (score >= 90) return 'Lv.5 금융 마스터 🏆'
    if (score >= 75) return 'Lv.4 예산 전략가 💎'
    if (score >= 60) return 'Lv.3 절약 실천가 🌱'
    if (score >= 40) return 'Lv.2 소비 점검러 🔎'
    return 'Lv.1 시작 단계 🐣'
  })

  async function fetchResults() {
    const authStore = useAuthStore()
    if (!authStore.user) return
    loading.value = true
    error.value = ''
    try {
      const { data } = await api.get('/gameResults', {
        params: { userId: authStore.user.id, _sort: 'createdAt', _order: 'desc' }
      })
      results.value = data
    } catch (err) {
      error.value = '게임 결과를 불러오지 못했습니다.'
    } finally {
      loading.value = false
    }
  }

  function makeAdvice(score) {
    const accountBookStore = useAccountBookStore()
    const income = accountBookStore.totalIncome
    const expense = accountBookStore.totalExpense
    const savingRate = income > 0 ? Math.round(((income - expense) / income) * 100) : 0
    const topExpense = accountBookStore.expenseByCategory[0]

    const advice = []
    if (score < 60) advice.push('게임 결과 기준으로 충동소비 방어력이 낮습니다. 결제 전 24시간 보류 규칙을 적용하세요.')
    if (savingRate < 20) advice.push(`이번 달 저축률이 ${savingRate}% 수준입니다. 고정비와 반복 지출을 먼저 줄이는 것이 효과적입니다.`)
    if (topExpense) advice.push(`가장 큰 지출 카테고리는 ${topExpense.category}입니다. 월 한도를 정하고 초과 시 대체 행동을 정하세요.`)
    if (score >= 75 && savingRate >= 20) advice.push('게임 결과와 지출 구조가 양호합니다. 남는 금액은 비상금과 투자금으로 자동 분리하세요.')
    return advice
  }

  async function saveResult(payload) {
    const authStore = useAuthStore()
    if (!authStore.user) throw new Error('로그인이 필요합니다.')
    loading.value = true
    error.value = ''
    try {
      const analysis = makeAdvice(payload.score)
      const { data } = await api.post('/gameResults', {
        ...payload,
        userId: authStore.user.id,
        analysis,
        createdAt: new Date().toISOString()
      })
      results.value.unshift(data)
      return data
    } catch (err) {
      error.value = '게임 결과 저장 중 오류가 발생했습니다.'
      throw err
    } finally {
      loading.value = false
    }
  }

  return { results, loading, error, latestResult, level, fetchResults, saveResult }
})
