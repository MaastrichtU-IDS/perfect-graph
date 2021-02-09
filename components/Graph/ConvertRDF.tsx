import React from 'react'
import * as R from 'colay/ramda'
// import { Graph, } from '../../src/components/Graph'
import { Graph,  } from '../../src/components'
import { GraphEditor,  } from '../../src/components/GraphEditor'
import { convertRDFToGraphData, } from '../../src/plugins/dataConverter'
import { useController, } from '../../src/plugins/controller'

export default function Animation() {
  const [controllerProps, controller] = useController({
    nodes: [],
    edges: [],
    graphConfig: {
    },
    dataBar: {
      editable: true,
      opened: true
    },
  })
  React.useEffect(() => {
    const call = async () => {
      const graphData = await convertRDFToGraphData()
      controller.update((draft) => {
        draft.nodes = graphData.nodes
        draft.edges = graphData.edges
        draft.graphConfig = {
          layout: {...Graph.Layouts.grid, animationDuration: 1000,}
        }
      })
      setTimeout(( )=>{
        controller.update((draft) => {
          draft.selectedElementId =  'http://example.org/#green-goblin'
        })
      }, 1500)
    }
    call()
  },[])
  console.log(controllerProps.nodes)
  return (
    <GraphEditor
        style={{ width: '100%', height: 600 }}
        {...controllerProps}
        />
  )
}
