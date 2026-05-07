<template>
  <section class="w-100 text-center" style="max-width: 980px">
    <div class="mb-5">
      <div class="mx-auto mb-4 d-flex align-items-center justify-content-center bg-primary text-white fw-bold shadow-lg rounded-5" style="width:96px;height:96px;font-size:44px">NL</div>
      <h1 class="display-4 fw-bold mb-3">Neon Ledger</h1>
      <p class="lead text-secondary mb-4">수입·지출 기록, 계좌 관리, 게임형 금융 피드백을 네온 UI로 제공하는 미래지향 자산 관리 앱입니다.</p>
      <div class="d-flex justify-content-center gap-3 flex-wrap">
        <RouterLink to="/login" class="btn btn-kb btn-lg rounded-4 px-5 py-3 shadow">로그인하기</RouterLink>
        <RouterLink to="/signup" class="btn btn-outline-warning btn-lg rounded-4 px-5 py-3 bg-white">회원가입하기</RouterLink>
      </div>
    </div>

    <div class="row g-4 mt-3">
      <div v-for="feature in features" :key="feature.title" class="col-md-4">
        <div class="card card-soft h-100 p-4">
          <div class="fs-1 mb-3">{{ feature.icon }}</div>
          <h3 class="h5 fw-bold">{{ feature.title }}</h3>
          <p class="text-secondary mb-0">{{ feature.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const features = [
  { icon: '🌐', title: '네온 트랜잭션', desc: '수입과 지출을 빠르게 입력하고 사이버펑크 UI로 즉시 반영합니다.' },
  { icon: '📊', title: '실시간 분석', desc: 'Google Charts 기반으로 수입, 지출, 잔액 흐름을 미래지향적으로 시각화합니다.' },
  { icon: '⚡', title: 'Cyber UI', desc: '다크모드와 네온 컬러, 글래스모피즘 카드로 세련된 경험을 제공합니다.' }
]
</script>
