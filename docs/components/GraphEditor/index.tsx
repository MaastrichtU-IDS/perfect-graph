// @ts-nocheck
import React from 'react'
import { GraphEditor, } from 'perfect-graph/components/GraphEditor'
import { useController } from 'perfect-graph/plugins/controller'
import { EVENT, EDITOR_MODE } from 'perfect-graph/constants'
import { useSubscription, } from 'colay-ui'
import { View } from 'react-native-web'
import { useLayout } from 'colay-ui'



const COUNT  = 10
const INITIAL_DATA = {
  nodes: new Array(COUNT).fill(0).map((_, index) => (
    { id: `${index}`, position: { x: index * 100, y: index * 100 },  data: { 'foaf:name': `node-${index}`} }
  )),
  edges: new Array(COUNT - 1).fill(0).map((_,index) => (
    { id: `edge:${index}`, source: `${index}`,  target: `${index+1}`,  data: { 'foaf:name': `edge-${index}`} }
  )),
}

export default function Default() {
  const [controllerProps, controller] = useController({
    ...INITIAL_DATA,
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
      // isOpen: true,
    },
    actionBar: {
      // isOpen: true,
    },
    onEvent: ({
      type,
      extraData,
      element,
      item,
      graphEditor
    }, draft) => {
      switch (type) {
        case EVENT.SETTINGS_FORM_CHANGED:{
          // if (extraData.form.schema.title === FILTER_SCHEMA.schema.title) {

          // } else {
          //   configRef.current.visualization = extraData.value
          // }
          break
        }
    }
  },
  },)
  const  { width, height, initialized,onLayout }= useLayout()
  return (
    <View
      onLayout={onLayout}
      style={{ width: '100%', height: '100%' }}
    > 
      {initialized && (
        <GraphEditor
        style={{ width: width, height: height }}
        configExtractor={({ item }) => ({ data: { data: item }})}
        {...controllerProps}
      />
      )}
    </View>
  )
}