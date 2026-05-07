<template>
  <div class="row g-4">
    <div class="col-12">
      <div class="money-hero card card-soft overflow-hidden">
        <div class="row g-0 align-items-center">
          <div class="col-lg-5">
            <img class="money-hero-img" src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80" alt="돈관리 이미지" />
          </div>
          <div class="col-lg-7 p-4 p-lg-5">
            <div class="badge text-bg-warning rounded-pill mb-3">⚡ Neon Finance Matrix</div>
            <h3 class="display-6 fw-bold mb-3">미래형 자산 흐름을 한눈에 확인하세요</h3>
            <p class="text-secondary mb-0">수입·지출·카테고리·일자별 흐름을 Google Charts로 시각화했습니다. 차트 컬러는 시안·마젠타·퍼플 네온 팔레트를 사용합니다.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="col-lg-6">
      <div class="card card-soft p-4 h-100">
        <h3 class="h4 fw-bold mb-4">📊 수입/지출 비교</h3>
        <div ref="summaryChart" class="chart-box"></div>
      </div>
    </div>

    <div class="col-lg-6">
      <div class="card card-soft p-4 h-100">
        <h3 class="h4 fw-bold mb-4">🍩 카테고리별 지출</h3>
        <div ref="expenseChart" class="chart-box"></div>
      </div>
    </div>

    <div class="col-lg-6">
      <div class="card card-soft p-4 h-100">
        <h3 class="h4 fw-bold mb-4">📈 일자별 순흐름</h3>
        <div ref="lineChart" class="chart-box"></div>
      </div>
    </div>

    <div class="col-lg-6">
      <div class="card card-soft p-4 h-100">
        <h3 class="h4 fw-bold mb-4">🔥 지출 Top 5</h3>
        <div ref="topExpenseChart" class="chart-box"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useAccountBookStore } from '@/stores/accountBookStore.js'

const store = useAccountBookStore()
const summaryChart = ref(null)
const expenseChart = ref(null)
const lineChart = ref(null)
const topExpenseChart = ref(null)
let loaded = false

const rowsByDate = computed(() => {
  const map = {}
  store.monthlyTransactions.forEach((item) => {
    map[item.date] = (map[item.date] || 0) + (item.type === 'income' ? Number(item.amount) : -Number(item.amount))
  })
  return Object.entries(map).sort(([a], [b]) => a.localeCompare(b)).map(([date, amount]) => [date.slice(5), amount])
})

function loadGoogleCharts() {
  return new Promise((resolve) => {
    if (window.google?.charts) {
      window.google.charts.load('current', { packages: ['corechart', 'bar'] })
      window.google.charts.setOnLoadCallback(resolve)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://www.gstatic.com/charts/loader.js'
    script.onload = () => {
      window.google.charts.load('current', { packages: ['corechart', 'bar'] })
      window.google.charts.setOnLoadCallback(resolve)
    }
    document.head.appendChild(script)
  })
}

function chartOptions(extra = {}) {
  return {
    legend: { position: 'bottom' },
    backgroundColor: 'transparent',
    colors: ['#00e5ff', '#ff4fd8', '#7c4dff', '#46f7a1', '#ff6b91', '#00b8d9', '#8b5cf6'],
    chartArea: { width: '82%', height: '70%' },
    fontName: 'Inter',
    ...extra
  }
}

async function drawCharts() {
  if (!loaded || !window.google || !summaryChart.value) return
  await nextTick()

  const summaryData = window.google.visualization.arrayToDataTable([
    ['구분', '금액'],
    ['수입', store.totalIncome],
    ['지출', store.totalExpense],
    ['잔액', store.balance]
  ])
  new window.google.visualization.ColumnChart(summaryChart.value).draw(summaryData, chartOptions({ height: 300 }))

  const expenseRows = store.expenseByCategory.length ? store.expenseByCategory.map((item) => [item.category, item.amount]) : [['데이터 없음', 1]]
  const expenseData = window.google.visualization.arrayToDataTable([['카테고리', '금액'], ...expenseRows])
  new window.google.visualization.PieChart(expenseChart.value).draw(expenseData, chartOptions({ height: 300, pieHole: 0.45 }))

  const lineRows = rowsByDate.value.length ? rowsByDate.value : [['-', 0]]
  const lineData = window.google.visualization.arrayToDataTable([['날짜', '순흐름'], ...lineRows])
  new window.google.visualization.LineChart(lineChart.value).draw(lineData, chartOptions({ height: 300, curveType: 'function', colors: ['#00e5ff'], lineWidth: 4 }))

  const topRows = store.expenseByCategory.slice(0, 5).map((item) => [item.category, item.amount])
  const topData = window.google.visualization.arrayToDataTable([['카테고리', '지출'], ...(topRows.length ? topRows : [['데이터 없음', 0]])])
  new window.google.visualization.BarChart(topExpenseChart.value).draw(topData, chartOptions({ height: 300, colors: ['#00e5ff'] }))
}

onMounted(async () => {
  await loadGoogleCharts()
  loaded = true
  drawCharts()
  window.addEventListener('resize', drawCharts)
})

watch(() => store.transactions, drawCharts, { deep: true })
</script>
