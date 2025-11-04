<script setup lang="ts">
import { ref } from 'vue'
import { useDisplay } from 'vuetify'
import { useUIStore } from '@/stores/uiStore'
import { useAuthStore } from '@/stores/authStore'
import BaseIconButton from '@/components/buttons/iconButton.vue'
import BellIcon from '@/assets/icons/bell.svg'
import ProfileIcon from '@/assets/icons/profile.svg'
import ChevronDownIcon from '@/assets/icons/chevron-down.svg'
import { authApi } from '@/shared/api/endpoints/auth.api'
import { useRouter } from 'vue-router'

const router = useRouter()
const isMenuOpen = ref(false)
const display = useDisplay()

const AuthStore = useAuthStore()
const userName = AuthStore.user?.name || 'Необходима авторизация'

const uiStore = useUIStore()
const { toggleDrawerVisibility } = uiStore

const handleMenuClick = () => {
  toggleDrawerVisibility()
}

const handleLogout = async () => {
  try {
    await authApi.logout()
  } catch (err) {
    console.warn('Ошибка при logout', err)
  } finally {
    AuthStore.logout()
    router.push('/auth')
  }
}
</script>

<template>
  <div class="d-flex align-center">
    <BaseIconButton @click="() => {}" background-color="#f3f3f3" class="mx-10px">
      <BellIcon />
    </BaseIconButton>

    <BaseIconButton v-if="display.smAndDown.value" @click="handleMenuClick">
      <v-app-bar-nav-icon />
    </BaseIconButton>

    <BaseIconButton v-else background-color="#f3f3f3" class="mx-10px">
      <ProfileIcon />
    </BaseIconButton>

    <div
      v-if="!display.smAndDown.value"
      class="d-flex align-center cursor-pointer user-profile-wrapper"
    >
      <div class="text-left mr-3 text-no-wrap">
        <div class="username-display">
          {{ userName }}
        </div>
        <a href="#" class="user-subtitle mt-1"> {{ 'Аккаунт HH.ru' }} </a>
      </div>
    </div>

    <v-menu
      v-if="!display.smAndDown.value"
      min-width="180"
      @update:model-value="isMenuOpen = $event"
    >
      <template v-slot:activator="{ props: menuProps }">
        <v-btn v-bind="menuProps" icon variant="text" size="small" class="chevron-btn">
          <v-icon :class="{ 'rotate-chevron': isMenuOpen }" color="#424242" size="20">
            <ChevronDownIcon />
          </v-icon>
        </v-btn>
      </template>

      <v-list density="compact">
        <v-list-item>Мой рофиль</v-list-item>
        <v-list-item>Перейти на аккаунт HH.ru</v-list-item>
        <v-list-item>Выйти из HH.ru</v-list-item>
        <v-list-item @click="handleLogout">Выход</v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<style scoped>
.account-panel__backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 1.5rem;
  z-index: 1000;
}

.account-panel {
  background: #fff;
  width: 100%;
  max-width: 420px;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.account-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #eee;
}

.account-panel__title {
  margin: 0;
  font-size: 1rem;
}

.account-panel__close {
  background: transparent;
  border: none;
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
}

.account-panel__body {
  padding: 1rem;
}

.account-panel__footer {
  padding: 0.75rem 1rem;
  border-top: 1px solid #eee;
  text-align: right;
}

.mx-10px {
  margin-left: 10px;
  margin-right: 10px;
}

.username-display {
  font-family: 'Wix Madefor Display', sans-serif !important;
  font-size: 18px !important;
  font-weight: 600 !important;
  line-height: 1 !important;

  text-align: center !important;
  vertical-align: middle;
  letter-spacing: 0 !important;
  color: #424242;
}

.user-subtitle {
  font-family: 'Wix Madefor Display', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: 0;

  padding-top: 11px;
}

.chevron-btn {
  margin-left: 12px;
}
</style>
