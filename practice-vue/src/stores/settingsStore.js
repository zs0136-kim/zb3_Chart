import { defineStore } from 'pinia'

export const settingsStore = defineStore('settings', {
  state: () => ({
    showAllDataSwitch: true,  // 事業部全体スイッチ
  }),
  actions: {
    setShowAllDataSwitch(value) {
      this.showAllDataSwitch = value
    }
  }
})