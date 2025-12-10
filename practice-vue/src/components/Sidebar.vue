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

            <!-- ホーム -->
            <el-menu-item index="/">
                <el-icon class="menu-icon">
                    <HomeFilled />
                </el-icon>
                <span class="menu-text">ホーム</span>
            </el-menu-item>
            
            <!-- 見積り -->
            <el-sub-menu index="quotations">
                <!-- 親メニュー -->
                <template #title>
                    <el-icon class="Quotations-icon">
                        <Document />
                    </el-icon>
                    <span class="menu-text">見積り</span>
                </template>

                <!-- 子メニュー -->
                <el-menu-item index="/quotations/quotationslist">検索</el-menu-item>
                <el-menu-item index="/quotations/quotationsentries">登録</el-menu-item>
                <el-menu-item index="/quotations/quotationsactivity">履歴</el-menu-item>
                <el-menu-item index="/quotations/quotationspricebook">単価登録</el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="ordertaking">
                <!-- 親メニュー -->
                <template #title>
                    <el-icon class="ordertaking-icon">
                        <Phone />
                    </el-icon>
                    <span class="menu-text">受注</span>
                </template>

                <!-- 子メニュー -->
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
    </el-menu>
</template>

<script setup>
    import { Document, HomeFilled, Phone, Setting } from '@element-plus/icons-vue'
</script>
