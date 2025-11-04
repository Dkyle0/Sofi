import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUIStore = defineStore('ui', () => {
  const isDrawerCollapsed = ref(false)
  const isDrawerVisible = ref(true)

  function toggleDrawerCollapse() {
    isDrawerCollapsed.value = !isDrawerCollapsed.value
  }

  function toggleDrawerVisibility() {
    isDrawerVisible.value = !isDrawerVisible.value
  }

  function setDrawerVisibility(value: boolean) {
    isDrawerVisible.value = value
  }

  return {
    isDrawerCollapsed,
    toggleDrawerCollapse,
    isDrawerVisible,
    toggleDrawerVisibility,
    setDrawerVisibility,
  }
})
