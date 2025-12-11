<template>
  <div class="login-page">
    <div class="login-card">
      <h1 class="login-title">ログインしてください</h1>

      <div class="account-list">
        <!-- アカウント選択ボタン -->
        <button
          class="account-btn"
          v-for="account in accounts"
          :key="account.id"
          @click="selectAccount(account)"
        >
          <div class="account-main">
            <div class="avatar-circle">
              <img :src="account.avatar" class="avatar-img" />
            </div>
            <div class="account-texts">
              <div class="account-name">{{ account.name }}</div>
              <div class="account-dept">{{ account.dept }}</div>
            </div>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { useRouter } from 'vue-router'
  import { userStore } from '../stores/userStore'

  const router = useRouter()

  const accounts = [
    {
      id: 'main',
      name: 'Harumi Torikoshi',
      dept: 'IT事業部',
      avatar: '/user.png',
    },
    {
      id: 'tada',
      name: 'Tada Nohito',
      dept: 'IT事業部',
      avatar: '/user-tada.png',
    },
    {
      id: 'era',
      name: 'Era Ihito',
      dept: 'IT事業部 リーダー',
      avatar: '/user-leader.png',
    },
  ]

  const selectAccount = (account) => {
    // 選んだアカウントをグローバル状態に保存
    userStore.currentUser = account

    // ホームへ遷移
    router.push('/')
  }
</script>


<style scoped>
.login-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f6f7ff;
}

.login-card {
  background: #ffffff;
  padding: 32px 40px;
  border-radius: 16px;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.1);
  min-width: 420px;
}

.login-title {
  font-size: 22px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 24px;
  text-align: center;
}

/* アカウントボタン一覧 */
.account-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 各アカウントボタン */
.account-btn {
  width: 100%;
  border: 1px solid #e5e7f5;
  border-radius: 12px;
  padding: 10px 14px;
  background: #ffffff;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s, box-shadow 0.15s, transform 0.05s;
}

.account-btn:hover {
  background: #f6f7ff;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
}

.account-btn:active {
  transform: translateY(1px);
}

/* ボタン内のレイアウト */
.account-main {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* アイコン丸 */
.avatar-circle {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #c4b5fd;
  color: #ffffff;
  font-weight: 600;
  font-size: 16px;
}

/* テキスト部分 */
.account-texts {
  display: flex;
  flex-direction: column;
}

.account-name {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.account-dept {
  font-size: 12px;
  color: #6b7280;
}

.avatar-img {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  object-fit: cover;
}

</style>
