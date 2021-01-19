import React from 'react'
import {   GraphEditor,  } from '../../../../src/components/GraphEditor'
import {   Code,  } from '../../../index'
import { useController } from '../../../../src/plugins/controller'
import { EVENT } from '../../../../src/utils/constants'

const COUNT  = 10

export const WithEditElement = () => {
  const [controllerProps] = useController({
    nodes: new Array(COUNT).fill(0).map((_, index) => (
      { id: `${index}`, position: { x: index * 100, y: index * 100 },  data: [{ name: 'foaf:name', value: ['ts','saba'], additional: []}]}
    )),
    edges: new Array(COUNT - 1).fill(0).map((_,index) => (
      { id: `edge:${index}`, source: `${index}`,  target: `${index+1}`,  data: [{ name: 'foaf:name', value: ['ts','saba'], additional: []}]}
    )),
    // graphConfig: {
    //   layout: Graph.Layouts.euler,
    //   zoom: 0.2
    // },
    // settingsBar: {
    //   // opened: true,
    //   forms: [FILTER_SCHEMA, VIEW_CONFIG_SCHEMA]
    // },
    dataBar: {
      // editable: false,
      opened: true,
    },
    actionBar: {
      // opened: true,
      actions: {
        add: { visible: false },
        delete: { visible: false },
      }
    },
    onEvent: ({
      type,
      extraData,
      element
    }) => {
      console.log('event:', type)
      switch (type) {
        
        case EVENT.SETTINGS_FORM_CHANGED:{
          // if (extraData.form.schema.title === FILTER_SCHEMA.schema.title) {

          // } else {
          //   configRef.current.visualization = extraData.value
          // }
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
export const WithEdit = () => {
  return (
    <Code>
      {`() => {
  const [data, setData] = React.useState({
    nodes: [
         { id: '1', position: { x: 10, y: 10 } },
         { id: '2', position: { x: 300, y: 100 } },
       ],
    edges: [
         { id: '51', source: '1', target: '2' }
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

