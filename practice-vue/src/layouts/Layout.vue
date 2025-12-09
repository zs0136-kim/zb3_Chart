<template>
  <div class="layout">
    <!-- 左サイドメニュー -->
    <aside class="sidebar">
      <Sidebar />
    </aside>

    <!-- 右側メイン領域 -->
    <div class="main">
      <!-- 共通ヘッダー -->
      <HeaderBar />

      <!-- 各ページの内容 -->
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '../components/Sidebar.vue'
import HeaderBar from '../components/HeaderBar.vue'
</script>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 220px;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.content {
  padding: 16px;
  overflow: auto;
  flex: 1;
}
</style>
