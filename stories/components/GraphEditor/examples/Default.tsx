import React from 'react'
import {   GraphEditor, Code } from '../../../index'

const DefaultElement = () => {
  const [data, setData] = React.useState({
    nodes: [
         { id: 1, position: { x: 10, y: 10 } },
         { id: 2, position: { x: 300, y: 100 } },
       ],
    edges: [
         { id: 51, source: 1, target: 2 }
       ]
  })
  return (
    <GraphEditor
       style={{ width: '100%', height: 250 }}
       configExtractor={({ item }) => ({ data: { data: item }})}
       nodes={data.nodes}
       edges={data.edges}
     />
  )
}
export const Default = () => {
  return (
    <Code>
      {`() => {
  const [data, setData] = React.useState({
    nodes: [
         { id: 1, position: { x: 10, y: 10 } },
         { id: 2, position: { x: 300, y: 100 } },
       ],
    edges: [
         { id: 51, source: 1, target: 2 }
       ]
  })
  return (
    <GraphEditor
       style={{ width: '100%', height: 250 }}
       configExtractor={({ item }) => ({ data: { data: item }})}
       nodes={data.nodes}
       edges={data.edges}
     />
  )
}
    `}
    </Code>
  )
}
