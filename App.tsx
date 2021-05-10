import React from 'react'
import App from './_examples/CaseLawExplorer'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core'
const theme = createMuiTheme()


export default () => {
  return (
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  )
}
