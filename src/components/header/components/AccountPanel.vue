<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDisplay } from 'vuetify'
import { useRouter } from 'vue-router'
import { useAuthSession } from '@/features/auth'
import { BaseIconButton } from '@/shared/ui'
import BellIcon from '@/assets/icons/bell.svg'
import ProfileIcon from '@/assets/icons/profile.svg'
import ChevronDownIcon from '@/assets/icons/chevron-down.svg'

defineEmits<{
  'toggle-mobile-menu': []
}>()

const router = useRouter()
const display = useDisplay()
const { user, logout } = useAuthSession()
const isMenuOpen = ref(false)

const userName = computed(() => user.value?.name ?? 'Требуется авторизация')

async function handleLogout() {
  await logout()
  await router.push('/auth')
}
</script>

<template>
  <div class="d-flex align-center">
    <BaseIconButton
      label="Уведомления"
      background-color="var(--color-surface-muted)"
      class="mx-10px"
    >
      <BellIcon />
    </BaseIconButton>

    <BaseIconButton
      v-if="display.smAndDown.value"
      label="Открыть меню"
      @click="$emit('toggle-mobile-menu')"
    >
      <v-app-bar-nav-icon />
    </BaseIconButton>

    <v-menu v-if="display.smAndDown.value" min-width="160">
      <template #activator="{ props: menuProps }">
        <v-btn v-bind="menuProps" aria-label="Открыть профиль" icon variant="text" size="small">
          <ProfileIcon />
        </v-btn>
      </template>

      <v-list density="compact">
        <v-list-item :title="userName" />
        <v-list-item title="Выйти" @click="handleLogout" />
      </v-list>
    </v-menu>

    <BaseIconButton
      v-else
      label="Профиль"
      background-color="var(--color-surface-muted)"
      class="mx-10px"
    >
      <ProfileIcon />
    </BaseIconButton>

    <div v-if="!display.smAndDown.value" class="d-flex align-center user-profile-wrapper">
      <div class="text-left mr-3 text-no-wrap">
        <div class="username-display">{{ userName }}</div>
        <span class="user-subtitle mt-1">Аккаунт HH.ru</span>
      </div>
    </div>

    <v-menu
      v-if="!display.smAndDown.value"
      min-width="180"
      @update:model-value="isMenuOpen = $event"
    >
      <template #activator="{ props: menuProps }">
        <v-btn
          v-bind="menuProps"
          aria-label="Открыть меню профиля"
          icon
          variant="text"
          size="small"
          class="chevron-btn"
        >
          <ChevronDownIcon :class="{ 'rotate-chevron': isMenuOpen }" />
        </v-btn>
      </template>

      <v-list density="compact">
        <v-list-item title="Мой профиль" />
        <v-list-item title="Перейти на аккаунт HH.ru" />
        <v-list-item title="Выйти" @click="handleLogout" />
      </v-list>
    </v-menu>
  </div>
</template>

<style scoped>
.mx-10px {
  margin-right: var(--space-2);
  margin-left: var(--space-2);
}

.username-display {
  color: #424242;
  font-family: var(--font-sans);
  font-size: 18px;
  font-weight: 600;
  line-height: 1;
}

.user-subtitle {
  color: inherit;
  font-family: var(--font-sans);
  font-size: 14px;
}

.chevron-btn :deep(svg) {
  width: 20px;
  height: 20px;
}

.rotate-chevron {
  transform: rotate(180deg);
}
</style>
