// @ts-nocheck
import yoga from 'yoga-layout-prebuilt'

export const FlexDirection = {
  column: yoga.FLEX_DIRECTION_COLUMN,
  'column-reverse': yoga.FLEX_DIRECTION_COLUMN_REVERSE,
  row: yoga.FLEX_DIRECTION_ROW,
  'row-reverse': yoga.FLEX_DIRECTION_ROW_REVERSE
} as const

export const JustifyContent = {
  'flex-start': yoga.JUSTIFY_FLEX_START,
  'flex-end': yoga.JUSTIFY_FLEX_END,
  center: yoga.JUSTIFY_CENTER,
  'space-between': yoga.JUSTIFY_SPACE_BETWEEN,
  'space-around': yoga.JUSTIFY_SPACE_AROUND
} as const

export const FlexWrap = {
  wrap: yoga.WRAP_WRAP,
  'no-wrap': yoga.WRAP_NO_WRAP,
  'wrap-reverse': yoga.WRAP_WRAP_REVERSE
} as const

export const Align = {
  stretch: yoga.ALIGN_STRETCH,
  auto: yoga.ALIGN_AUTO,
  baseline: yoga.ALIGN_BASELINE,
  center: yoga.ALIGN_CENTER,
  'flex-start': yoga.ALIGN_FLEX_START,
  'flex-end': yoga.ALIGN_FLEX_END,
  'space-between': yoga.ALIGN_SPACE_BETWEEN,
  'space-around': yoga.ALIGN_SPACE_AROUND
} as const

export const PositionType = {
  relative: yoga.POSITION_TYPE_RELATIVE,
  absolute: yoga.POSITION_TYPE_ABSOLUTE
} as const

export const Display = {
  flex: yoga.DISPLAY_FLEX,
  none: yoga.DISPLAY_NONE
} as const

export const YogaCustomSizeConfig = {
  AUTO: 'auto',
  SCREEN_SIZE: 'screen',
  WINDOW_SIZE: 'window'
} as const

export const YogaEdges = [yoga.EDGE_TOP, yoga.EDGE_RIGHT, yoga.EDGE_BOTTOM, yoga.EDGE_LEFT]

export type ComputedLayout = {
  left: number
  right: number
  top: number
  bottom: number
  width: number
  height: number
}
// }

export const YogaConstants = {
  FlexDirection,
  JustifyContent,
  FlexWrap,
  Align,
  PositionType,
  Display,
  YogaCustomSizeConfig,
  YogaEdges
} as const
