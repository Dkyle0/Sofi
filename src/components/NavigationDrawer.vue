<script setup lang="ts">
import DashboardIcon from '@/assets/icons/dashboard.svg'
import PositionIcon from '@/assets/icons/positions.svg'
import ResponsesIcon from '@/assets/icons/responses.svg'
import SubscriptionIcon from '@/assets/icons/subscription.svg'
import InterviewsIcon from '@/assets/icons/interviews.svg'
import VacanciesIcon from '@/assets/icons/vacancies.svg'
import ChevronLeftIcon from '@/assets/icons/chevron-left.svg'
import InstructionIcon from '@/assets/icons/instruction.svg'
import SupportIcon from '@/assets/icons/support.svg'
import BaseIconButton from '@/components/buttons/iconButton.vue'
import { storeToRefs } from 'pinia'
import { useUIStore } from '@/stores/uiStore'
import { watch } from 'vue'

const props = defineProps<{
  permanent: boolean // Для определения режима (desktop/mobile)
}>()

const uiStore = useUIStore()
const { isDrawerCollapsed, isDrawerVisible } = storeToRefs(uiStore)
const { toggleDrawerCollapse, toggleDrawerVisibility } = uiStore

watch(isDrawerVisible, (val) => {
  console.log('Drawer visible changed:', val)
})

const navItems = [
  { icon: DashboardIcon, title: 'Дэшборд', to: '/' },
  { icon: PositionIcon, title: 'Позиции', to: '/positions' },
  { icon: ResponsesIcon, title: 'Отклики', to: '/responses' },
  { icon: SubscriptionIcon, title: 'Подписка', to: '/subscription' },
  { icon: InterviewsIcon, title: 'Интервью', to: '/interviews' },
  { icon: VacanciesIcon, title: 'Вакансии', to: '/vacancies' },
]

// Логика закрытия / переключения
const handleToggle = () => {
  if (props.permanent) {
    toggleDrawerCollapse()
  } else {
    toggleDrawerVisibility()
  }
}
</script>

<template>
  <v-navigation-drawer
    v-model="isDrawerVisible"
    app
    :permanent="permanent"
    width="280"
    :rail-width="104"
    :rail="isDrawerCollapsed && permanent"
    color="white"
    elevation="0"
    class="py-10"
  >
    <div class="d-flex align-center pa-0 ma-0">
      <BaseIconButton
        background-color="#f3f3f3"
        class="toggle-icon"
        disable-hover
        @click="handleToggle"
      >
        <ChevronLeftIcon :class="{ 'is-rotated': isDrawerCollapsed && permanent }" />
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
        <template v-slot:prepend>
          <component :is="item.icon" class="nav-icon" />
        </template>
        <v-list-item-title
          v-if="!(isDrawerCollapsed && permanent)"
          class="ml-5 list-item-title-animated"
          >{{ item.title }}</v-list-item-title
        >
      </v-list-item>
    </v-list>

    <template v-slot:append>
      <div class="naw-down-info">
        <v-card
          v-if="!(isDrawerCollapsed && permanent)"
          flat
          class="naw-down-info-element v-card-animated"
        >
          <ResponsesIcon />
          <div class="responses-info">
            <span class="responses-info-data">0 из 20</span>
            <span class="responses-info-text">Суточных откликов</span>
          </div>
        </v-card>

        <BaseIconButton
          elevation="0"
          width="100%"
          height="100%"
          padding="12px 40px"
          class="naw-down-info-element"
        >
          <div class="responses-info-btn">
            <span v-if="!(isDrawerCollapsed && permanent)" class="button-text-animated"
              >Инструкция</span
            >
            <InstructionIcon />
          </div>
        </BaseIconButton>

        <BaseIconButton
          elevation="0"
          width="100%"
          height="100%"
          padding="12px 40px"
          class="naw-down-info-element"
        >
          <div class="responses-info-btn">
            <span v-if="!(isDrawerCollapsed && permanent)" class="button-text-animated"
              >Поддержка</span
            >
            <SupportIcon />
          </div>
        </BaseIconButton>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<style scoped>
.list-item-title-animated {
  transition:
    opacity 0.3s ease-in-out,
    transform 0.3s ease-in-out;
}

.v-card-animated {
  transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.button-text-animated {
  transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.naw-down-info {
  transition: all 0.3s ease-in-out;
}

:deep(.v-navigation-drawer--rail) .naw-down-info-element {
  justify-content: center;
  padding: 10px;
  gap: 0;
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
  fill: currentColor;
  color: currentColor;
  transition:
    color 0.3s ease-in-out,
    fill 0.3s ease-in-out;
}

.v-list-item--nav .v-list-item-title {
  font-size: 18px;
}
.menu-item {
  padding: 18px 40px;
  height: 63px;
  text-decoration: none;
  color: #8b8b8b;
  transition: all 0.3s;
  font-size: 18px !important;
  font-family: 'Wix Madefor Display';
  line-height: 100%;
  letter-spacing: 0%;
  vertical-align: middle;
  position: relative;
}

.toggle-icon {
  margin-left: 27px;
  margin-bottom: 30px;
}

.menu-item.custom-active-list-item .v-list-item-title,
.menu-item.custom-active-list-item .nav-icon {
  color: #0057ff;
  fill: #0057ff;
  font-weight: 600;
}

.menu-item:hover .v-list-item-title,
.menu-item:focus-visible .v-list-item-title,
.menu-item:hover .nav-icon,
.menu-item:focus-visible .nav-icon {
  color: #0057ff !important;
  fill: #0057ff !important;
  transition: all 0.3s ease-in-out;
}

:deep(.menu-item:hover .v-list-item__overlay),
:deep(.menu-item:focus-visible .v-list-item__overlay) {
  opacity: 0 !important;
}

.menu-item:hover,
.menu-item:focus-visible {
  background-color: transparent !important;
}

.naw-down-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: center;
  padding: 10px;
  margin: 0 15px;
  transition: transform 0.3s ease-in-out;
}

.naw-down-info-element {
  display: flex;
  padding: 10px 30px;
  background-color: #f5f5f5;
  border-radius: 12px;
  width: 100%;
  align-items: center;
  justify-content: center;
  opacity: 1;
  transition: transform 0.3s ease-in-out;
  gap: 10px;
}

.responses-info {
  display: flex;
  flex-direction: column;
}

.responses-info-data {
  font-weight: 600;
  font-size: 16px;
  color: #222;
}

.responses-info-text {
  font-weight: 400;
  font-size: 14px;
  color: #8b8b8b;
  transition: transform 0.3s ease-in-out;
}

.responses-info-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 100%;
  font-weight: 600 !important;
}

.responses-info-btn :hover {
  transition: color 0.3s ease;
}
</style>
