<template>
  <div class="analytics-page">
    <h1>月次売上</h1>

    <div class="analytics-row">
        <!-- 左：折れ線グラフ -->
        <div class="analytics-card main-chart-card">
            <div class="analytics-card-header">
                <span class="title">単位/万円</span>
            
                <!-- 年選択プルダウン -->
                <div class="year-select">
                    <select v-model = "selectedYear">
                        <option v-for = "year in years" :key = "year" :value = "year">
                            {{ year }}
                        </option>
                    </select>
                </div>
            </div>
            <LineChart
            id="revenueChart"
            :chart-data="lineData"
            :options="lineOptions"
            />
        </div>

        <!-- 右：2つの小カードを縦並び -->
        <div class="side-cards">
        <!-- 上：ドーナツチャート -->
        <div class="analytics-card small-card">
            <div class="small-card-title">今月の目標達成率</div>
            <div class="donut-wrapper">
                <DoughnutChart
                id="deliveryChart"
                :chart-data="doughnutData"
                :options="doughnutOptions"
                height="350"
                />
                <div class="donut-center">87.5%</div>
            </div>
        </div>

        <!-- 下：棒グラフ -->
        <div class="analytics-card small-card">
            <BarChart
            id="orderRateChart"
            :chart-data="barData"
            :options="barOptions"
            height="150"
            />
            <div class="bar-caption">
                <span class="label">日別売上</span>
                    <div class="threshold-display" @click="showThresholdEditor = !showThresholdEditor">
                        目標値：
                <span class="threshold-value">{{ threshold }}</span>
                <span class="threshold-hint">  ▿</span>
            </div>
            <div v-if="showThresholdEditor" class="threshold-editor">
            <label>
                設定値：
                <input
                type="number"
                v-model.number="threshold"
                min="0"
                max="100"
                />
            </label>
        </div>
            </div>
        </div>

    </div>
    </div>
    <!-- テーブルカード -->
    <div class="shipments-card">
        <h2 class="shipments-title">在庫数</h2>

        <table class="shipments-table">
        <thead>
        <tr>
            <th>商品コード</th>
            <th>商品大分類</th>
            <th>商品中分類</th>
            <th>商品名</th>
            <th>在庫数</th>
            <th>ステータス</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="row in shipments" :key="row.id">
            <td>{{ row.track }}</td>
            <td>{{ row.origin }}</td>
            <td>{{ row.destination }}</td>
            <td>{{ row.carrier }}</td>
            <td>{{ row.day }}</td>
            <td>
                <span :class="['status-pill', row.status]">
                    {{ row.statusText }}
                </span>
            </td>
        </tr>
    </tbody>
</table>

    <div class="shipments-footer">
        <button class="view-all-btn">
            View all <span class="arrow">▼</span>
        </button>
    </div>
</div>

<!-- ガントチャート -->
<div class="upcoming-card">
  <div class="upcoming-header">
    <h2 class="upcoming-title">ガントチャート</h2>
    <div class="upcoming-month">12月 ▼</div>
  </div>

  <!-- 日付 -->

<div class="upcoming-header-row">
  <div class="upcoming-header-spacer"></div>

  <div class="upcoming-days">
    <div
      v-for="day in upcomingDays"
      :key="day.date"
      class="upcoming-day-cell"
    >
      <div class="day-name">{{ day.dow }}</div>
      <div class="day-num">{{ day.date }}</div>
    </div>
  </div>
</div>

  <!-- 日付の下に、ラベル＋バーを横並びで配置 -->
  <div class="upcoming-timeline">
    <!-- 左：縦ラベル -->
    <div class="upcoming-labels">
    <div
        v-for="item in upcomingShipments"
        :key="'label' + item.id"
        class="upcoming-label"
    >
        {{ item.labelAxis }}
    </div>
    </div>

    <!-- 右：バー -->
    <div class="upcoming-bars">
      <div
        v-for="(item, idx) in upcomingShipments"
        :key="item.id"
        class="upcoming-bar"
        :class="item.color"
        :style="{
          gridRow: idx + 1,
          gridColumn: item.start + ' / ' + item.end
        }"
      >
        <span class="bar-dot"></span>
        <span class="bar-label">{{ item.labelBar }}</span>
        <span class="bar-arrow">➜</span>
      </div>
    </div>
  </div>
</div>


  </div>
  
</template>

