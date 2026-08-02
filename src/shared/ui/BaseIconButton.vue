<script setup lang="ts">
interface Props {
  label?: string
  backgroundColor?: string
  width?: string
  height?: string
  padding?: string
  elevation?: string | number
  disabled?: boolean
  disableHover?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  backgroundColor: 'var(--color-background)',
  label: 'Действие',
  width: '50px',
  height: '50px',
  padding: '0 !important',
  elevation: 0,
  disabled: false,
  disableHover: false,
})

const hoverIconColor = 'var(--color-primary)'
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
    :aria-label="label"
    :elevation="elevation"
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
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  min-width: 50px !important;
  border: 1px solid transparent;
  border-radius: var(--radius-control) !important;
  cursor: pointer;
  transition: all 0.3s ease;
}

.base-icon-button :deep(.v-btn__content) {
  display: flex !important;
  box-sizing: border-box;
  align-items: center !important;
  justify-content: center !important;
  width: 100% !important;
  height: 100% !important;
  padding: 0 !important;
  font-family: var(--font-sans);
  font-size: 16px;
  line-height: 1;
  text-align: center;
  text-transform: none !important;
}

.base-icon-button :deep(.v-icon),
.base-icon-button :deep(svg) {
  display: inline-flex !important;
  box-sizing: content-box;
  align-items: center;
  justify-content: center;
  width: 20px !important;
  min-width: 20px !important;
  height: 20px !important;
  min-height: 20px !important;
  padding: 0;
  margin: 0;
  color: #131313;
  line-height: 0;
  vertical-align: middle;
  fill: currentColor;
  transition:
    color 0.3s ease,
    fill 0.3s ease;
}

.base-icon-button :deep(svg) {
  overflow: visible;
  transform-origin: 50% 50%;
}

.base-icon-button:not(.is-disabled):hover {
  border-color: var(--color-primary) !important;
  box-shadow: 0 0 0 4px rgb(0 87 255 / 20%) !important;
  color: v-bind('hoverIconColor') !important;
}

.base-icon-button:not(.is-disabled):hover :deep(.v-icon),
.base-icon-button:not(.is-disabled):hover :deep(svg) {
  color: v-bind('hoverIconColor') !important;
  fill: v-bind('hoverIconColor') !important;
}

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
  border-color: transparent !important;
  background-color: v-bind('props.backgroundColor') !important;
  box-shadow: none !important;
  color: inherit !important;
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
  box-shadow: 0 0 0 4px rgb(0 87 255 / 35%) !important;
}
</style>
