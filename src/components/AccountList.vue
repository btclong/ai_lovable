<template>
  <div class="card card-soft p-4 h-100">
    <div class="d-flex justify-content-between align-items-center gap-3 flex-wrap mb-4">
      <div>
        <h3 class="h4 fw-bold mb-1">🏦 계좌목록</h3>
        <p class="text-secondary mb-0">총 자산 {{ accountStore.formatCurrency(accountStore.totalAsset) }}</p>
      </div>
      <button class="btn btn-outline-primary rounded-3" @click="accountStore.fetchAccounts">새로고침</button>
    </div>

    <div v-if="accountStore.error" class="alert alert-danger rounded-3">{{ accountStore.error }}</div>
    <div v-if="accountStore.loading" class="text-center py-4 text-secondary">계좌를 불러오는 중입니다...</div>

    <div class="row g-3">
      <div v-for="account in pagedAccounts" :key="account.id" class="col-md-6">
        <div class="account-card p-4 rounded-4 border h-100">
          <div class="d-flex justify-content-between align-items-start gap-3 mb-3">
            <div>
              <div class="fs-2 mb-2">{{ account.icon }}</div>
              <h4 class="h5 fw-bold mb-1">{{ account.name }}</h4>
              <p class="text-secondary small mb-0">{{ account.bank }} · {{ account.type }}</p>
            </div>
            <span class="badge text-bg-light rounded-pill">{{ account.status }}</span>
          </div>
          <div class="fs-4 fw-bold text-primary">{{ accountStore.formatCurrency(account.balance) }}</div>
          <small class="text-muted">{{ account.accountNumber }}</small>
        </div>
      </div>
    </div>

    <nav v-if="totalPages > 1" class="mt-4">
      <ul class="pagination justify-content-center mb-0">
        <li class="page-item" :class="{ disabled: page === 1 }"><button class="page-link" @click="page--">이전</button></li>
        <li v-for="num in totalPages" :key="num" class="page-item" :class="{ active: page === num }"><button class="page-link" @click="page = num">{{ num }}</button></li>
        <li class="page-item" :class="{ disabled: page === totalPages }"><button class="page-link" @click="page++">다음</button></li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useAccountStore } from '@/stores/accountStore.js'

const accountStore = useAccountStore()
const page = ref(1)
const pageSize = 4
const totalPages = computed(() => Math.max(1, Math.ceil(accountStore.accounts.length / pageSize)))
const pagedAccounts = computed(() => accountStore.accounts.slice((page.value - 1) * pageSize, page.value * pageSize))

watch(totalPages, () => {
  if (page.value > totalPages.value) page.value = totalPages.value
})

onMounted(accountStore.fetchAccounts)
</script>
