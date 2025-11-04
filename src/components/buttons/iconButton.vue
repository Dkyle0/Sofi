<script setup lang="ts">
interface Props {
  backgroundColor?: string
  width?: string
  height?: string
  padding?: string
  disabled?: boolean
  disableHover?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  backgroundColor: 'grey-lighten-3',
  width: '50px',
  height: '50px',
  padding: '0 !important',
  disabled: false,
  disableHover: false,
})

const hoverIconColor = '#3377fd'
</script>

<template>
  <v-btn
    :class="[
      'base-icon-button',
      {
        'is-disabled': disabled,
        'is-hover-disabled': disableHover,
      },
    ]"
    :disabled="disabled"
    icon
    variant="flat"
    size="x-large"
    :style="{
      'background-color': props.backgroundColor,
      width: props.width,
      height: props.height,
      padding: props.padding,
    }"
    :ripple="!disabled"
  >
    <slot />
  </v-btn>
</template>

<style scoped>
.base-icon-button {
  border-radius: 12px !important;
  min-width: 50px !important;

  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.3s ease;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.base-icon-button :deep(.v-btn__content) {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 100% !important;
  height: 100% !important;
  padding: 0 !important;
  box-sizing: border-box;
}

.base-icon-button :deep(.v-icon),
.base-icon-button :deep(svg) {
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
  width: 20px !important;
  height: 20px !important;
  min-width: 20px !important;
  min-height: 20px !important;
  box-sizing: content-box;
  vertical-align: middle;
  line-height: 0;
  color: #131313;
  fill: currentColor;
  transition:
    color 0.3s ease,
    fill 0.3s ease;
  margin: 0;
  padding: 0;
}

.base-icon-button :deep(svg) {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  overflow: visible;
  transform-origin: 50% 50%;
}

/* --------------------------------- ЭФФЕКТЫ ХОВЕРА --------------------------------- */
.base-icon-button:not(.is-disabled):hover {
  box-shadow: 0 0 0 4px rgba(51, 119, 253, 0.2) !important;
  border-color: #3377fd !important;
  color: v-bind('hoverIconColor') !important;
  opacity: 1;
}

.base-icon-button:not(.is-disabled):hover :deep(.v-icon),
.base-icon-button:not(.is-disabled):hover :deep(svg) {
  color: v-bind('hoverIconColor') !important;
  fill: v-bind('hoverIconColor') !important;
}

/* --------------------------------- СОСТОЯНИЕ DISABLED --------------------------------- */
.is-disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

.is-disabled.v-btn {
  background-color: var(--v-theme-grey-lighten-3) !important;
}

.base-icon-button.is-hover-disabled,
.base-icon-button.is-hover-disabled:hover,
.base-icon-button.is-hover-disabled:focus-visible {
  /* Сбрасывает тени, обводку и цвет */
  box-shadow: none !important;
  border-color: transparent !important;
  color: inherit !important;
  background-color: v-bind('props.backgroundColor') !important;
  cursor: pointer !important;
  opacity: 1 !important;
}

.base-icon-button.is-hover-disabled:hover :deep(.v-icon),
.base-icon-button.is-hover-disabled:hover :deep(svg),
.base-icon-button.is-hover-disabled:focus-visible :deep(.v-icon),
.base-icon-button.is-hover-disabled:focus-visible :deep(svg) {
  color: inherit !important;
  fill: inherit !important;
}

.base-icon-button.is-hover-disabled :deep(.v-btn__overlay) {
  opacity: 0 !important;
}

.base-icon-button:focus-visible {
  outline: none !important;
}

.base-icon-button :deep(.v-btn__content) {
  text-transform: none !important;
  font-family: Wix Madefor Display;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: 0%;
  text-align: center;
  vertical-align: middle;
}
</style>
