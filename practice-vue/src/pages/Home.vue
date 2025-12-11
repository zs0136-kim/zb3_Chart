<template>
  <div class="analytics-page">
    <div
      class="summary-row"
      v-if="currentUser.name === 'Era Ihito'"
    >
      <button
        v-for="card in summaryCards"
        :key="card.id"
        class="summary-card"
        type="button"
      >
        <div class="summary-left">
          <div class="summary-title">{{ card.title }}</div>
          <div class="summary-number">
            {{ card.value }}
            <span v-if="card.suffix" class="summary-suffix">{{ card.suffix }}</span>
          </div>

          <div class="summary-sub">
            <span class="summary-period">{{ card.period }}</span>
            <span v-if="card.diff" :class="['summary-diff', card.diffType]">
              {{ card.diff }}
            </span>
          </div>
        </div>

        <div class="summary-right">
          <span class="summary-arrow">➜</span>
        </div>
      </button>
    </div>

    <h1>売上</h1>
    <div class="analytics-row">
      <!-- 左：折れ線グラフ -->
      <div class="card main-chart-card">
        <!-- タイトルだけ残す -->
        <div class="analytics-card-header">
          <span class="title">単位/万円</span>
        </div>

        <!-- グラフ + 年選択 + スイッチ -->
        <div class="line-chart-row">

          <div class="line-chart-wrapper">
      
            <!-- ★ 年選択をグラフ右上へ固定配置する -->
            <div class="year-select year-select-absolute">
              <select v-model="selectedYear">
                <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
              </select>
            </div>

            <!-- グラフ本体 -->
            <LineChart
              id="revenueChart"
              class="line-chart"
              :key="lineChartKey"
              :chart-data="lineData"
              :options="lineOptions"
            />
          </div>

          <!-- スイッチ -->
          <div class="toggle-group">
            <!-- Main / Tada ログイン時 -->
            <template v-if="isMain || isTada">
              <!-- 自分のデータ：常にON & disabled（見た目だけ） -->
              <div class="toggle-item">
                <el-switch
                  :model-value="true"
                  class="chart-switch"
                  active-text="個人"
                  disabled
                />
              </div>

              <!-- 事業部全体スイッチ：設定で表示ONのときだけ出す -->
              <div class="toggle-item" v-if="settings.showAllDataSwitch">
                <el-switch
                  v-model="showDivision"
                  class="chart-switch"
                  active-text="事業部全体"
                />
              </div>
             </template>

              <!-- Era ログイン時 -->
              <template v-else-if="isEra">
                <!-- 事業部全体（非表示不可）→ 常にON & disabled -->
                <div class="toggle-item">
                  <el-switch
                    :model-value="true"
                    class="chart-switch"
                    active-text="事業部全体"
                    disabled
                  />
                </div>
                <!-- Main 線 ON/OFF -->
                <div class="toggle-item">
                  <el-switch
                    v-model="showMain"
                    class="chart-switch"
                    active-text="Main"
                  />
                </div>
                <!-- Tada 線 ON/OFF -->
                <div class="toggle-item">
                  <el-switch
                    v-model="showTada"
                    class="chart-switch"
                    active-text="Tada"
                  />
                </div>
              </template>
            </div>
          </div>
        </div>

        <!-- 右：2つの小カードを縦並び -->
        <div class="side-cards" v-if="currentUser.name !== 'Era Ihito'">
          <!-- 上：ドーナツチャート -->
          <div class="card small-card">
            <div class="small-card-title">今月の目標達成率</div>
            <div class="donut-wrapper">
              <DoughnutChart
              id="deliveryChart"
              :chart-data="doughnutData"
              :options="doughnutOptions"
              :height="350"
              />
              <div class="donut-center">{{ doughnutCenter }}</div>
            </div>
          </div>

          <!-- 下：棒グラフ -->
          <div class="card small-card">
            <BarChart
            id="orderRateChart"
            :chart-data="barData"
            :options="barOptions"
            :height="150"
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

        <!-- 売上明細 -->
        <div
          class="shipments-card"
          v-if="currentUser.name === 'Era Ihito'"
        >
        <!-- 表本体：showSalesSummary が true のときだけ表示 -->
        <transition name="fade-height">
          <table
          v-if="showSalesSummary"
          class="shipments-table sales-table"
        >
          <thead>
            <tr>
            <th>販売元</th>
            <th>売上</th>
            <th>販売単価</th>
            <th>販売手数料</th>
            <th>限界利益</th>
            <th>限界利益率</th>
            <th>ROI</th>
            <th>手数料率</th>
            <th>販売価格</th>
            <th>平均単価</th>
            <th>構成比</th>
            </tr>
          </thead>
            <tbody>
              <tr v-for="row in salesSummary" :key="row.id">
              <td>{{ row.company }}</td>
              <td>{{ row.sales }}</td>
              <td>{{ row.costOfGoodsSold }}</td>
              <td>{{ row.salesCommission }}</td>
              <td>{{ row.contributionMargin }}</td>
              <td>{{ row.CMRatio }}</td>
              <td>{{ row.ROI }}</td>
              <td>{{ row.commissionRate }}</td>
              <td>{{ row.unitsSold }}</td>
              <td>{{ row.averageUnitPrice }}</td>
              <td>{{ row.compositionRatio }}</td>
              </tr>
            </tbody>
          </table>
        </transition>
        <!-- 開閉ボタン -->
        <div class="shipments-footer">
          <button
            class="view-all-btn"
            @click="showSalesSummary = !showSalesSummary"
          >
            <span v-if="!showSalesSummary">詳細を確認 ▼</span>
            <span v-else>閉じる ▲</span>
          </button>
        </div>
      </div>

      <h1>商品</h1>
      <!-- テーブルカード -->
      <div class="shipments-card">
        <h2 class="shipments-title">在庫状況</h2>

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
            <tr v-for="row in visibleShipments" :key="row.id">
              <td>
                <a href="#" class="track-link">
                    {{ row.track }}
                </a>
              </td>
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
          <button
            class="view-all-btn"
            @click="showAllShipments = !showAllShipments"
          >
            <span v-if="!showAllShipments">もっと見る ▼</span>
            <span v-else>閉じる ▲</span>
          </button>
        </div>
      </div>

      <!-- ガントチャート -->
      <div class="upcoming-card">
        <div class="upcoming-header">
          <h2 class="upcoming-title">ガントチャート</h2>

          <!-- ボタンスクロール -->
          <el-icon
            class="nav-icon"
            :class="{ disabled: !canGoPrev }"
            @click="goPrev"
          >
              ArrowLeft />
          </el-icon>
          <el-icon
            class="nav-icon"
            :class="{ disabled: !canGoNext }"
            @click="goNext"
          >
            <ArrowRight />
          </el-icon>
          <!-- 月表示 -->
          <div class="upcoming-controls">
            <span class="upcoming-month">12月 ▼</span>
          </div>
        </div>

        <!-- ドラッグスクロール -->
        <div
          class="upcoming-scroll"
          :class="{ dragging: isDragging }"
          @mousedown="onDragStart"
          @mousemove="onDragMove"
          @mouseup="onDragEnd"
          @mouseleave="onDragEnd"
        >
        <!-- 日付 -->
        <div class="upcoming-header-row">
          <div class="upcoming-header-spacer"></div>
          <div class="upcoming-days">
            <div
              v-for="day in upcomingDays"
              :key="day.dow + day.date"
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
              v-for="ship in visibleGanttShipments"
              :key="ship.id"
              class="upcoming-bar"
              :class="ship.color"
              :style="{
              gridRow: ship.row,
              gridColumn: ship.colStart + ' / ' + ship.colEnd
              }"
            >
              <span class="bar-dot"></span>
              <span class="bar-label">{{ ship.labelBar }}</span>
              <span class="bar-arrow">➜</span>
            </div>
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
  import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
  import { userStore } from '../stores/userStore'
  import { settingsStore } from '../stores/settingsStore'

  // Chart.js の機能を登録
  Chart.register(...registerables, ChartDataLabels)

  // 上部サマリーカード
  const summaryCards = [
    {
      id: 'orders',
      title: '昨日の売上',
      value: '￥250,000',
      suffix: '',
      period: '前日比',
      diff: '+24.2%',
      diffType: 'up',
    },
    {
      id: 'deliveries',
      title: '今日の注文数',
      value: 14,
      suffix: '',
      diff: '',
      period: '見込み前日比',
      diff: '-2.2%',
      diffType: 'down',
    },
    {
      id: 'mails',
      title: '通知',
      value: '3+',
      suffix: '',
      diff: '',
      diffType: '',
      period: '',
    },
  ]

  // ---------- 折れ線グラフ ----------
  const showMyData = ref(true)   // デフォルト ON
  const showAllData = ref(false)   // デフォルト OFF
  const lockMyDataSwitch = () => {
    // ここで false を返すと、ON/OFF 切り替えをキャンセルできる
    return false
  }
  const settings = settingsStore()

  // だれでログインしているか
  const isMain = computed(() => currentUser.value.name === 'Harumi Torikoshi')
  const isTada   = computed(() => currentUser.value.name === 'Tada Nohito')
  const isEra    = computed(() => currentUser.value.name === 'Era Ihito')

  // Era 用のスイッチ（Main/Tada ライン表示制御用）
  const showMain = ref(true)   // Era で Main 線を最初から表示するかどうか、好みで
  const showTada   = ref(true)   // Era で Tada 線を最初から表示するかどうか
  const showDivision = ref(true) // 事業部全体（Era では常に表示、Main/Tada では ON/OFF 可能）

  // 年
  const years = [2023, 2024, 2025]
  const selectedYear = ref(2025)

  // 年ごとの月別売上データ（個人用-メイン）
  // Main 用（紫）
  const revenueMain = {
    2023: [200, 180, 220, 250, 300, 150, 200, 180, 170, 260, 300, 350],
    2024: [280, 250, 200, 220, 180, 260, 240, 260, 300, 220, 310, 200],
    2025: [220, 200, 180, 260, 300, 250, 280, 150, 220, 280, 320, 300],
  }

  // Tada 用（緑）
  const revenueTada = {
    2023: [300, 260, 280, 320, 360, 200, 260, 230, 200, 330, 360, 400],
    2024: [350, 300, 320, 280, 260, 320, 360, 330, 380, 300, 360, 380],
    2025: [300, 280, 260, 320, 380, 360, 330, 300, 340, 360, 400, 420],
  }

  // 事業部全体（黄色）
  const revenueDivision = {
    2023: revenueMain[2023].map((m, i) => m + revenueTada[2023][i] + 200),
    2024: revenueMain[2024].map((m, i) => m + revenueTada[2024][i] + 200),
    2025: revenueMain[2025].map((m, i) => m + revenueTada[2025][i] + 200),
  }

  // グラフのY軸（月）
  const monthLabels = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ]

  // 全年の最大値
  const allValues = [
    ...Object.values(revenueMain).flat(),
    ...Object.values(revenueTada).flat(),
    ...Object.values(revenueDivision).flat(),
  ]
  const globalMax = Math.max(...allValues)

  const lineChartKey = computed(
    () => `${selectedYear.value}-${showMain.value}-${showTada.value}-${showDivision.value}-${currentUser.value.name}`
  )
    
  // 選択された年に応じてデータを作成する
  const lineData = computed(() => {
    const year = selectedYear.value
    const datasets = []

    // Main ログイン時
    if (isMain.value) {
      // 自分の線はいつも表示（スイッチで消せない）
      datasets.push({
        label: `Main`,
        data: revenueMain[year],
        fill: true,
        borderColor: '#8B5CF6', // 紫
        backgroundColor: 'rgba(139,92,246,0.18)',
        tension: 0.4,
        borderWidth: 2,
      })

      // 事業部全体：設定でスイッチ表示ON ＆ スイッチON のときだけ
      if (settings.showAllDataSwitch && showDivision.value) {
        datasets.push({
          label: `事業部全体`,
          data: revenueDivision[year],
          fill: true,
          borderColor: '#FACC15', // 黄色
          backgroundColor: 'rgba(250,204,21,0.18)',
          tension: 0.4,
          borderWidth: 2,
        })
      }
    }

    // ② Tada ログイン時
    else if (isTada.value) {
      // 自分の線はいつも表示（スイッチで消せない）
      datasets.push({
        label: `Tada`,
        data: revenueTada[year],
        fill: true,
        borderColor: '#22C55E', // 緑
        backgroundColor: 'rgba(34,197,94,0.18)',
        tension: 0.4,
        borderWidth: 2,
      })

      if (settings.showAllDataSwitch && showDivision.value) {
        datasets.push({
          label: `事業部全体`,
          data: revenueDivision[year],
          fill: true,
          borderColor: '#FACC15',
          backgroundColor: 'rgba(250,204,21,0.18)',
          tension: 0.4,
          borderWidth: 2,
        })
      }
    }

    // Era ログイン時
    else if (isEra.value) {
      // 事業部全体は常に表示（非表示不可）
      datasets.push({
        label: `事業部全体`,
        data: revenueDivision[year],
        fill: true,
        borderColor: '#FACC15',
        backgroundColor: 'rgba(250,204,21,0.18)',
        tension: 0.4,
        borderWidth: 2,
      })

      // Main 線はスイッチ ON のときだけ
      if (showMain.value) {
        datasets.push({
          label: `Main`,
          data: revenueMain[year],
          fill: true,
          borderColor: '#8B5CF6',
          backgroundColor: 'rgba(139,92,246,0.18)',
          tension: 0.4,
          borderWidth: 2,
        })
      }

      // Tada 線はスイッチ ON のときだけ
      if (showTada.value) {
        datasets.push({
          label: `Tada`,
          data: revenueTada[year],
          fill: true,
          borderColor: '#22C55E',
          backgroundColor: 'rgba(34,197,94,0.18)',
          tension: 0.4,
          borderWidth: 2,
        })
      }
    }
    return {
      labels: monthLabels,
      datasets,
    }
  })

  // ---------- 売上明細 ----------
  const currentUser = computed(() => userStore.currentUser)
  const showSalesSummary = ref(false)

  const salesSummary = [
  { company: 'A社', sales: '4,136,794', costOfGoodsSold: '2,311,478', salesCommission: '744,578', contributionMargin: '744,983', CMRatio: '19.40%', ROI: '31.69%' 
  , commissionRate: '31.69%', unitsSold: '702個', averageUnitPrice: '5,471', compositionRatio: '79.1%'},
  { company: 'B社',sales: '512,338', costOfGoodsSold: '212,132', salesCommission: '73,598', contributionMargin: '60,706', CMRatio: '13.09%',  ROI: '18.43%' 
  , commissionRate: '18.43%', unitsSold: '57個', averageUnitPrice: '8,134', compositionRatio: '9.55%'},
  { company: 'C社',sales: '121,432', costOfGoodsSold: '50,419', salesCommission: '148,092', contributionMargin: '32,580', CMRatio: '6.35%',  ROI: '9.80%' 
  , commissionRate: '9.80%', unitsSold: '95個', averageUnitPrice: '5,403', compositionRatio: '50.57%'},
  ]

  // ---------- ドーナツチャート ----------
  const doughnutCenter = computed(() => {
    if (currentUser.value.name === 'Tada Nohito') {
      return '65%'      // ← 上で設定した data[0] に合わせる
    }
    return '87.5%'
  })

  const doughnutData = computed(() => {
  // Tada Nohito 用の値
  if (currentUser.value.name === 'Tada Nohito') {
    return {
      datasets: [
        {
          data: [65, 35],
          backgroundColor: ['#8B5CF6', '#E5E7F5'],
          borderWidth: 0,
        },
      ],
    }
  }

  // それ以外の人
  return {
    datasets: [
      {
        data: [87.5, 12.5],
        backgroundColor: ['#8B5CF6', '#E5E7F5'],
        borderWidth: 0,
      },
    ],
  }
})

  // ---------- 棒グラフ ----------
  const threshold = ref(3)

