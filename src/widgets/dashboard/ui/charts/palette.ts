/**
 * ECharts calculates hover and transition colors in JavaScript and cannot
 * reliably resolve CSS custom properties there. Keep chart colors concrete
 * and aligned with the semantic tokens from assets/base.css and Vuetify.
 */
export const dashboardChartPalette = {
  primary: '#0057ff',
  primary65: 'rgba(0, 87, 255, 0.65)',
  primary78: 'rgba(0, 87, 255, 0.78)',
  primary88: 'rgba(0, 87, 255, 0.88)',
  primarySoft: '#eaf1ff',
  success: '#16c098',
  surface: '#ffffff',
  surfaceMuted: '#f5f5f5',
  border: '#eeeeee',
  text: '#2c2c2c',
  textMuted: '#737373',
  tooltipShadow: 'rgba(31, 45, 61, 0.14)',
} as const

export const dashboardChartFontFamily = 'Wix Madefor Display Variable'

export const dashboardChartTooltipStyle = {
  confine: true,
  appendToBody: false,
  backgroundColor: dashboardChartPalette.surface,
  borderColor: dashboardChartPalette.border,
  borderWidth: 1,
  padding: [8, 10],
  textStyle: {
    color: dashboardChartPalette.text,
    fontFamily: dashboardChartFontFamily,
    fontSize: 12,
  },
  extraCssText: `border-radius: 10px; box-shadow: 0 8px 24px ${dashboardChartPalette.tooltipShadow};`,
} satisfies TooltipComponentOption
import type { TooltipComponentOption } from 'echarts/components'
