import React from 'react'
import App from './_examples/CaseLawExplorerExample'
import ProfilesApp from './_examples/Profiles'
import { ThemeProvider, createTheme } from '@mui/material'
import { useMeasure,View } from 'colay-ui'

const theme = createTheme()

import cytoscape from 'cytoscape'
// @ts-ignore
import euler from 'cytoscape-euler'
// @ts-ignore
import cise from 'cytoscape-cise'
// @ts-ignore
import d3Force from 'cytoscape-d3-force'
// @ts-ignore
import cola from 'cytoscape-cola'
// @ts-ignore
import avsdf from 'cytoscape-avsdf'
// @ts-ignore
import dagre from 'cytoscape-dagre'
// @ts-ignore
import spread from 'cytoscape-spread'
// @ts-ignore
import klay from 'cytoscape-klay'

cytoscape.use(klay)
spread(cytoscape)
cytoscape.use(dagre)
cytoscape.use(avsdf)
cytoscape.use(euler)
cytoscape.use(cise)
cytoscape.use(cola)
cytoscape.use(d3Force)

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
