<template>
  <div class="settings-page">
    <h1>設定</h1>

    <!-- 事業部全体スイッチの表示設定 -->
    <div class="setting-item">
      <span>事業部全体スイッチを表示</span>
      <el-switch
        v-model="settings.showAllDataSwitch"
        active-text="ON"
        inactive-text="OFF"
        class="chart-switch" 
      />
    </div>
  </div>
</template>

<script setup>
import { settingsStore } from '../stores/settingsStore'
const settings = settingsStore()
</script>

<style scoped>
.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  font-size: 16px;
}
</style>
