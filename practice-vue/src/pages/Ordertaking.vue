<template>
  <div>
    <div class="analytics-page">
      <!-- 上部タブ -->
      <div class="card">
        <el-tabs v-model="activeTab" type="card" class="top-tabs" @tab-click="onTabClick">
          <el-tab-pane label="検索" name="ordertakinglist">
            <div>受注書検索</div>
          </el-tab-pane>

          <el-tab-pane label="登録" name="ordertakingentries">
            <div>受注登録</div>
          </el-tab-pane>

          <el-tab-pane label="商品一覧" name="ordertakingitemlist">
            <div>商品一覧</div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const activeTab = ref('ordertakinglist')

// URL変わったらタブも変える
watch(
  () => route.path,
  (newPath) => {
    const last = newPath.split('/').pop()
    if (['ordertakinglist', 'ordertakingentries', 'ordertakingitemlist'].includes(last)) {
      activeTab.value = last
    } else {
      activeTab.value = 'ordertakinglist'
    }
  },
  { immediate: true }
)

// タブクリックでURLも変える
const onTabClick = (pane) => {
  // pane.paneName に name 属性が入ってる
  router.push(`/ordertaking/${pane.paneName}`)
}
</script>

<style scoped>
.analytics-page {
  margin-top: 8px;
}

/* タブ全体の余白 */
:deep(.top-tabs) {
  margin-bottom: 8px;
}

/* タブの文字色 */
:deep(.top-tabs .el-tabs__item) {
  color: #5F6181;
  padding: 6px 16px;
  font-size: 14px;
}

/* アクティブタブを色付き＆太字 */
:deep(.top-tabs .el-tabs__item.is-active) {
  color: #8B5CF6;
  font-weight: 600;
}

/* タブ下の線を薄く */
:deep(.top-tabs .el-tabs__nav-wrap::after) {
  background-color: #e5e7f5;
}


</style>