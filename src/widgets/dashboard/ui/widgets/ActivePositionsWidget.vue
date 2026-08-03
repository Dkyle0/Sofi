<script setup lang="ts">
import type { DashboardPosition } from '@/features/dashboard'
import './widgetShared.css'

defineProps<{
  positions: DashboardPosition[]
}>()

defineEmits<{
  navigate: []
}>()
</script>

<template>
  <div class="dashboard-widget-content positions-widget">
    <ul v-if="positions.length" class="dashboard-widget-list">
      <li
        v-for="position in positions"
        :key="position.id"
        class="dashboard-widget-list-item positions-widget__item"
      >
        <div class="positions-widget__heading">
          <strong class="dashboard-widget-title">{{ position.title }}</strong>
          <span
            v-if="position.newMatches"
            class="positions-widget__matches"
            :aria-label="`${position.newMatches} новых совпадений`"
          >
            +{{ position.newMatches }}
          </span>
        </div>
        <div class="positions-widget__details dashboard-widget-muted">
          <span>{{ position.workFormat }}</span>
          <span aria-hidden="true">·</span>
          <span>{{ position.salary }}</span>
        </div>
        <p v-if="position.industries.length" class="positions-widget__industries">
          {{ position.industries.join(' · ') }}
        </p>
      </li>
    </ul>

    <div v-else class="dashboard-widget-empty" role="status">
      <span class="positions-widget__empty-icon" aria-hidden="true">＋</span>
      <p>Добавьте позицию, чтобы Sofi начал искать подходящие вакансии.</p>
    </div>

    <v-btn
      color="primary"
      :variant="positions.length ? 'text' : 'flat'"
      class="dashboard-widget-button mt-auto"
      @click="$emit('navigate')"
    >
      {{ positions.length ? 'Все позиции' : 'Настроить позицию' }}
    </v-btn>
  </div>
</template>

<style scoped>
.positions-widget__item {
  position: relative;
}

.positions-widget__heading {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
}

.positions-widget__matches {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  min-width: 30px;
  height: 24px;
  padding: 0 7px;
  color: var(--color-primary);
  font-size: 12px;
  font-weight: 700;
  background: var(--color-primary-soft);
  border-radius: 999px;
}

.positions-widget__details {
  display: flex;
  gap: 5px;
  margin-top: 5px;
}

.positions-widget__industries {
  margin-top: 5px;
  overflow: hidden;
  color: var(--color-text-muted);
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.positions-widget__empty-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  color: var(--color-primary);
  font-size: 28px;
  background: var(--color-primary-soft);
  border-radius: 50%;
}
</style>
