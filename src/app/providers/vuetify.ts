import { mdiArrowTopRight, mdiEye, mdiEyeOff } from '@mdi/js'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'

export const vuetify = createVuetify({
  // Vuetify 4 uses newer breakpoint defaults. Keep the v3 values while the
  // existing responsive layout is preserved, then migrate deliberately later.
  display: {
    thresholds: {
      md: 960,
      lg: 1280,
      xl: 1920,
      xxl: 2560,
    },
  },
  icons: {
    defaultSet: 'mdi',
    aliases: {
      ...aliases,
      arrowTopRight: `svg:${mdiArrowTopRight}`,
      eye: `svg:${mdiEye}`,
      eyeOff: `svg:${mdiEyeOff}`,
    },
    sets: { mdi },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#0057ff',
          error: '#FF0004',
          success: '#16C098',
          warning: '#F59E0C',
          purple: '#7518D1',
        },
      },
    },
  },
})
