import React from 'react'
import * as R from 'colay/ramda'
// import { Graph, } from 'perfect-graph/components/Graph'
import { Graph,  } from 'perfect-graph/components'
import { GraphEditor,  } from 'perfect-graph/components/GraphEditor'
import { convertRDFToGraphData, } from 'perfect-graph/plugins/dataConverter'
import { useController, } from 'perfect-graph/plugins/controller'

export default function Animation() {
  const [controllerProps, controller] = useController({
    nodes: [],
    edges: [],
    graphConfig: {
    },
    dataBar: {
      editable: true,
      isOpen: true
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
          draft.selectedElementIds =  ['http://example.org/#green-goblin']
        })
      }, 1500)
    }
    call()
  },[])
  return (
    <GraphEditor
        style={{ width: 600, height: 600 }}
        {...controllerProps}
        />
  )
}
