<script setup lang="ts">
import { useSearchStore } from '@/stores/searchStore'
import { computed, ref } from 'vue'
import { industriesApi } from '@/shared/api/endpoints/industriesApi'
import BaseIconButton from '@/components/buttons/iconButton.vue'

const store = useSearchStore()

const dialogVisible = ref(false)
const allIndustries = ref<
  { id: string; name: string; industries?: { id: string; name: string }[] }[]
>([])
const loading = ref(false)
const error = ref<string | null>(null)
const selectedIndustriesInDialog = ref([...store.settings.industries])

const notifyVisible = ref(false)
const notifyMessage = ref('')

const industries = computed(() => store.settings.industries)
const industriesCountDisplay = computed(() => {
  return `${store.industriesCount} ${store.industriesCount === 1 ? 'отрасль' : 'отраслей'}`
})

// удалить/очистить
const removeTag = (industry: string) => store.removeIndustry(industry)
const clearAllIndustries = () => (store.settings.industries = [])

// загрузка
const fetchIndustries = async () => {
  loading.value = true
  error.value = null
  try {
    const data = await industriesApi.getAll()
    allIndustries.value = data
  } catch (err) {
    console.error('Ошибка при загрузке отраслей', err)
    error.value = 'Не удалось загрузить отрасли. Попробуйте позже.'
  } finally {
    loading.value = false
  }
}

// диалог
const openIndustryDialog = async () => {
  selectedIndustriesInDialog.value = [...store.settings.industries]
  dialogVisible.value = true
  if (allIndustries.value.length === 0) {
    await fetchIndustries()
  }
}
const closeDialog = () => (dialogVisible.value = false)

// сохранить
const saveIndustries = () => {
  store.settings.industries = [...selectedIndustriesInDialog.value]
  closeDialog()
}

// ограничение выбора
const toggleIndustry = (industry: string) => {
  const index = selectedIndustriesInDialog.value.indexOf(industry)
  if (index === -1) {
    if (selectedIndustriesInDialog.value.length >= 7) {
      notifyMessage.value = 'Можно выбрать максимум 7 отраслей'
      notifyVisible.value = true
      return
    }
    selectedIndustriesInDialog.value.push(industry)
  } else {
    selectedIndustriesInDialog.value.splice(index, 1)
  }
}
</script>

<template>
  <v-dialog v-model="notifyVisible" max-width="400" persistent>
    <v-card>
      <v-card-title class="text-h6 text-center">
        {{ notifyMessage }}
      </v-card-title>

      <v-card-actions class="justify-center">
        <BaseIconButton background-color="#f5f5f5" @click="notifyVisible = false">
          Ок
        </BaseIconButton>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <div>
    <v-row no-gutters>
      <v-col cols="12" md="4" class="pr-md-4">
        <div class="industry-header-wrapper mb-2">
          <div class="main-title">Отрасль компании</div>
        </div>
      </v-col>

      <v-col cols="12" md="8">
        <div
          v-if="industries.length > 0"
          class="d-flex align-center text-caption text-grey-darken-1 my-3"
        >
          Выбрано:
          <span
            class="text-primary font-weight-bold ml-1 cursor-pointer"
            @click="openIndustryDialog"
          >
            {{ industriesCountDisplay }}
          </span>

          <sup
            v-if="industries.length > 0"
            @click="clearAllIndustries"
            class="clear-text-button ml-1 font-weight-bold"
          >
            X
          </sup>
        </div>

        <TransitionGroup name="list" tag="div" class="d-flex flex-wrap gap-2 mb-3">
          <v-chip
            v-for="industry in industries"
            :key="industry"
            closable
            color="#f5f5f5"
            variant="elevated"
            density="compact"
            elevation="0"
            @click:close="removeTag(industry)"
            class="text-caption rounded-chip"
          >
            {{ industry }}
          </v-chip>
        </TransitionGroup>

        <v-btn
          variant="text"
          color="primary"
          size="small"
          class="text-none pa-0 mb-6"
          @click="openIndustryDialog"
        >
          Изменить отрасли
        </v-btn>
      </v-col>
    </v-row>

    <!-- Диалог выбора отраслей -->
    <v-dialog v-model="dialogVisible" max-width="600" scrollable>
      <v-card class="industry-dialog">
        <v-card-title class="d-flex justify-space-between align-center">
          <span class="text-h6 font-weight-bold">Выбор отраслей</span>
          <v-btn icon variant="text" @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text style="max-height: 400px; padding: 20px">
          <v-progress-circular v-if="loading" indeterminate color="primary" />
          <v-alert v-else-if="error" type="error" dense>{{ error }}</v-alert>

          <template v-else>
            <v-expansion-panels multiple>
              <v-expansion-panel v-for="category in allIndustries" :key="category.id">
                <v-expansion-panel-title>{{ category.name }}</v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-list density="compact">
                    <v-list-item
                      v-for="sub in category.industries"
                      :key="sub.id"
                      @click="toggleIndustry(sub.name)"
                      :active="selectedIndustriesInDialog.includes(sub.name)"
                      class="px-2 industry-list-item"
                    >
                      <template v-slot:prepend>
                        <v-checkbox-btn
                          :model-value="selectedIndustriesInDialog.includes(sub.name)"
                          color="primary"
                          density="compact"
                          hide-details
                          class="mr-2"
                        />
                      </template>
                      <v-list-item-title>{{ sub.name }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </template>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <BaseIconButton
            background-color="#b8b8b8"
            width="120px"
            height="40px"
            class="text-none"
            @click="closeDialog"
            >Отмена</BaseIconButton
          >
          <BaseIconButton
            background-color="#f5f5f5"
            width="120px"
            height="40px"
            class="text-none"
            :disabled="!selectedIndustriesInDialog.length"
            @click="saveIndustries"
          >
            Сохранить
          </BaseIconButton>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.main-title {
  font-family: Wix Madefor Display;
  font-weight: 700;
  font-size: 20px;
  line-height: 100%;
  margin-bottom: 4px;
}

.rounded-chip {
  border-radius: 12px !important;
  display: inline-block;
}

.gap-2 {
  gap: 8px;
}

.d-flex.flex-wrap.gap-2 {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.list-enter-active,
.list-leave-active {
  transition: opacity 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
}

.v-chip.rounded-chip :deep(.v-chip__close) {
  transition:
    color 0.2s ease-in-out,
    opacity 0.2s ease;
  opacity: 0.7;
}

.v-chip.rounded-chip:hover :deep(.v-chip__close) {
  opacity: 1;
  color: #0057ff !important;
}

.clear-text-button {
  cursor: pointer;
  font-size: 0.9em;
  transition: opacity 0.2s ease;
}

.clear-text-button:hover {
  opacity: 1;
}

.cursor-pointer {
  cursor: pointer;
  text-decoration: underline;
  transition: opacity 0.2s;
}
</style>
