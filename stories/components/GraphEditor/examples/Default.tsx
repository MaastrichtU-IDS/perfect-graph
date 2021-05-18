import React from 'react'
import {   GraphEditor,  } from '../../../../src/components/GraphEditor'
import {   Code,  } from '../../../index'
import { useController } from '../../../../src/plugins/controller'
import { EVENT } from '../../../../src/utils/constants'
import './api'

export const DefaultElement = () => {
  const [controllerProps] = useController({
    nodes: [
      { id: '1', position: { x: 10, y: 10 }, data: {name: 'ts'} },
      { id: '2', position: { x: 300, y: 100 }, data: {usename: {name: 'ts2'}}},
    ],
    edges: [
          { id: '51', source: '1', target: '2' }
        ],
    // graphConfig: {
    //   layout: Graph.Layouts.euler,
    //   zoom: 0.2
    // },
    // settingsBar: {
    //   // isOpen: true,
    //   forms: [FILTER_SCHEMA, VIEW_CONFIG_SCHEMA]
    // },
    dataBar: {
      editable: false,
    },
    actionBar: {
    },
    onEvent: ({
      type,
      payload,
      element
    }) => {
      switch (type) {
        
        case EVENT.SETTINGS_FORM_CHANGED:{
          break
        }
      
        default:
          break;
      }
      return null
    }
  },)
  return (
    <GraphEditor
       style={{ width: '100%', height: 250 }}
       configExtractor={({ item }) => ({ data: { data: item }})}
       {...controllerProps}
     />
  )
}
// export const Default = () => {
//   return (
//     <Code>
//       {`() => {
//   const [data, setData] = React.useState({
//     nodes: [
//          { id: '1', position: { x: 10, y: 10 } },
//          { id: '2', position: { x: 300, y: 100 } },
//        ],
//     edges: [
//          { id: '51', source: '1', target: '2' }
//        ]
//   })
//   return (
//     <GraphEditor
//        style={{ width: '100%', height: 250 }}
//        configExtractor={({ item }) => ({ data: { data: item }})}
//        nodes={data.nodes}
//        edges={data.edges}
//      />
//   )
// }
//     `}
//     </Code>
//   )
// }