<script setup>
import { ref, computed } from 'vue'
import { LineChart, DoughnutChart, BarChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

// Chart.js の機能を登録
Chart.register(...registerables, ChartDataLabels)

// ---------- 折れ線グラフ ----------
// 年候補と選択中の年
const years = [2023, 2024, 2025]
const selectedYear = ref(2025)

// 年ごとの売上データ（月別）
const revenueByYear = {
    2023: [500, 400, 550, 600, 800, 200, 450, 300, 200, 700, 850, 1000],
    2024: [1200, 800, 300, 400, 200, 600, 550, 700, 850, 500, 800, 400],
    2025: [300, 200, 250, 500, 700, 400, 450, 150, 300, 500, 800, 600],
}

// グラフのY軸（月）
const monthLabels = [
    '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'
]

// 全年の最大値
const allValues = Object.values(revenueByYear).flat()
const globalMax = Math.max(...allValues)

// 選択された年に応じてデータを作成する
const lineData = computed(() => ({
  labels: monthLabels,
  datasets: [
    {
      label: `Revenue ${selectedYear.value}`,
      data: revenueByYear[selectedYear.value],
      fill: true,
      borderColor: '#8B5CF6',
      backgroundColor: 'rgba(139,92,246,0.18)',
      tension: 0.4,
      borderWidth: 2,
    },
  ],
}))

const lineOptions = {
    responsive: true,
    plugins: {
        legend: { display: false },
        datalabels: {
        color: '#5F6181',
        anchor: 'end',
        align: 'top',
        offset: 4,
        font: {
            size: 12,
            weight: 'bold'
        },
        formatter: (value) => `${value}`,
        },
    },
    layout: {
        padding: {
            top: 40,
        },
    },
    scales: {
        y: {
            suggestedMax: globalMax * 1.1,
            ticks: {
                color: '#9CA0C5',
            },
            grid: {
                color: '#E5E7F5',
            },
        },
        x: {
            ticks: {
                color: '#9CA0C5',
            },
            grid: {
                display: false,
            },
        },
    },
}

// ---------- ドーナツチャート ----------
const doughnutData = {
  labels: ['On time', 'Late'],
  datasets: [
    {
      data: [87.5, 12.5],
      backgroundColor: ['#8B5CF6', '#E5E7F5'],
      borderWidth: 0,
    },
  ],
}

const doughnutOptions = {
  responsive: true,
  cutout: '70%',// 真ん中をくり抜く
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
}

// ---------- 棒グラフ ----------
const threshold = ref(3)

const barData = computed(() => ({
  labels: ['月', '火', '水', '木', '金'],
  datasets: [
    {
        label: 'Perfect order rate',
        data: [2, 0, 3, 1, 5],
            backgroundColor: (ctx) => {
            const value = ctx.raw ?? ctx.parsed.y
            return value >= threshold.value ? '#FFCF4B' : '#c4b5fd'
      },
        borderRadius: 8,
    },
  ],
}))

// 入力欄を出す/隠すフラグ
const showThresholdEditor = ref(false)

const barOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
  scales: {
    y: {
      ticks: { display: false },
      grid: { display: false },
    },
    x: {
      ticks: {
        color: '#9CA0C5',
      },
      grid: { display: false },
    },
  },
}

// ---------- テーブルカード ----------
const shipments = [
  {
    id: 1,
    track: '3234 8374 12',
    origin: '大分類1',
    destination: '中分類1',
    carrier: '商品A',
    day: '100',
    status: 'processing',
    statusText: '発注済み',
  },
  {
    id: 2,
    track: '2333 5756 85',
    origin: '大分類1',
    destination: '中分類1',
    carrier: '商品A',
    day: '500',
    status: 'on-the-way',
    statusText: '未発注',
  },
  {
    id: 3,
    track: '3234 8374 12',
    origin: '大分類1',
    destination: '中分類2',
    carrier: '商品A',
    day: '700',
    status: 'on-the-way',
    statusText: '未発注',
  },
  {
    id: 4,
    track: '6234 8574 72',
    origin: '大分類2',
    destination: '中分類2',
    carrier: '商品A',
    day: '800',
    status: 'on-the-way',
    statusText: '未発注',
  },
  {
    id: 5,
    track: '7263 9383 84',
    origin: '大分類2',
    destination: '中分類3',
    carrier: '商品A',
    day: '900',
    status: 'on-the-way',
    statusText: '未発注',
  },
]

// ---------- ガントチャート ----------
const upcomingDays = [
  { dow: '火', date: '16' },
  { dow: '水', date: '17' },
  { dow: '木', date: '18' },
  { dow: '金', date: '19' },
  { dow: '土', date: '20' },
  { dow: '日', date: '21' },
  { dow: '月', date: '22' },
  { dow: '火', date: '23' },
  { dow: '水', date: '24' },
  { dow: '木', date: '25' },
  { dow: '金', date: '26' },
]

const upcomingShipments = [
  {
    id: 1,
    labelAxis: '商品1', // 縦軸
    labelBar: '輸送中', // バー内
    color: 'purple',
    start: 1,  // MON 07
    end: 4,    // WED 09
  },
  {
    id: 2,
    labelAxis: '商品2',
    labelBar: '輸送中',
    color: 'purple',
    start: 1,
    end: 4,
  },
  {
    id: 3,
    labelAxis: '商品3',
    labelBar: '運送中',
    color: 'yellow',
    start: 3,  // WED 09
    end: 8,    // MON 14
  },
  {
    id: 4,
    labelAxis: '商品4',
    labelBar: '準備中',
    color: 'pink',
    start: 5,  // FRI 11
    end: 7,    // SUN 13
  },
  {
    id: 5,
    labelAxis: '商品5',
    labelBar: '運送中',
    color: 'yellow',
    start: 7,  // SUN 13
    end: 10,   // WED 16
  },
  {
    id: 6,
    labelAxis: '商品6',
    labelBar: '準備中',
    color: 'pink',
    start: 8,  // MON 14
    end: 11,   // THU 17
  },
]

