<template>
  <header class="header">
    <h2 class="header-title">{{ route.meta.title }}</h2>

    <div class="header-right">
      <!-- ユーザー情報 -->
      <div class="header-user">
        <div class="user-avatar">
          <img
            v-if="currentUser.avatar"
            :src="currentUser.avatar"
            alt="avatar"
            class="avatar-img"
          />
        </div>
        <div class="user-text">
          <div class="user-name">
            {{ currentUser.name }}
          </div>
          <div class="user-dept">
            {{ currentUser.dept }}
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { userStore } from '../stores/userStore'

  const route = useRoute()

  const currentUser = computed(
    () =>
      userStore.currentUser || {
        name: '',
        dept: '',
        avatar: '',
      }
  )
</script>

<style scoped>
.header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid #e5e7f5;
}

/* 左側タイトル */
.header-title {
  font-size: 20px;
  font-weight: 700;
  color: #4b4f7a;
}

/* 右側プロフィール全体 */
.header-right {
  display: flex;
  align-items: center;
}

.header-user {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 丸いアイコン */
.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 名前＋部署を縦並び */
.user-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.user-name {
  font-size: 14px;
  font-weight: 700;
  color: #5f6181;
}

.user-dept {
  font-size: 12px;
  color: #9ca0c5;
}
</style>
