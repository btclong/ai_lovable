<template>
  <section class="w-100" style="max-width: 1100px">
    <div class="card card-soft p-4 p-lg-5 mb-4 game-hero">
      <div class="row g-4 align-items-center">
        <div class="col-lg-7">
          <span class="badge text-bg-warning rounded-pill mb-3">🎮 Neon Money Quest</span>
          <h2 class="display-6 fw-bold mb-3">돈관리 미니게임</h2>
          <p class="lead text-secondary mb-4">예산 상황을 보고 최적의 선택을 고르는 금융 시뮬레이션입니다. 결과는 db.json의 gameResults에 사용자별로 저장됩니다.</p>
          <div class="d-flex gap-2 flex-wrap">
            <button class="btn btn-kb btn-lg rounded-4 px-5" @click="resetGame">새 게임 시작</button>
            <RouterLink to="/dashboard" class="btn btn-outline-secondary btn-lg rounded-4 px-5">돈관리로 이동</RouterLink>
          </div>
        </div>
        <div class="col-lg-5 text-center">
          <img class="game-img" src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=900&q=80" alt="돈관리 게임 이미지" />
        </div>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-lg-7">
        <div class="card card-soft p-4 h-100">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h3 class="h4 fw-bold mb-0">{{ currentQuestion.title }}</h3>
            <span class="badge text-bg-light rounded-pill">{{ step + 1 }} / {{ questions.length }}</span>
          </div>
          <p class="text-secondary fs-5 mb-4">{{ currentQuestion.description }}</p>

          <div class="vstack gap-3">
            <button v-for="option in currentQuestion.options" :key="option.text" class="btn option-card text-start rounded-4 p-3" @click="selectOption(option)">
              <div class="fw-bold fs-5">{{ option.emoji }} {{ option.text }}</div>
              <small class="text-secondary">{{ option.hint }}</small>
            </button>
          </div>

          <div v-if="finished" class="alert alert-success rounded-4 mt-4 mb-0">
            <h4 class="fw-bold">{{ resultTitle }}</h4>
            <p class="mb-1">최종 점수: <strong>{{ score }}점</strong></p>
            <p class="mb-0">결과 저장 후 프로필에서 게임 레벨을 확인할 수 있습니다.</p>
          </div>
        </div>
      </div>

      <div class="col-lg-5">
        <div class="card card-soft p-4 mb-4">
          <h3 class="h4 fw-bold mb-3">🏅 내 게임 레벨</h3>
          <div class="display-6 fw-bold text-primary mb-2">{{ gameStore.level }}</div>
          <p class="text-secondary mb-0">프로필을 누르면 이 레벨도 함께 표시됩니다.</p>
        </div>

        <div class="card card-soft p-4">
          <h3 class="h4 fw-bold mb-3">📌 AI 스타일 금융 개선안</h3>
          <div v-if="gameStore.latestResult?.analysis?.length" class="vstack gap-2">
            <div v-for="item in gameStore.latestResult.analysis" :key="item" class="advice-box rounded-4 p-3">💡 {{ item }}</div>
          </div>
          <p v-else class="text-secondary mb-0">게임을 완료하면 개인 거래내역과 점수를 바탕으로 개선안을 저장합니다.</p>
        </div>
      </div>
    </div>

    <div class="card card-soft p-4 mt-4">
      <h3 class="h4 fw-bold mb-3">🗂️ 최근 게임 결과</h3>
      <div v-if="gameStore.results.length === 0" class="text-secondary">아직 게임 결과가 없습니다.</div>
      <div v-else class="table-responsive">
        <table class="table align-middle">
          <thead>
            <tr><th>일시</th><th>결과</th><th>점수</th><th>개선안</th></tr>
          </thead>
          <tbody>
            <tr v-for="item in gameStore.results.slice(0, 5)" :key="item.id">
              <td>{{ formatDate(item.createdAt) }}</td>
              <td class="fw-bold">{{ item.resultTitle }}</td>
              <td>{{ item.score }}점</td>
              <td><span class="small text-secondary">{{ item.analysis?.[0] || '-' }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useGameStore } from '@/stores/gameStore.js'
import { useAccountBookStore } from '@/stores/accountBookStore.js'

const gameStore = useGameStore()
const accountBookStore = useAccountBookStore()
const step = ref(0)
const score = ref(0)
const finished = ref(false)

const questions = [
  {
    title: '월급날 다음 행동은?',
    description: '월급 280만원이 들어왔습니다. 가장 먼저 무엇을 할까요?',
    options: [
      { emoji: '🏦', text: '비상금·저축 먼저 분리', hint: '선저축 후소비 전략', point: 30 },
      { emoji: '🛍️', text: '사고 싶었던 물건 즉시 구매', hint: '충동소비 위험', point: 5 },
      { emoji: '🤔', text: '남으면 저축하기', hint: '실행력이 낮은 방식', point: 15 }
    ]
  },
  {
    title: '구독료가 늘어났습니다',
    description: '매달 자동결제되는 서비스가 5개입니다. 어떤 선택이 좋을까요?',
    options: [
      { emoji: '✂️', text: '사용 빈도 낮은 구독 해지', hint: '반복 지출 절감', point: 30 },
      { emoji: '🙈', text: '소액이라 그냥 둔다', hint: '누적 지출 증가', point: 8 },
      { emoji: '📅', text: '다음 달에 확인한다', hint: '미루기 위험', point: 12 }
    ]
  },
  {
    title: '예상 밖 지출 발생',
    description: '갑자기 의료비가 발생했습니다. 어떤 방식이 안정적일까요?',
    options: [
      { emoji: '🛡️', text: '비상금에서 처리하고 다음 달 보충', hint: '현금흐름 안정', point: 30 },
      { emoji: '💳', text: '카드 할부로 넘긴다', hint: '부채 습관 위험', point: 10 },
      { emoji: '😵', text: '다른 지출은 그대로 유지', hint: '예산 붕괴 가능', point: 5 }
    ]
  }
]

const currentQuestion = computed(() => questions[Math.min(step.value, questions.length - 1)])
const resultTitle = computed(() => {
  if (score.value >= 80) return '금융 마스터 🏆'
  if (score.value >= 60) return '예산 전략가 💎'
  if (score.value >= 40) return '절약 훈련생 🌱'
  return '소비 점검 필요 🔎'
})

onMounted(async () => {
  await accountBookStore.fetchTransactions()
  await gameStore.fetchResults()
})

async function selectOption(option) {
  if (finished.value) return
  score.value += option.point
  if (step.value < questions.length - 1) {
    step.value += 1
    return
  }
  finished.value = true
  await gameStore.saveResult({ score: score.value, resultTitle: resultTitle.value, answers: questions.length })
}

function resetGame() {
  step.value = 0
  score.value = 0
  finished.value = false
}

function formatDate(value) {
  return new Date(value).toLocaleString('ko-KR')
}
</script>
