<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <router-view />
</template>

<style>
.v-navigation-drawer[app] {
  top: 91px !important;
  height: calc(100% - 91px) !important;
}
</style>
