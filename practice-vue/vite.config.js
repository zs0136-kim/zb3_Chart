import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// Vite の基本設定。Vue プラグインのみを読み込む。
export default defineConfig({
  plugins: [vue()],
});
