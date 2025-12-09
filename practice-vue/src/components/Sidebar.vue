<template>
  <el-menu
    default-active="/"
    class="sidebar-menu"
    router
  >
    <div class="sidebar-top">
      <div class="sidebar-title">
        ZB3
      </div>

      <!-- Home -->
      <el-menu-item index="/">
        <el-icon class="menu-icon">
          <HomeFilled />
        </el-icon>
        <span class="menu-text">ホーム</span>
      </el-menu-item>
    </div>

    <!-- ↓ bottom -->
    <div class="sidebar-bottom">
      <el-menu-item index="/settings">
        <el-icon class="menu-icon">
          <Setting />
        </el-icon>
        <span class="menu-text">設定</span>
      </el-menu-item>
    </div>
  </el-menu>
</template>

<script setup>
import { HomeFilled, Setting } from '@element-plus/icons-vue'
</script>
