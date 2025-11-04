<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import { useSearchStore } from '@/stores/searchStore'
import ArrowLeftIcon from '@/assets/icons/arrow-left.svg'
import BaseIconButton from '@/components/buttons/iconButton.vue'

import SearchForm from '@/components/components/SearchForm.vue'
import SearchActionsPanel from '@/components/components/SearchActionsPanel.vue'

const router = useRouter()
const display = useDisplay()
const store = useSearchStore()

const goBack = () => {
  router.back()
}
</script>

<template>
  <v-container class="pa-0 ma-0">
    <div class="px-10 pt-10">
      <v-row>
        <v-col cols="12" sm="6">
          <div class="d-flex align-center">
            <BaseIconButton class="mr-5"><ArrowLeftIcon @click="goBack" /></BaseIconButton>
            <h1 class="header-text">Настройка поиска</h1>
          </div>
        </v-col>
        <v-col
          cols="12"
          sm="6"
          class="d-flex align-center"
          :class="display.smAndUp.value ? 'justify-end' : 'justify-start'"
        >
          <p class="text-body-2">
            <a href="#" class="text-decoration-underline text-primary hover-effect"
              >Как найти больше вакансий?</a
            >
            <v-icon size="small" color="primary" class="ml-1">mdi-arrow-top-right</v-icon>
          </p>
        </v-col>
      </v-row>
    </div>

    <div class="main-content">
      <v-row>
        <v-col cols="12" md="8" lg="6" class="pa-10">
          <SearchForm />
        </v-col>

        <SearchActionsPanel v-if="display.mdAndUp.value" @save="store.fetchVacanciesCount()" />
      </v-row>
    </div>
  </v-container>
</template>

<style scoped>
.main-content {
  display: flex;
  margin: 30px 40px;
  background-color: white;
  justify-content: space-between;
  border-radius: 12px;
}

.header-text {
  font-family: Wix Madefor Display;
  font-weight: 700;
  font-style: Bold;
  font-size: 32px;
  line-height: 100%;
  letter-spacing: 0%;
  vertical-align: middle;
}

.hover-effect:hover {
  color: #4870b6 !important;
  text-decoration-color: transparent !important;
}
</style>
