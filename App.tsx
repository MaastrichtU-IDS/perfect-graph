import React from 'react'
import App from './_examples/CaseLawExplorer'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core'
import { useMeasure,View } from 'colay-ui'

const theme = createMuiTheme()


export default () => {
  const [containerRef, { width, height, initialized }] = useMeasure()
  return (
    <MuiThemeProvider theme={theme}>
          <View 
      ref={containerRef}
      style={{
        width: '100%', height: '100%'
      }}
    >
      {
        initialized && (
          <App
            dispatch={() => {}}
            {...{width, height}}
          />
        )
      }
    </View>
    </MuiThemeProvider>
  )
}