</script>

<style scoped>
/* ------- 折れ線グラフ、ドーナツチャート、棒グラフのレイアウト ------- */
.analytics-row {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}

.main-chart-card {
  flex: 2;/* 左を大きめに */
}

.side-cards {
  flex: 1;   /* 右の縦2枚 */
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ------- カード共通 ------- */
.analytics-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 16px 20px;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.04);
}

/* ------- 折れ線グラフ ------- */
.analytics-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.analytics-card-header .title {
  font-weight: 600;
  font-size: 16px;
}

.analytics-card-header .year {
  font-size: 14px;
  color: #9ca0c5;
}

.year-select select {
  border: none;
  background: transparent;
  font-size: 14px;
  color: #5F6181;
  font-weight: 500;
  padding: 4px 0;
  cursor: pointer;
}

.year-select::after {
  content: '▼';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  font-size: 10px;
  color: #8B5CF6;
  pointer-events: none;
}

/* ------- ドーナツカード ------- */
.small-card-title {
  text-align: center;
  font-weight: 600;
  margin-bottom: 8px;
}

.donut-wrapper {
  position: relative;
  width: 100%;
  max-width: 180px;
  margin: 0 auto;
}

.donut-center {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 18px;
}

.small-card-subtitle {
  margin-top: 8px;
  text-align: center;
  font-size: 13px;
  color: #9ca0c5;
}

/* ------- 棒グラフカード ------- */
.bar-caption {
  margin-top: 8px;
  text-align: center;
  font-size: 13px;
}

/* ===== テーブルカード ===== */

.shipments-card {
  margin-top: 24px;
  background: #ffffff;
  border-radius: 16px;
  padding: 16px 20px 12px;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.04);
}

.shipments-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.shipments-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.shipments-table thead {
  background: #ece6ff;
}

.shipments-table th,
.shipments-table td {
  padding: 8px 12px;
  text-align: left;
  white-space: nowrap;
}

.shipments-table tbody tr + tr {
  border-top: 1px solid #f0f0ff;
}

.track-link {
  color: #10b981; /* 緑リンク */
  text-decoration: none;
  font-weight: 500;
}

.track-link:hover {
  text-decoration: underline;
}

/* ステータスの pill */
.status-pill {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
}

/* Processing（ピンク） */
.status-pill.processing {
  background: #ffe4f7;
  color: #db2777;
}

/* On the way（グリーン） */
.status-pill.on-the-way {
  background: #c4b5fd;
  color: #8B5CF6;
}

/* 下の「View all」部分 */
.shipments-footer {
  margin-top: 6px;
  text-align: center;
}

.view-all-btn {
  border: none;
  background: transparent;
  color: #8b5cf6;
  font-size: 13px;
  cursor: pointer;
}

.view-all-btn .arrow {
  font-size: 10px;
}

/* ===== ガントチャート ===== */

.upcoming-card {
  margin-top: 24px;
  background: #ffffff;
  border-radius: 16px;
  padding: 16px 20px 20px;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.04);
}

.upcoming-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.upcoming-title {
  font-size: 18px;
  font-weight: 600;
}

.upcoming-month {
  font-size: 14px;
  color: #9ca0c5;
}

/* 日付ヘッダー */
.upcoming-days {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(11, 1fr);
  column-gap: 8px;
  border-bottom: 1px solid #e5e7f5;
  padding-bottom: 8px;
}

.upcoming-day-cell {
  text-align: center;
  font-size: 11px;
  color: #9ca0c5;
}

.upcoming-day-cell .day-name {
  text-transform: uppercase;
}

.upcoming-day-cell .day-num {
  font-weight: 600;
}

/* タイムラインバー */
.upcoming-bars {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(11, 1fr);
  grid-auto-rows: 40px;
  column-gap: 8px;
  row-gap: 12px;
}

.upcoming-bar {
  display: flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 13px;
  color: #5F6181;
  box-shadow: 0 6px 14px rgba(15, 23, 42, 0.12);
  white-space: nowrap;
}

.upcoming-bar .bar-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #8B5CF6;
  margin-right: 8px;
}

.upcoming-bar .bar-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

.upcoming-bar .bar-arrow {
  margin-left: 8px;
  flex-shrink: 0;
  color: #8B5CF6;
}

/* バーの色 */
.upcoming-bar.purple {
  background: #bbf7d0;
  color: #047857;
}

.upcoming-bar.pink {
  background: #ffe4f7;
  color: #db2777;
}

.upcoming-bar.yellow {
  background: #fac826;
  color: #fffaed
}

/* timeline本体 */
.upcoming-timeline {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

/* 左の縦ラベル */
.upcoming-labels {
  width: 160px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 4px;
  font-size: 13px;
  color: #5F6181;
}

.upcoming-label {
  height: 40px;
  display: flex;
  align-items: center;
}

.upcoming-header-row {
  display: flex;
  gap: 12px;
}

.upcoming-header-spacer {
  width: 160px;
}

</style>
