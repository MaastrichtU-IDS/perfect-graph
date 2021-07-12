import React from 'react'
import * as R from 'colay/ramda'
import { Graph, } from '../../src/components/Graph'

export default function Animation() {
  const [nodes, setNodes] = React.useState({
    Elaine: {position: { x: 400, y: 100 }}
  })
  // React.useEffect(() => {
  //   setInterval(() => {
  //     setNodes((state) => {
  //       const draft = R.clone(state) as typeof state
  //       draft.Elaine.position.x = draft.Elaine.position.x + 5
  //       return draft
  //     })
  //   }, 10)
  // }, []) 
  return (
    <Graph
        style={{ width: '100%', height: 600 }}
        config={{
          nodes
        }}
        nodes={[
          {
            id: 'Elaine',
            position: { x: 400, y: 100 },
            data: { color: 'red' }
          },
          {
            id: 'Jerry',
            position: { x: 400, y: 350 },
            data: { color: 'blue' }
          },
          {
            id: 'Kramer',
            position: { x: 600, y: 500 },
            data: { color: 'blue' }
          },
          {
            id: 'George',
            position: { x: 200, y: 500 },
            data: { color: 'blue' }
          },
        ]}
        edges={[
          { id:'JerryElaine', target: 'Jerry', source: 'Elaine' },
          { id:'ElaineJerry', target: 'Elaine', source: 'Jerry' },
          { id:'JerryElaine', target: 'Jerry', source: 'Elaine' },
          { id:'GeorgeJerry', source: 'George', target: 'Jerry' },
          { id:'GeorgeJerry', target: 'George', source: 'Jerry' },
          { id:'KramerGeorge', target: 'Kramer', source: 'George' },
          { id:'KramerJerry', target: 'Kramer', source: 'Jerry' },
          { id:'JerryKramer', target: 'Jerry', source: 'Kramer' },
          { id:'ElaineKramer', target: 'Elaine', source: 'Kramer' },
          { id:'KramerElaine', target: 'Kramer', source: 'Elaine' },
        ]}
        />
  )
}
