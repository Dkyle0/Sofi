import { BarChart, FunnelChart, GaugeChart, LineChart } from 'echarts/charts'
import { AriaComponent, GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import { use } from 'echarts/core'
import { SVGRenderer } from 'echarts/renderers'

// Keep the dashboard chart chunk focused: only the series and components used
// by Sofi widgets are registered.
use([
  FunnelChart,
  BarChart,
  LineChart,
  GaugeChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  AriaComponent,
  SVGRenderer,
])
