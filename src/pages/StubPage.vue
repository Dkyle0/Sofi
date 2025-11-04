<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <v-container class="fill-height d-flex flex-column align-center justify-center text-center">
    <h1 class="text-h4 font-weight-bold mb-2">{{ title }}</h1>
    <p class="text-body-1 text-medium-emphasis">Раздел находится в разработке 🚧</p>
  </v-container>
</template>
