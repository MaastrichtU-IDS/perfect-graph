// @ts-nocheck
import React from 'react'
import * as R from 'unitx/ramda'
import mingo from 'unitx/mingo'
import { ApplicationProvider, Button, Layout,useTheme, } from 'unitx-ui'
import { 
  DarkTheme,
  DefaultTheme,
} from 'unitx-ui'
import  { GraphEditorProps,GraphEditor } from '../../src/components/GraphEditor'
import { Graph } from '../../src/components'
import {drawLine} from '../../src/components/Graphics'
import data from './data'
import * as C from 'unitx/color'
import { getFilterSchema, VIEW_CONFIG_SCHEMA  } from './constants'
import { EVENT } from '../../src/utils/constants'
import {useController} from '../../src/plugins/controller'

type Props = Partial<GraphEditorProps>

const NODE_SIZE = {
  width: 80,
  height: 80,
}

const NODE_SIZE_RANGE_MAP = {
  size: [100, 300],
  community: [0, 10],
  in_degree: [0, 10],
  out_degree: [0, 10],
  degree: [0, 20],
  year: [
    1969,
    2015
  ],
}
const calculateNodeSize = (data: object, fieldName?: keyof typeof NODE_SIZE_RANGE_MAP) => {
  if (!fieldName) {
    return NODE_SIZE_RANGE_MAP.size[0]
  }
  const fieldRange = NODE_SIZE_RANGE_MAP[fieldName]
  const sizeRangeGap = NODE_SIZE_RANGE_MAP.size[1] - NODE_SIZE_RANGE_MAP.size[0]
  const fieldRangeGap = fieldRange[1] - fieldRange[0]
  const fieldRangeValue = (data[fieldName] ?? fieldRange[0]) - fieldRange[0]
  return  ((fieldRangeValue / fieldRangeGap) * sizeRangeGap) + NODE_SIZE_RANGE_MAP.size[0]
}
const calculateColor = (data: object, fieldName?: keyof typeof NODE_SIZE_RANGE_MAP) => {
  if (!fieldName) {
    return perc2color(0)
  }
  const fieldRange = NODE_SIZE_RANGE_MAP[fieldName]
  const sizeRangeGap = NODE_SIZE_RANGE_MAP.size[1] - NODE_SIZE_RANGE_MAP.size[0]
  const fieldRangeGap = fieldRange[1] - fieldRange[0]
  const fieldRangeValue = (data[fieldName] ?? fieldRange[0]) - fieldRange[0]
  return  perc2color((fieldRangeValue / fieldRangeGap) * 100)
}
const perc2color = (
  perc: number,
  min = 20, 
  max = 80
) => {
  var base = (max - min);

  if (base === 0) { perc = 100; }
  else {
      perc = (perc - min) / base * 100; 
  }
  var r, g, b = 0;
  if (perc < 50) {
      r = 255;
      g = Math.round(5.1 * perc);
  }
  else {
      g = 255;
      r = Math.round(510 - 5.10 * perc);
  }
  var h = r * 0x10000 + g * 0x100 + b * 0x1;
  return '#' + ('000000' + h.toString(16)).slice(-6);
}

const AppContainer = ({
  changeTheme,
  ...rest
}) => {
  const configRef = React.useRef({
    visualization: {
      nodeSize: null,
      nodeColor: null
    },
  })
  const FILTER_SCHEMA = React.useMemo(() => getFilterSchema({
    onPopupPress: () => console.log('popup')
  }), [])
  const [controllerProps] = useController({
    ...data,
    graphConfig: {
      // layout: Graph.Layouts.grid,
      // zoom: 0.2
    },
    settingsBar: {
      opened: true,
      forms: [FILTER_SCHEMA, VIEW_CONFIG_SCHEMA]
    },
    dataBar: {
      editable: false,
    },
    actionBar: {
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
      switch (type) {
        
        case EVENT.SETTINGS_FORM_CHANGED:{
          if (extraData.form.schema.title === FILTER_SCHEMA.schema.title) {

          } else {
            configRef.current.visualization = extraData.value
          }
          break
        }
      
        default:
          break;
      }
      return null
    }
  },)
  const graphRef = React.useRef(null)
  const theme = useTheme()
  return (
      <Layout style={{ width: '100%', height: '100%'}}>
      <GraphEditor
        ref={graphRef}
        {...controllerProps}
        extraData={[configRef.current.visualization]}
        style={{ width: '100%', height: '100%', }}
        // graphConfig={{
        //   // layout: Graph.Layouts.breadthfirst,
        //   zoom: 0.5
        // }}
        drawLine={({ graphics, to, from }) => {
          drawLine({
            graphics,
            to,
            from,
            directed: true,
            fill:C.rgbNumber(theme.colors.text)
            // type: 'bezier'
          })
        }}
        renderNode={({ item: { id, data } }) => {
          const size = calculateNodeSize(data, configRef.current.visualization.nodeSize)
          const color = calculateColor(data, configRef.current.visualization.nodeColor)
          return (
            <Graph.HoverContainer
              style={{
                width: size,
                height: size,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 25,//(size/2 )+10,
                backgroundColor: color
                }}
                renderHoverElement={() => (
                  <Graph.View
                    style={{
                      width: size,
                      height: 20,
                      position: 'absolute',
                      left: 0,
                      backgroundColor: color
                    }}
                  >
                    <Graph.Text style={{
                      fontSize: 20,
                       textAlign: 'center',
                      }}>
                      {R.replace('ECLI:NL:', '')(data.ecli)}
                    </Graph.Text>
                  </Graph.View>
                )}
            >
              <Graph.Text style={{fontSize: 10}}>
                {R.replace('ECLI:NL:', '')(data.ecli)}
              </Graph.Text>
            </Graph.HoverContainer>
          )
        }}
        {...rest}
      />
      </Layout>
  )
}

export const mergeDeepAll = (list: Record<string, any>[]) => R.reduce(
  R.mergeDeepRight,
  // @ts-ignore
  {},
)(list)



const filterEdges = (nodes: {id: string}[]) => (edges: {source:string;target:string}[]) => {
  const nodeMap = R.groupBy(R.prop('id'))(nodes)
  return R.filter(
    (edge) => nodeMap[edge.source] && nodeMap[edge.target]
  )(edges)
}
export default (props: Props) => {
  const [isDefault, setIsDefault] = React.useState(true)
const changeTheme = () => {
  setIsDefault(!isDefault)
}

  return (
    <ApplicationProvider 
      theme={isDefault  ? DefaultTheme : DarkTheme}
    >
      <AppContainer  changeTheme={changeTheme} {...props}/>
    </ApplicationProvider>
  )
}