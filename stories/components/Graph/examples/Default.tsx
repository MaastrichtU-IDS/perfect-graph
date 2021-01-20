import React from 'react'
import { Code } from '../../../index'
import { Graph, } from '../../../../src/components/Graph'

export const DefaultElement = () => (
  <Graph  
      style={{ width: '100%', height: 250 }}
      nodes={[
        {
          id: '1',
          position: { x: 100, y: 100 },
          data: { color: 'red' }
        },
        {
          id: '2',
          position: { x: 300, y: 100 },
          data: { color: 'blue' }
        },
      ]}
      edges={[
        { id: '51', source: '1', target: '2' }
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
          id: '1',
          position: { x: 100, y: 100 },
          data: { color: 'red' }
        },
        {
          id: '2',
          position: { x: 300, y: 100 },
          data: { color: 'blue' }
        },
      ]}
      edges={[
        { id: '51', source: '1', target: '2' }
      ]}
      />
    `}
    </Code>
  )
}