const barData = computed(() => {
  // Tada Nohito 用データ
  const tadaValues = [4, 3, 5, 2, 6]

  // 通常データ
  const defaultValues = [2, 0, 3, 1, 5]

  const values =
    currentUser.value.name === 'Tada Nohito'
      ? tadaValues
      : defaultValues

  return {
    labels: ['月', '火', '水', '木', '金'],
    datasets: [
      {
        label: 'Perfect order rate',
        data: values,
        backgroundColor: (ctx) => {
          const value = ctx.raw ?? ctx.parsed.y
          return value >= threshold.value ? '#FFCF4B' : '#c4b5fd'
        },
        borderRadius: 8,
      },
    ],
  }
})

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
      status: 'transport',
      statusText: '輸送中',
  },
  {
      id: 2,
      track: '2333 5756 85',
      origin: '大分類1',
      destination: '中分類1',
      carrier: '商品B',
      day: '500',
      status: 'transport',
      statusText: '輸送中',
  },
  {
      id: 3,
      track: '3234 8374 12',
      origin: '大分類1',
      destination: '中分類2',
      carrier: '商品C',
      day: '700',
      status: 'transportation',
      statusText: '未発注',
  },
  {
      id: 4,
      track: '6234 8574 72',
      origin: '大分類2',
      destination: '中分類2',
      carrier: '商品D',
      day: '800',
      status: 'processing',
      statusText: '発注済み',
  },
  {
      id: 5,
      track: '7263 9383 84',
      origin: '大分類2',
      destination: '中分類3',
      carrier: '商品E',
      day: '900',
      status: 'transportation',
      statusText: '運送中',
  },
      {
      id: 6,
      track: '9182 3344 01',
      origin: '大分類1',
      destination: '中分類1',
      carrier: '商品F',
      day: '100',
      status: 'processing',
      statusText: '発注済み',
  },
  {
      id: 7,
      track: '0023 7788 55',
      origin: '大分類1',
      destination: '中分類1',
      carrier: '商品G',
      day: '500',
      status: 'on-the-way',
      statusText: '未発注',
  },
  {
      id: 8,
      track: '1986 0003 99',
      origin: '大分類1',
      destination: '中分類2',
      carrier: '商品H',
      day: '700',
      status: 'on-the-way',
      statusText: '未発注',
  },
  {
      id: 9,
      track: '4688 4141 78',
      origin: '大分類2',
      destination: '中分類2',
      carrier: '商品I',
      day: '800',
      status: 'on-the-way',
      statusText: '未発注',
  },
  {
      id: 10,
      track: '7531 6422 22',
      origin: '大分類2',
      destination: '中分類3',
      carrier: '商品J',
      day: '900',
      status: 'on-the-way',
      statusText: '未発注',
  },
  ]

  const showAllShipments = ref(false)

  // フラグの状態で表示する件数を決定（5件 or 全件）
  const visibleShipments = computed(() =>
  showAllShipments.value ? shipments : shipments.slice(0, 5)
  )

  // ---------- ガントチャート ----------
  // すべての日付（この中から表示範囲だけ切り出す）
  const allDays = [
  { dow: '日', date: '1' },
  { dow: '月', date: '2' },
  { dow: '火', date: '3' },
  { dow: '水', date: '4' },
  { dow: '木', date: '5' },
  { dow: '金', date: '6' },
  { dow: '土', date: '7' },
  { dow: '日', date: '8' },
  { dow: '月', date: '9' },
  { dow: '火', date: '10' },
  { dow: '水', date: '11' },
  { dow: '木', date: '12' },
  { dow: '金', date: '13' },
  { dow: '土', date: '14' },
  { dow: '日', date: '15' },
  { dow: '月', date: '16' },
  { dow: '火', date: '17' },
  { dow: '水', date: '18' },
  { dow: '木', date: '19' },
  { dow: '金', date: '20' },
  { dow: '土', date: '21' },
  { dow: '日', date: '22' },
  { dow: '月', date: '23' },
  { dow: '火', date: '24' },
  { dow: '水', date: '25' },
  { dow: '木', date: '26' },
  { dow: '金', date: '27' },
  { dow: '土', date: '28' },
  { dow: '日', date: '29' },
  { dow: '月', date: '30' },
  { dow: '火', date: '31' },
  ]

  // 一度に表示する列数
  const visibleCount = 11

  // 今見えている先頭インデックス（0 始まり）
  const visibleStart = ref(0)

  // 最大スタート位置
  const maxStart = allDays.length - visibleCount

  // ボタンの活性 / 非活性
  const canGoPrev = computed(() => visibleStart.value > 0)
  const canGoNext = computed(() => visibleStart.value < maxStart)

  // 左右ボタンでスクロール
  const goPrev = () => {
  if (!canGoPrev.value) return
      visibleStart.value = Math.max(0, visibleStart.value - 1) // 1日分左へ
  }

  const goNext = () => {
  if (!canGoNext.value) return
      visibleStart.value = Math.min(maxStart, visibleStart.value + 1) // 1日分右へ
  }

  // ヘッダーに表示する日付
  const upcomingDays = computed(() =>
      allDays.slice(visibleStart.value, visibleStart.value + visibleCount)
  )

  // データ
  const upcomingShipments = [
      {
          id: 1,
          labelAxis: '商品A - 準備',
          labelBar: '準備',
          color: 'pink',
          start: 1,
          end: 3,
      },
      {
          id: 2,
          labelAxis: '商品A - 輸送',
          labelBar: '輸送',
          color: 'purple',
          start: 3,
          end: 8,
      },
      {
          id: 3,
          labelAxis: '商品A - 運送',
          labelBar: '運送',
          color: 'yellow',
          start: 8,
          end: 12,
      },
      {
          id: 4,
          labelAxis: '商品B - 準備',
          labelBar: '準備',
          color: 'pink',
          start: 6,
          end: 10,
      },
      {
          id: 5,
          labelAxis: '商品B - 輸送',
          labelBar: '輸送',
          color: 'yellow',
          start: 10,
          end: 14,
      },
      {
          id: 6,
          labelAxis: '商品B - 運送',
          labelBar: '運送',
          color: 'purple',
          start: 11,
          end: 18,
      },
      {
          id: 7,
          labelAxis: '商品C - 準備',
          labelBar: '準備',
          color: 'pink',
          start: 15,
          end: 16,
      },
      {
          id: 8,
          labelAxis: '商品C - 輸送',
          labelBar: '輸送',
          color: 'yellow',
          start: 16,
          end: 26,
      },
      {
          id: 9,
          labelAxis: '商品C - 運送',
          labelBar: '運送',
          color: 'purple',
          start: 26,
          end: 28,
      },
  ]

  // 表示範囲に合わせたバー位置（grid 用）
  const visibleGanttShipments = computed(() => {
      const windowStart = visibleStart.value
      const windowEnd = visibleStart.value + visibleCount

      return upcomingShipments
          .map((item, index) => {
              const row = index + 1 // 行を固定

              // 範囲外のものは null 返す
              if (item.end <= windowStart || item.start >= windowEnd) {
                  return null
              }

              const clampedStart = Math.max(item.start, windowStart)
              const clampedEnd = Math.min(item.end, windowEnd)

              const colStart = clampedStart - windowStart + 1
              const colEnd = clampedEnd - windowStart + 1

              return {
                  ...item,
                  row,
                  colStart,
                  colEnd,
              }
          })
          .filter(Boolean) // null を捨てる
      })

      // ドラッグ状態
      const isDragging = ref(false)
      const dragStartX = ref(0)

      const onDragStart = (e) => {
          isDragging.value = true
          dragStartX.value = e.clientX
      }

      const onDragMove = (e) => {
          if (!isDragging.value) return

              const deltaX = e.clientX - dragStartX.value
              const dayWidth = 70 // 1 日ぶんの幅(px) ざっくり

              if (Math.abs(deltaX) > dayWidth) {
                  const direction = deltaX > 0 ? -1 : 1 // 右ドラッグ → 過去へ
                  const next = visibleStart.value + direction

                  // 範囲チェック（0 ～ allDays.length - visibleCount）
                  if (next >= 0 && next <= allDays.length - visibleCount) {
                  visibleStart.value = next
                  }
                  // 次の判定用に基準位置を更新
                  dragStartX.value = e.clientX
              }
      }

      const onDragEnd = () => {
          isDragging.value = false
      }
