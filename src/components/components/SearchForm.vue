<script setup lang="ts">
import FormInputKeywords from '@/components/components/FormInputKeywords.vue'
import FormInputExcluded from '@/components/components/FormInputExcluded.vue'
import TagListIndustry from '@/components/components/TagListIndustry.vue'
import FormDropdownExperience from '@/components/components/FormDropdownExperience.vue'
</script>

<template>
  <div class="form-wrapper">
    <v-form>
      <v-row>
        <v-col cols="12">
          <FormInputKeywords class="mb-8" />
        </v-col>

        <v-col cols="12">
          <FormInputExcluded class="mb-8" />
        </v-col>

        <v-col cols="12">
          <TagListIndustry class="mb-8" />
        </v-col>

        <v-col cols="12">
          <FormDropdownExperience class="mb-8" />
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<style scoped>
.form-wrapper {
  max-width: 850px;
}
</style>
