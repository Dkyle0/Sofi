<script setup lang="ts">
import { AuthLoginFeature } from '@/features/auth'
import { isMockMode } from '@/app/config/env'
import { demoCredentials } from '@/shared/config'

const initialCredentials = isMockMode ? demoCredentials : undefined
</script>

<template>
  <AuthLoginFeature :initial-credentials="initialCredentials" />
</template>
