import React from 'react'
import * as R from 'colay/ramda'
import { Graph, } from 'perfect-graph'

export default function Animation() {
  const [nodes, setNodes] = React.useState({
    Elaine: {position: { x: 400, y: 100 }}
  })
  return (
    <Graph
        style={{ width: 600, height: 600 }}
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
          { id:'GeorgeJerry', source: 'George', target: 'Jerry' },
          { id:'KramerGeorge', target: 'Kramer', source: 'George' },
          { id:'KramerJerry', target: 'Kramer', source: 'Jerry' },
          { id:'JerryKramer', target: 'Jerry', source: 'Kramer' },
          { id:'ElaineKramer', target: 'Elaine', source: 'Kramer' },
          { id:'KramerElaine', target: 'Kramer', source: 'Elaine' },
        ]}
        />
  )
}
