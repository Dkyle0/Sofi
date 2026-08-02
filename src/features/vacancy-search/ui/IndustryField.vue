<script setup lang="ts">
import type { IndustryItem } from '@/entities/industry'

defineProps<{
  industries: IndustryItem[]
}>()

defineEmits<{
  edit: []
  remove: [industryId: string]
  clear: []
}>()

function formatCount(count: number) {
  return `${count} ${count === 1 ? 'отрасль' : 'отраслей'}`
}
</script>

<template>
  <v-row no-gutters>
    <v-col cols="12" md="4" class="pr-md-4">
      <div class="main-title mb-2">Отрасль компании</div>
    </v-col>

    <v-col cols="12" md="8">
      <div
        v-if="industries.length"
        class="d-flex align-center text-caption text-grey-darken-1 my-3"
      >
        Выбрано:
        <v-btn
          variant="text"
          color="primary"
          density="compact"
          class="count-button font-weight-bold ml-1"
          :aria-label="`Изменить выбор: ${formatCount(industries.length)}`"
          @click="$emit('edit')"
        >
          {{ formatCount(industries.length) }}
        </v-btn>
        <v-btn
          icon="$close"
          variant="text"
          density="compact"
          size="x-small"
          class="ml-1"
          aria-label="Очистить выбранные отрасли"
          @click="$emit('clear')"
        />
      </div>

      <TransitionGroup name="list" tag="div" class="d-flex flex-wrap gap-2 mb-3">
        <v-chip
          v-for="industry in industries"
          :key="industry.id"
          closable
          variant="elevated"
          density="compact"
          elevation="0"
          @click:close="$emit('remove', industry.id)"
          class="text-caption rounded-chip industry-chip"
        >
          {{ industry.name }}
        </v-chip>
      </TransitionGroup>

      <v-btn
        variant="text"
        color="primary"
        size="small"
        class="text-none pa-0 mb-6"
        @click="$emit('edit')"
      >
        Изменить отрасли
      </v-btn>
    </v-col>
  </v-row>
</template>

<style scoped>
.main-title {
  font-family: var(--font-sans);
  font-size: 20px;
  font-weight: 700;
  line-height: 1;
}

.v-col.pr-md-4 {
  padding-right: var(--space-4) !important;
}

.count-button {
  min-width: 0;
  padding: 0;
  text-decoration: underline;
}

.rounded-chip {
  border-radius: var(--radius-control) !important;
}

.industry-chip {
  background-color: var(--color-surface-muted) !important;
  color: var(--color-text) !important;
}

.industry-chip :deep(.v-chip__content),
.industry-chip :deep(.v-chip__close) {
  color: var(--color-text) !important;
}

.gap-2 {
  gap: var(--space-2);
}

.list-enter-active,
.list-leave-active {
  transition: opacity 0.2s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
}
</style>
