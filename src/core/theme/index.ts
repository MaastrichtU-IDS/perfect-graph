import {createProvider} from 'colay-ui'

export const DefaultTheme = {
  palette: {
    common: {
      black: 0,
      white: 16777215
    },
    primary: {
      light: 7964363,
      main: 4149685,
      dark: 3162015,
      contrastText: 16777215
    },
    secondary: {
      light: 16728193,
      main: 16056407,
      dark: 12915042,
      contrastText: 16777215
    },
    error: {
      light: 15037299,
      main: 16007990,
      dark: 13840175,
      contrastText: 16777215
    },
    warning: {
      light: 16758605,
      main: 16750592,
      dark: 16088064,
      contrastText: 0
    },
    info: {
      light: 6600182,
      main: 2201331,
      dark: 1668818,
      contrastText: 16777215
    },
    success: {
      light: 8505220,
      main: 5025616,
      dark: 3706428,
      contrastText: 0
    },
    grey: {
      '50': 16448250,
      '100': 16119285,
      '200': 15658734,
      '300': 14737632,
      '400': 12434877,
      '500': 10395294,
      '600': 7697781,
      '700': 6381921,
      '800': 4342338,
      '900': 2171169,
      A100: 14013909,
      A200: 11184810,
      A400: 3158064,
      A700: 6381921
    },
    text: {
      primary: 0x0b0b0b,
      secondary: 0x0b0b0b,
      disabled: 0x0b0b0b
    },
    divider: 0x0b0b0b,
    background: {
      paper: 10066329,
      default: 16448250
    },
    action: {
      active: 0,
      hover: 0,
      selected: 0,
      disabled: 0,
      disabledBackground: 0,
      focus: 0
    }
  }
}

export const DarkTheme = {
  palette: {
    common: {
      black: 0,
      white: 16777215
    },
    primary: {
      light: 7964363,
      main: 4149685,
      dark: 3162015,
      contrastText: 16777215
    },
    secondary: {
      light: 16728193,
      main: 16056407,
      dark: 12915042,
      contrastText: 16777215
    },
    error: {
      light: 15037299,
      main: 16007990,
      dark: 13840175,
      contrastText: 16777215
    },
    warning: {
      light: 16758605,
      main: 16750592,
      dark: 16088064,
      contrastText: 0
    },
    info: {
      light: 6600182,
      main: 2201331,
      dark: 1668818,
      contrastText: 16777215
    },
    success: {
      light: 8505220,
      main: 5025616,
      dark: 3706428,
      contrastText: 0
    },
    grey: {
      '50': 16448250,
      '100': 16119285,
      '200': 15658734,
      '300': 14737632,
      '400': 12434877,
      '500': 10395294,
      '600': 7697781,
      '700': 6381921,
      '800': 4342338,
      '900': 2171169,
      A100: 14013909,
      A200: 11184810,
      A400: 3158064,
      A700: 6381921
    },
    text: {
      primary: 16777215,
      secondary: 16777215,
      disabled: 16777215,
      icon: 16777215
    },
    divider: 16777215,
    background: {
      paper: 8421504,
      default: 3158064
    },
    action: {
      active: 16777215,
      hover: 16777215,
      selected: 16777215,
      disabled: 16777215,
      disabledBackground: 16777215,
      focus: 16777215
    }
  }
}

const {Context, Provider, useProvider} = createProvider({
  value: DefaultTheme
})

export const ThemeContext = Context
export const ThemeProvider = Provider
export const useTheme = () => {
  const [value] = useProvider()
  return value
}

export type Theme = typeof DefaultTheme

export type ThemeProps = {
  theme: Theme
}
