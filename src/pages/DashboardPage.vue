<script setup lang="ts">
import { computed } from 'vue'
import { useAuthSession } from '@/features/auth'
import { DashboardBoard } from '@/widgets/dashboard'

const { user } = useAuthSession()

const userId = computed(() => user.value?.id ?? 'anonymous')
const userName = computed(() => user.value?.firstName ?? user.value?.name ?? 'пользователь')
</script>

<template>
  <DashboardBoard :user-id="userId" :user-name="userName" />
</template>
