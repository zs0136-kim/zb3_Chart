<template>
  <header class="header">
    <h2 class="header-title">ダッシュボード</h2>

    <!-- 右側プロフィール -->
    <div class="header-user">
      <img src="/user.png" alt="User avatar" class="user-avatar" />
      <div class="user-text">
        <div class="user-name">Torikoshi Harumi</div>
        <div class="user-role">IT事業部</div>
      </div>
    </div>
  </header>
</template>

<script setup>
</script>

<style scoped>
.header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between; /* 左タイトル / 右プロフィールを両端に */
  padding: 0 20px;
  border-bottom: 1px solid #ddd;
  font-size: 18px;
  font-weight: bold;
}

/* 左側タイトル */
.header-title {
  font-size: 18px;
}

/* 右側プロフィール全体 */
.header-user {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: normal;
}

/* 丸いアイコン */
.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

/* 名前＋役職の縦並び */
.user-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #5F6181;
}

.user-role {
  font-size: 12px;
  color: #9CA0C5;
}
</style>
