<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { industryGateway, type IndustryCategory, type IndustryItem } from '@/entities/industry'

const props = defineProps<{
  modelValue: boolean
  selectedIndustries: IndustryItem[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  save: [industries: IndustryItem[]]
}>()

const selectionLimit = 7
const categories = ref<IndustryCategory[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const limitMessage = ref('')
const draft = ref<IndustryItem[]>([])
let requestController: AbortController | undefined

const isOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})

function isSelected(industryId: string) {
  return draft.value.some((industry) => industry.id === industryId)
}

async function loadIndustries() {
  if (categories.value.length) return

  requestController?.abort()
  const controller = new AbortController()
  requestController = controller
  isLoading.value = true
  error.value = null

  try {
    categories.value = await industryGateway.getAll(controller.signal)
  } catch {
    if (!controller.signal.aborted) {
      error.value = 'Не удалось загрузить отрасли. Попробуйте ещё раз.'
    }
  } finally {
    if (requestController === controller && !controller.signal.aborted) {
      isLoading.value = false
    }
  }
}

function toggleIndustry(industry: IndustryItem) {
  limitMessage.value = ''
  const index = draft.value.findIndex((item) => item.id === industry.id)

  if (index >= 0) {
    draft.value.splice(index, 1)
    return
  }

  if (draft.value.length >= selectionLimit) {
    limitMessage.value = `Можно выбрать максимум ${selectionLimit} отраслей`
    return
  }

  draft.value.push(industry)
}

function save() {
  emit('save', [...draft.value])
  isOpen.value = false
}

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      draft.value = [...props.selectedIndustries]
      void loadIndustries()
      return
    }

    requestController?.abort()
    isLoading.value = false
    limitMessage.value = ''
  },
)

onBeforeUnmount(() => requestController?.abort())
</script>

<template>
  <v-dialog v-model="isOpen" max-width="600" scrollable>
    <v-card class="industry-dialog">
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h6 font-weight-bold">Выбор отраслей</span>
        <v-btn
          icon="$close"
          variant="text"
          aria-label="Закрыть выбор отраслей"
          @click="isOpen = false"
        />
      </v-card-title>

      <v-divider />

      <v-card-text class="industry-dialog-content">
        <v-progress-circular
          v-if="isLoading"
          indeterminate
          color="primary"
          aria-label="Загрузка отраслей"
        />
        <v-alert v-else-if="error" type="error" variant="tonal" role="alert" aria-live="assertive">
          {{ error }}
          <template #append>
            <v-btn variant="text" color="error" @click="loadIndustries">Повторить</v-btn>
          </template>
        </v-alert>
        <p v-else-if="!categories.length" class="text-body-2" role="status">
          Отрасли пока не найдены.
        </p>

        <template v-else>
          <v-alert
            v-if="limitMessage"
            type="warning"
            variant="tonal"
            density="compact"
            class="mb-4"
            role="alert"
            aria-live="assertive"
          >
            {{ limitMessage }}
          </v-alert>

          <v-expansion-panels multiple>
            <v-expansion-panel v-for="category in categories" :key="category.id">
              <v-expansion-panel-title>{{ category.name }}</v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-list density="compact">
                  <v-list-item
                    v-for="industry in category.industries"
                    :key="industry.id"
                    :active="isSelected(industry.id)"
                    class="px-2 industry-list-item"
                    @click="toggleIndustry(industry)"
                  >
                    <template #prepend>
                      <v-checkbox-btn
                        :model-value="isSelected(industry.id)"
                        color="primary"
                        density="compact"
                        hide-details
                        class="mr-2"
                        @click.stop="toggleIndustry(industry)"
                      />
                    </template>
                    <v-list-item-title>{{ industry.name }}</v-list-item-title>
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
        <v-btn variant="text" @click="isOpen = false">Отмена</v-btn>
        <v-btn color="primary" :disabled="!draft.length" @click="save">Сохранить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.industry-dialog-content {
  min-height: 160px;
  max-height: 400px;
  padding: var(--space-5);
}
</style>
