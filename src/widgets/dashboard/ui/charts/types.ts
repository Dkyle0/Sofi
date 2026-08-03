import type {
  BarSeriesOption,
  FunnelSeriesOption,
  GaugeSeriesOption,
  LineSeriesOption,
} from 'echarts/charts'
import type {
  AriaComponentOption,
  GridComponentOption,
  LegendComponentOption,
  TooltipComponentOption,
} from 'echarts/components'
import type { ComposeOption } from 'echarts/core'

export type DashboardChartOption = ComposeOption<
  | BarSeriesOption
  | FunnelSeriesOption
  | GaugeSeriesOption
  | LineSeriesOption
  | AriaComponentOption
  | GridComponentOption
  | LegendComponentOption
  | TooltipComponentOption
>
