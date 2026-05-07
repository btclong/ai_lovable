<template>
  <div class="card card-soft transaction-form-card p-4 p-lg-5">
    <div class="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-4">
      <div>
        <h3 class="h2 fw-bold mb-1">💸 거래내역 입력</h3>
        <p class="text-secondary mb-0">큰 입력화면에서 수입·지출을 빠르게 등록하세요 ✨</p>
      </div>
      <div class="fs-1">🧾</div>
    </div>

    <form @submit.prevent="submit" class="vstack gap-4">
      <div class="btn-group btn-group-lg" role="group">
        <button type="button" class="btn py-3 fw-bold" :class="form.type === 'income' ? 'btn-primary' : 'btn-outline-secondary'" @click="setType('income')">💵 수입</button>
        <button type="button" class="btn py-3 fw-bold" :class="form.type === 'expense' ? 'btn-warning text-white' : 'btn-outline-secondary'" @click="setType('expense')">🛒 지출</button>
      </div>

      <div class="row g-4">
        <div class="col-lg-6">
          <label class="form-label fw-semibold fs-5">💰 금액</label>
          <input v-model.number="form.amount" type="number" min="0" class="form-control form-control-xl rounded-4" placeholder="0" required />
        </div>
        <div class="col-lg-6">
          <label class="form-label fw-semibold fs-5">🏷️ 카테고리</label>
          <select v-model="form.category" class="form-select form-select-xl rounded-4" required>
            <option value="">선택하세요</option>
            <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
          </select>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-lg-6">
          <label class="form-label fw-semibold fs-5">📅 날짜</label>
          <input v-model="form.date" type="date" class="form-control form-control-xl rounded-4" required />
        </div>
        <div class="col-lg-6">
          <label class="form-label fw-semibold fs-5">✍️ 메모</label>
          <input v-model="form.description" class="form-control form-control-xl rounded-4" placeholder="예: 점심, 월급, 구독료" />
        </div>
      </div>

      <button class="btn btn-kb btn-lg rounded-4 py-3 fw-bold">✅ 추가하기</button>
    </form>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { useAccountBookStore } from '@/stores/accountBookStore.js'

const emit = defineEmits(['saved'])
const store = useAccountBookStore()
const incomeCategories = ['💼 급여', '🎁 보너스', '💻 사업소득', '🪙 이자', '🌟 기타수입']
const expenseCategories = ['🍱 식비', '🚇 교통비', '🛍️ 쇼핑', '🏠 공과금', '💊 의료비', '🎬 문화생활', '📚 교육', '☕ 카페', '📱 통신비', '🔖 기타지출']

const form = reactive({ type: 'expense', amount: '', category: '', description: '', date: new Date().toISOString().split('T')[0] })
const categories = computed(() => form.type === 'income' ? incomeCategories : expenseCategories)

function setType(type) {
  form.type = type
  form.category = ''
}

async function submit() {
  if (!form.amount || !form.category) {
    alert('금액과 카테고리를 입력해주세요.')
    return
  }
  await store.addTransaction({ ...form })
  form.amount = ''
  form.category = ''
  form.description = ''
  form.date = new Date().toISOString().split('T')[0]
  emit('saved')
}
</script>
