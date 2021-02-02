import React from 'react'
import { Graph, } from '../../src/components/Graph'
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
    { target: 'Jerry', source: 'Elaine' },
    // { target: 'Elaine', source: 'Jerry' },
    // { target: 'Elaine', source: 'Jerry' },
    // { target: 'Elaine', source: 'Jerry' },
    // { target: 'Elaine', source: 'Jerry' },
    { source: 'George', target: 'Jerry' },
    // { target: 'George', source: 'Jerry' },
    { target: 'Kramer', source: 'George' },
    // { target: 'Kramer', source: 'Jerry' },
    { target: 'Jerry', source: 'Kramer' },
    // { target: 'Elaine', source: 'Kramer' },
    { target: 'Kramer', source: 'Elaine' },
  ]
}
export default function Animation() {
  return (
    <Graph
        style={{ width: '100%', height: 600 }}
          {...Data}
        />
  )
}
