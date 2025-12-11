<template>
  <div>
    <el-menu
      class="sidebar-menu"
      :default-active="$route.path"
      @select="handleSelect"
    >
      <div class="sidebar-top">
        <div class="sidebar-title">
          ZB3
        </div>

        <!-- ホーム -->
        <el-menu-item index="/">
          <el-icon class="menu-icon">
            <HomeFilled />
          </el-icon>
          <span class="menu-text">ホーム</span>
        </el-menu-item>

        <!-- 見積り -->
        <el-sub-menu index="quotations">
          <template #title>
            <el-icon class="Quotations-icon">
              <Document />
            </el-icon>
            <span class="menu-text">見積り</span>
          </template>

          <el-menu-item index="/quotations/quotationslist">検索</el-menu-item>
          <el-menu-item index="/quotations/quotationsentries">登録</el-menu-item>
          <el-menu-item index="/quotations/quotationsactivity">履歴</el-menu-item>
          <el-menu-item index="/quotations/quotationspricebook">単価登録</el-menu-item>
        </el-sub-menu>

        <!-- 受注 -->
        <el-sub-menu index="ordertaking">
          <template #title>
            <el-icon class="ordertaking-icon">
              <Phone />
            </el-icon>
            <span class="menu-text">受注</span>
          </template>

          <el-menu-item index="/ordertaking/ordertakinglist">検索</el-menu-item>
          <el-menu-item index="/ordertaking/ordertakingentries">登録</el-menu-item>
          <el-menu-item index="/ordertaking/ordertakingitemlist">商品一覧</el-menu-item>
        </el-sub-menu>
      </div>

      <!-- 設定 -->
      <div class="sidebar-bottom">
        <el-menu-item index="/settings">
          <el-icon class="menu-icon">
            <Setting />
          </el-icon>
          <span class="menu-text">設定</span>
        </el-menu-item>
      </div>

      <!-- ログアウト -->
      <el-menu-item index="logout">
        <el-icon>
          <SwitchButton />
        </el-icon>
        <span>ログアウト</span>
      </el-menu-item>
    </el-menu>

    <!-- ログアウト確認ダイアログ -->
    <el-dialog
      v-model="logoutDialogVisible"
      title="ログアウト"
      width="360px"
      align-center
    >
      <p>ログアウトしますか？</p>
      <template #footer>
        <el-button class="cancel-btn" @click="logoutDialogVisible = false">
          キャンセル
        </el-button>
        <el-button
          class="logout-btn"
          type="primary"
          @click="handleLogout"
        >
          ログアウトする
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  HomeFilled,
  Document,
  Phone,
  Setting,
  SwitchButton,
} from '@element-plus/icons-vue'

const router = useRouter()

// ログアウトダイアログ表示フラグ
const logoutDialogVisible = ref(false)

// メニュー選択時
const handleSelect = (index) => {
  if (index === 'logout') {
    // 画面遷移せずダイアログだけ開く
    logoutDialogVisible.value = true
  } else {
    // それ以外は普通にルーティング
    router.push(index)
  }
}

// 「ログアウトする」ボタン
const handleLogout = () => {
  logoutDialogVisible.value = false
  // 認証情報クリアがあればここで
  // 例: localStorage.removeItem('token')

  router.push('/login')
}
</script>

<style scoped>
.logout-btn {
  background-color: #8b5cf6 !important;
  border-color: #8b5cf6 !important;
}

.logout-btn:hover {
  background-color: #c4b5fd !important;
  border-color: #c4b5fd !important;
}

.cancel-btn {
  color: #8b5cf6 !important;
}

.cancel-btn:hover {
  background-color: #e9e5f8 !important;
  border-color: #e9e5f8 !important;
  color: #fff !important;
}
</style>
