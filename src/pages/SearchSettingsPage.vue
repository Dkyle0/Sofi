<script setup lang="ts">
import { useRouter } from 'vue-router'
import ArrowLeftIcon from '@/assets/icons/arrow-left.svg'
import { BaseIconButton } from '@/shared/ui'
import { VacancySearchSettings } from '@/features/vacancy-search'

const router = useRouter()

function goBack() {
  router.back()
}
</script>

<template>
  <v-container fluid class="pa-0 ma-0">
    <div class="px-10 pt-10">
      <v-row>
        <v-col cols="12" sm="6">
          <div class="d-flex align-center">
            <BaseIconButton label="Вернуться назад" class="mr-5" @click="goBack">
              <ArrowLeftIcon />
            </BaseIconButton>
            <h1 class="header-text">Настройка поиска</h1>
          </div>
        </v-col>
        <v-col cols="12" sm="6" class="d-flex align-center justify-sm-end justify-start">
          <p class="text-body-2 text-primary">
            <span class="text-decoration-underline">Как найти больше вакансий?</span>
            <v-icon size="small" color="primary" class="ml-1" icon="$arrowTopRight" />
          </p>
        </v-col>
      </v-row>
    </div>

    <VacancySearchSettings />
  </v-container>
</template>

<style scoped>
.header-text {
  font-family: var(--font-sans);
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
}
</style>
