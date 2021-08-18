import React from 'react'
import App from './_examples/CaseLawExplorerExample'
import ProfilesApp from './_examples/Profiles'
import { ThemeProvider, createTheme } from '@material-ui/core'
import { useMeasure,View } from 'colay-ui'

const theme = createTheme()


export default () => {
  const [containerRef, { width, height, initialized }] = useMeasure()
  return (
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
    
  )
}
