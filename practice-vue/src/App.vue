<!-- src/App.vue -->
<template>
  <!-- /login 以外のときだけ Layout を表示 -->
  <Layout v-if="!route.meta.hideLayout" />

  <!-- /login のときは Login.vue がそのまま表示される -->
  <router-view v-else />
</template>

<script setup>
import { useRoute } from 'vue-router'
import Layout from './layouts/Layout.vue'

const route = useRoute()
</script>
