<script setup lang="ts">
import type {
  DashboardAttentionItem,
  DashboardAttentionType,
  DashboardCommand,
} from '@/features/dashboard'
import { formatDateTime } from './widgetFormatting'
import './widgetShared.css'

defineProps<{
  items: DashboardAttentionItem[]
  busyCommand: DashboardCommand['type'] | null
  actionError: string | null
}>()

const emit = defineEmits<{
  command: [command: DashboardCommand]
}>()

const typeMeta: Record<DashboardAttentionType, { label: string; symbol: string }> = {
  'send-error': { label: 'Ошибка отправки', symbol: '!' },
  'employer-question': { label: 'Вопрос работодателя', symbol: '?' },
  'resume-review': { label: 'Проверка резюме', symbol: '✓' },
}

function resolveItem(itemId: string) {
  emit('command', { type: 'resolve-attention', itemId })
}
</script>

<template>
  <div class="dashboard-widget-content attention-widget">
    <p v-if="actionError" class="dashboard-widget-action-error" role="alert" aria-live="assertive">
      {{ actionError }}
    </p>

    <ul v-if="items.length" class="dashboard-widget-list" aria-live="polite">
      <li
        v-for="item in items"
        :key="item.id"
        class="dashboard-widget-list-item attention-widget__item"
        :class="`is-${item.type}`"
      >
        <span class="attention-widget__symbol" aria-hidden="true">
          {{ typeMeta[item.type].symbol }}
        </span>
        <div class="attention-widget__content">
          <p class="attention-widget__type">{{ typeMeta[item.type].label }}</p>
          <strong class="dashboard-widget-title">{{ item.title }}</strong>
          <p class="attention-widget__description">{{ item.description }}</p>
          <time class="dashboard-widget-muted" :datetime="item.createdAt">
            {{ formatDateTime(item.createdAt) }}
          </time>
        </div>
        <v-btn
          color="primary"
          variant="text"
          size="small"
          class="dashboard-widget-button attention-widget__action"
          :loading="busyCommand === 'resolve-attention'"
          :disabled="busyCommand !== null"
          :aria-label="`${item.actionLabel}: ${item.title}`"
          @click="resolveItem(item.id)"
        >
          {{ item.actionLabel }}
        </v-btn>
      </li>
    </ul>

    <div v-else class="dashboard-widget-empty attention-widget__resolved" role="status">
      <span class="attention-widget__resolved-symbol" aria-hidden="true">✓</span>
      <strong>Всё под контролем</strong>
      <p>Нет задач, которые требуют вашего внимания.</p>
    </div>
  </div>
</template>

<style scoped>
.attention-widget__item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 10px;
  border-left: 3px solid rgb(var(--v-theme-warning));
}

.attention-widget__item.is-send-error {
  border-left-color: rgb(var(--v-theme-error));
}

.attention-widget__item.is-resume-review {
  border-left-color: var(--color-primary);
}

.attention-widget__symbol,
.attention-widget__resolved-symbol {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  color: rgb(var(--v-theme-warning));
  font-weight: 800;
  background: var(--color-warning-soft);
  border-radius: 9px;
}

.is-send-error .attention-widget__symbol {
  color: rgb(var(--v-theme-error));
  background: var(--color-error-soft);
}

.is-resume-review .attention-widget__symbol {
  color: var(--color-primary);
  background: var(--color-primary-soft);
}

.attention-widget__content {
  min-width: 0;
}

.attention-widget__type {
  margin-bottom: 3px;
  color: var(--color-text-muted);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.attention-widget__description {
  margin: 5px 0;
  color: var(--color-text-muted);
  font-size: 12px;
  line-height: 1.35;
}

.attention-widget__action {
  grid-column: 2;
  justify-self: start;
  margin-top: 2px;
}

.attention-widget__resolved-symbol {
  width: 46px;
  height: 46px;
  color: rgb(var(--v-theme-success));
  font-size: 22px;
  background: var(--color-success-soft);
  border-radius: 50%;
}

.attention-widget__resolved strong {
  color: var(--color-text);
}
</style>