</script>

<style scoped>
/* ===== 上部サマリーカード ===== */
.summary-row {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.summary-card {
  flex: 1;
  border: none;
  background: #ffffff;
  border-radius: 16px;
  padding: 32px 26px;
  box-shadow: 0 10px 26px rgba(15, 23, 42, 0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  text-align: left;
  transition: transform 0.08s ease, box-shadow 0.12s ease;
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.1);
}

/* 左側 */
.summary-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.summary-title {
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
}

.summary-number {
  font-size: 26px;
  font-weight: 700;
  color: #111827;
}

.summary-suffix {
  font-size: 18px;
  margin-left: 4px;
}

/* 下の補足（差分＋期間） */
.summary-sub {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  font-size: 12px;
}

.summary-diff {
  font-weight: 600;
}

.summary-diff.up {
  color: #16a34a; /* 緑（上昇） */
}

.summary-diff.down {
  color: #dc2626; /* 赤（下降にしたいとき用） */
}

.summary-period {
  color: #9ca3af;
}

/* 右側矢印 */
.summary-right {
  font-size: 20px;
  color: #5f6181;
}

.summary-arrow {
  display: inline-block;
}


/* ------- 折れ線グラフ、ドーナツチャート、棒グラフのレイアウト ------- */
.analytics-row {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}

.main-chart-card {
  flex: 2;/* 大きめに */
  order: 2;   /* ← 右側に配置 */
}

.side-cards {
  flex: 1;   /* 縦2枚 */
  display: flex;
  flex-direction: column;
  gap: 16px;
  order: 1;   /* ← 左側に配置 */
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
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  font-size: 10px;
  color: #8B5CF6;
  pointer-events: none;
}

/* グラフとスイッチを横並び */
.line-chart-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

/* グラフ側を広く、スイッチは必要分だけ */
.line-chart {
  flex: 1;
}

.toggle-group {
  position: static;
  display: flex;
  flex-direction: column;
  gap: 6px;

  background: #ffffff;
  padding: 6px 10px;
  border-radius: 8px;
}

.toggle-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #5F6181;
}

