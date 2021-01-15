import {
  DarkTheme as NativeDarkTheme,
  DefaultTheme as NativeDefaultTheme,
} from 'unitx-ui'

import * as R from 'colay/ramda'

export const DefaultTheme = R.mergeDeepRight(
  NativeDefaultTheme,
  {
    colors: {
      primary: 'rgb(54,118,203)',
      secondary: 'rgb(202,43,81)',
      error: 'rgb(225,82,65)',
      warning: 'rgb(242,156,56)',
      info: 'rgb(71,150,236)',
      success: 'rgb(103,172,91)',
      text: 'rgb(255,255,255)',
      placeholder: 'rgb(189,189,189)',
      disabled: 'rgb(144,144,144)',
    },
  },
)

export const DarkTheme = R.mergeDeepRight(
  NativeDarkTheme,
  {
    colors: {
      primary: 'rgb(155,201,245)',
      secondary: 'rgb(230,148,176)',
      error: 'rgb(225,82,65)',
      warning: 'rgb(242,156,56)',
      info: 'rgb(71,150,236)',
      success: 'rgb(103,172,91)',
      text: 'rgb(33,33,33)',
      placeholder: 'rgb(117,117,117)',
      disabled: 'rgb(158,158,158)',
    },
  },
)

export {
  Theme,
  useTheme,
} from 'unitx-ui'
