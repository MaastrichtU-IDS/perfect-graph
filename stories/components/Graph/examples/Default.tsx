import React from 'react'
import { Code } from '../../../index'
import { Graph, } from '../../../../src/components/Graph'

export const DefaultElement = () => (
  <Graph
      style={{ width: '100%', height: 600 }}
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
        { target: 'Jerry', source: 'Elaine' },
        { target: 'Elaine', source: 'Jerry' },
        { source: 'George', target: 'Jerry' },
        { target: 'George', source: 'Jerry' },
        { target: 'Kramer', source: 'George' },
        { target: 'Kramer', source: 'Jerry' },
        { target: 'Jerry', source: 'Kramer' },
        { target: 'Elaine', source: 'Kramer' },
        { target: 'Kramer', source: 'Elaine' },
      ]}
      />
)
export const Default = () => {
  return (
    <Code>
      {`<Graph
      style={{ width: '100%', height: 250 }}
      nodes={[
        {
          id: 'Elaine',
          position: { x: 400, y: 100 },
          data: { color: 'red' }
        },
        {
          id: 'Jerry',
          position: { x: 400, y: 200 },
          data: { color: 'blue' }
        },
        {
          id: 'Kramer',
          position: { x: 600, y: 300 },
          data: { color: 'blue' }
        },
        {
          id: 'George',
          position: { x: 200, y: 300 },
          data: { color: 'blue' }
        },
      ]}
      edges={[
        { source: 'George', target: 'Jerry' },
        { target: 'George', source: 'Jerry' },
        { target: 'Kramer', source: 'George' },
        { target: 'Kramer', source: 'Jerry' },
        { target: 'Jerry', source: 'Kramer' },
        { target: 'Jerry', source: 'Elaine' },
        { target: 'Elaine', source: 'Jerry' },
        { target: 'Elaine', source: 'Kramer' },
        { target: 'Kramer', source: 'Elaine' },
      ]}
      />
    `}
    </Code>
  )
}