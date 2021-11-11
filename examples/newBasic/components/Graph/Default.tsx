import React from 'react'
import { Graph, } from 'perfect-graph/components/Graph'
export const Data = {
  nodes: [
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
  ],
  edges: [
    { id: 'JerryElaine', target: 'Jerry', source: 'Elaine' },
    // { target: 'Elaine', source: 'Jerry' },
    // { target: 'Elaine', source: 'Jerry' },
    // { target: 'Elaine', source: 'Jerry' },
    // { target: 'Elaine', source: 'Jerry' },
    { id: 'GeorgeJerry', source: 'George', target: 'Jerry' },
    // { target: 'George', source: 'Jerry' },
    { id: 'KramerGeorge', target: 'Kramer', source: 'George' },
    // { target: 'Kramer', source: 'Jerry' },
    { id: 'JerryKramer', target: 'Jerry', source: 'Kramer' },
    // { target: 'Elaine', source: 'Kramer' },
    { id: 'KramerElaine', target: 'Kramer', source: 'Elaine' },
  ]
}
export default function Animation() {
  return (
    <Graph
        style={{ width: 600, height: 600 }}
          {...Data}
        />
  )
}
