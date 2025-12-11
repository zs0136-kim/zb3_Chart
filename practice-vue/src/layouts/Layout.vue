<!-- src/layouts/Layout.vue -->
<template>
  <div class="layout">
    <!-- 左サイドメニュー -->
    <aside class="sidebar">
      <Sidebar />
    </aside>

    <!-- 右側メイン -->
    <div class="main">
      <HeaderBar />
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
  flex: 1;
  overflow: auto;
  padding: 16px;
}
</style>