.line-chart-wrapper {
  position: relative; /* ← 年選択の絶対配置の基準にする */
  flex: 1;
}

.year-select-absolute {
  position: absolute;
  top: 0;
  right: 0;     /* グラフ右上に配置 */
  z-index: 10;
  background: white;
  padding: 4px 8px;
  border-radius: 6px;
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

/* 発注済み（ピンク） */
.status-pill.processing {
  background: #ffe4f7;
  color: #db2777;
}

/* 未発注（紫） */
.status-pill.on-the-way {
  background: #c4b5fd;
  color: #8B5CF6;
}

/* 輸送中（緑） */
.status-pill.transport {
  background: #bbf7d0;
  color: #047857;
}

/* 運送中（黄） */
.status-pill.transportation {
  background: #fac826;
  color: #fffaed
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
  min-height: 1px;
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

.upcoming-scroll {
  cursor: grab;
  user-select: none;
}

.upcoming-scroll.dragging {
  cursor: grabbing;
}

.upcoming-controls {
  display: flex;
  align-items: center;
  gap: 6px;
}

.nav-icon {
  cursor: pointer;
  font-size: 25px;
  color: #5f6181;
  transition: opacity 0.15s, transform 0.1s;
}

.nav-icon:hover {
  transform: translateY(-1px);
}

/* 端まで来たら薄くしてクリック無効っぽく */
.nav-icon.disabled {
  opacity: 0.3;
  cursor: default;
  pointer-events: none;
}

</style>
