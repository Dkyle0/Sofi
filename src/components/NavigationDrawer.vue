<script setup lang="ts">
import { computed } from 'vue'
import DashboardIcon from '@/assets/icons/dashboard.svg'
import PositionIcon from '@/assets/icons/positions.svg'
import ResponsesIcon from '@/assets/icons/responses.svg'
import SubscriptionIcon from '@/assets/icons/subscription.svg'
import InterviewsIcon from '@/assets/icons/interviews.svg'
import VacanciesIcon from '@/assets/icons/vacancies.svg'
import ChevronLeftIcon from '@/assets/icons/chevron-left.svg'
import InstructionIcon from '@/assets/icons/instruction.svg'
import SupportIcon from '@/assets/icons/support.svg'
import { BaseIconButton } from '@/shared/ui'

const props = defineProps<{
  modelValue: boolean
  permanent: boolean
  collapsed: boolean
  dailyResponsesUsed?: number
  dailyResponsesLimit?: number
  isDailyResponsesLoading?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'toggle-collapse': []
}>()

const drawerVisible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})

const navItems = [
  { icon: DashboardIcon, title: 'Дэшборд', to: { name: 'Dashboard' } },
  { icon: PositionIcon, title: 'Позиции', to: '/positions' },
  { icon: ResponsesIcon, title: 'Отклики', to: '/responses' },
  { icon: SubscriptionIcon, title: 'Подписка', to: '/subscription' },
  { icon: InterviewsIcon, title: 'Интервью', to: '/interviews' },
  { icon: VacanciesIcon, title: 'Вакансии', to: '/vacancies' },
]

function handleToggle() {
  if (props.permanent) {
    emit('toggle-collapse')
    return
  }

  drawerVisible.value = false
}
</script>

<template>
  <v-navigation-drawer
    v-model="drawerVisible"
    app
    :permanent="permanent"
    width="280"
    :rail-width="104"
    :rail="collapsed && permanent"
    color="white"
    elevation="0"
    class="py-10"
  >
    <div class="d-flex align-center pa-0 ma-0">
      <BaseIconButton
        background-color="var(--color-background)"
        label="Свернуть или развернуть меню"
        class="toggle-icon"
        disable-hover
        @click="handleToggle"
      >
        <ChevronLeftIcon :class="{ 'is-rotated': collapsed && permanent }" />
      </BaseIconButton>
    </div>

    <v-list class="pa-0 ma-0" density="comfortable" nav>
      <v-list-item
        v-for="item in navItems"
        :key="item.title"
        :to="item.to"
        router
        exact
        link
        active-class="custom-active-list-item"
        class="menu-item"
      >
        <template #prepend>
          <component :is="item.icon" class="nav-icon" />
        </template>
        <v-list-item-title v-if="!(collapsed && permanent)" class="ml-5 list-item-title-animated">
          {{ item.title }}
        </v-list-item-title>
      </v-list-item>
    </v-list>

    <template #append>
      <div class="drawer-footer">
        <v-card v-if="!(collapsed && permanent)" flat class="drawer-footer-element v-card-animated">
          <ResponsesIcon />
          <div class="responses-info">
            <span class="responses-info-data" aria-live="polite">
              {{
                isDailyResponsesLoading
                  ? `— из ${dailyResponsesLimit ?? 20}`
                  : `${dailyResponsesUsed ?? 0} из ${dailyResponsesLimit ?? 20}`
              }}
            </span>
            <span class="responses-info-text">Суточных откликов</span>
          </div>
        </v-card>

        <BaseIconButton
          elevation="0"
          label="Инструкция"
          width="100%"
          height="100%"
          padding="12px 40px"
          class="drawer-footer-element"
        >
          <div class="responses-info-btn">
            <span v-if="!(collapsed && permanent)" class="button-text-animated">Инструкция</span>
            <InstructionIcon />
          </div>
        </BaseIconButton>

        <BaseIconButton
          elevation="0"
          label="Поддержка"
          width="100%"
          height="100%"
          padding="12px 40px"
          class="drawer-footer-element"
        >
          <div class="responses-info-btn">
            <span v-if="!(collapsed && permanent)" class="button-text-animated">Поддержка</span>
            <SupportIcon />
          </div>
        </BaseIconButton>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<style scoped>
.list-item-title-animated,
.v-card-animated,
.button-text-animated {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

:deep(.v-navigation-drawer--rail) .drawer-footer-element {
  justify-content: center;
  gap: 0;
  padding: 10px;
}

.toggle-icon {
  margin-bottom: 30px;
  margin-left: 27px;
}

.toggle-icon :deep(svg) {
  transition: transform 0.3s ease-in-out;
}

.is-rotated {
  transform: rotate(-180deg);
}

.nav-icon {
  width: 26px;
  height: 26px;
  color: currentColor;
  fill: currentColor;
  transition:
    color 0.3s ease-in-out,
    fill 0.3s ease-in-out;
}

.v-list-item--nav .v-list-item-title {
  font-size: 18px;
}

.menu-item {
  position: relative;
  height: 63px;
  padding: 18px 40px;
  color: #8b8b8b;
  font-family: var(--font-sans);
  font-size: 18px !important;
  line-height: 1;
  text-decoration: none;
  transition: color 0.3s ease;
}

.menu-item.custom-active-list-item .v-list-item-title,
.menu-item.custom-active-list-item .nav-icon,
.menu-item:hover .v-list-item-title,
.menu-item:focus-visible .v-list-item-title,
.menu-item:hover .nav-icon,
.menu-item:focus-visible .nav-icon {
  color: var(--color-primary) !important;
  fill: var(--color-primary) !important;
  font-weight: 600;
}

:deep(.menu-item:hover .v-list-item__overlay),
:deep(.menu-item:focus-visible .v-list-item__overlay) {
  opacity: 0 !important;
}

.menu-item:hover,
.menu-item:focus-visible {
  background-color: transparent !important;
}

.drawer-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-5);
  padding: 10px;
  margin: 0 15px;
}

.drawer-footer-element {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 10px;
  padding: 10px 30px;
  border-radius: var(--radius-control);
  background-color: var(--color-surface-muted);
}

.responses-info {
  display: flex;
  flex-direction: column;
}

.responses-info-data {
  color: #222;
  font-size: 16px;
  font-weight: 600;
}

.responses-info-text {
  color: #8b8b8b;
  font-size: 14px;
}

.responses-info-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 10px;
  font-weight: 600;
}
</style>
