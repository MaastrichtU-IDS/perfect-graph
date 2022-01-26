import { View, useMeasure } from "colay-ui";
import cytoscape from 'cytoscape';
import cola from 'cytoscape-cola';
import dagre from 'cytoscape-dagre';
import euler from 'cytoscape-euler';
import spread from 'cytoscape-spread';
import React from "react";
import {
  GraphDefault
} from "./components";

spread(cytoscape)
cytoscape.use(dagre)
cytoscape.use(euler)
cytoscape.use(cola)

function App() {
  const [containerRef, { width, height, initialized }] = useMeasure()
  return (
    <View 
      ref={containerRef}
      style={{
        width: '100%', height: '100%'
      }}
    >
      {
        initialized && (
          <GraphDefault
            {...{width, height}}
          />
        )
      }
    </View>
  )
}

export default App;
