/* eslint-disable */
// @ts-nocheck
import React from 'react'
import * as R from 'colay/ramda'
import { 
  useTheme as useMuiTheme,
   ThemeProvider as MuiThemeProvider,
   createMuiTheme
} from '@material-ui/core'
import { Div, } from 'colay-ui'
import { 
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
  useTheme
} from '../../src/core/theme'
import { GraphRef } from '../../src/type'
import  { GraphEditorProps,GraphEditor } from '../../src/components/GraphEditor'
import { Graph } from '../../src/components'
import { UseEffect } from '../../src/components/UseEffect'
import {drawLine} from '../../src/components/Graphics'
import defaultData from './data'
import * as C from 'colay/color'
import { getFilterSchema, VIEW_CONFIG_SCHEMA  } from './constants'
import { EVENT } from '../../src/utils/constants'
import {useController} from '../../src/plugins/controller'
import {calculateStatistics} from './utils/networkStatistics'
import {RenderNode} from './RenderNode'
import {listCases} from './API'
// import { Data } from '../../components/Graph/Default'

const MUIDarkTheme = createMuiTheme({
  palette: {
    mode: 'dark',
  },
});
const MUILightTheme = createMuiTheme({
  palette: {
    mode: 'light',
  },
});
const filterEdges = (nodes: {id: string}[]) => (edges: {source:string;target:string}[]) => {
  const nodeMap = R.groupBy(R.prop('id'))(nodes)
  return R.filter(
    (edge) => nodeMap[edge.source] && nodeMap[edge.target]
  )(edges)
}
const CHUNK_COUNT = 3
const prepareData = (data) =>  {
  const {
    nodes,
    edges
  } = data
  const preNodes = R.splitEvery(Math.ceil(nodes.length/CHUNK_COUNT))(nodes)[0]
  const preEdges = filterEdges(preNodes)(edges)
  return {
    nodes: preNodes,
    edges: preEdges
  }
}
const data = prepareData(defaultData)
type Props = Partial<GraphEditorProps>

// console.log('statistics', calculateStatistics(data))
const NODE_SIZE = {
  width: 80,
  height: 80,
}

const NODE_SIZE_RANGE_MAP = {
  size: [60, 250],
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
  changeMUITheme,
  ...rest
}) => {
  const configRef = React.useRef({
    visualization: {
      nodeSize: null,
      nodeColor: null
    },
  })
  // const [state, setState]
  // const muiTheme = useMuiTheme()
  // console.log(muiTheme.palette)
  const FILTER_SCHEMA = React.useMemo(() => getFilterSchema({
    onPopupPress: () => console.log('popup')
  }), [])
  const THEMES = {
    Dark: DarkTheme,
    Default: DefaultTheme
  }
  const NODE_ID = 'http://deeplink.rechtspraak.nl/uitspraak?id=ECLI:NL:HR:2014:3519'
  const [controllerProps, controller] = useController({
    // ...data,

    graphConfig: {
      layout: Graph.Layouts.grid,
      zoom: 0.2,
      clusters: [
        {
          id:  'cluster-1',
          name:  'cluster-1',
          ids: [NODE_ID],
          childClusterIds: []
        }
      ]
    },
    settingsBar: {
      opened: false,
      forms: [FILTER_SCHEMA, VIEW_CONFIG_SCHEMA]
    },
    dataBar: {
      editable: false,
    },
    actionBar: {
      opened: false,
      actions: {
        add: { visible: false },
        delete: { visible: false },
      }
    },
    onEvent: ({
      type,
      extraData,
      element,
    },draft) => {
      switch (type) {
        case EVENT.SETTINGS_FORM_CHANGED:{
          console.log(type, extraData)
          draft.settingsBar.forms[extraData.index].formData = extraData.value
          if (extraData.form.schema.title === FILTER_SCHEMA.schema.title) {

          } else {
            configRef.current.visualization = extraData.value
          }
          return false
          break
        }
      
        case EVENT.CHANGE_THEME:{
          draft.graphConfig.theme = THEMES[extraData]
          changeMUITheme(extraData)
          return false
          break
        }
      
        default:
          break;
      }
      return null
    }
  },)
  React.useEffect(() => {
    const call = async () =>{
      const results = await listCases()
      console.log(results)
      const nodes = results.map(({id, ...data}) => ({
        id: `${data.doctype}:${id}`,
        data
      }))
      controller.update((draft) => {
        draft.nodes = nodes
        draft.edges = []
      })
    }
    call()
  }, [])
  // React.useEffect(() => {
  //   setTimeout(() => {
  //     controller.update((draft) => {
  //       draft.graphConfig.clusters[0].visible = false
  //     })
  //   }, 7000)
  // }, [])
  // React.useEffect(() => {
  //   setTimeout(() => {
  //     controller.update((draft) => {
  //       draft.graphConfig.clusters[0].visible = true
  //     })
  //   }, 9000)
  // }, [])
  const graphEditorRef = React.useRef(null)
  return (
      <Div style={{ display: 'flex', flexDirection: 'column',width: '100%', height: '100%'}}>
      <GraphEditor
        ref={graphEditorRef}
        {...controllerProps}
        extraData={[configRef.current.visualization]}
        style={{ width: '100%', height: 820, }}
        renderNode={(props) => (
          <RenderNode
            {...props}
            {...configRef.current}
          />
        )}
        // renderNode={({ item, element, cy, theme }) => {
        //   const size = calculateNodeSize(item.data, configRef.current.visualization.nodeSize)
        //   const color = configRef.current.visualization.nodeColor ? calculateColor(
        //     item.data,
        //     configRef.current.visualization.nodeColor
        //   ) : theme.palette.background.paper
        //   const hasSelectedEdge = element.connectedEdges(':selected').length > 0
        //   return (
        //           <Graph.Pressable
        //       style={{
        //         width: size,
        //         height: size,
        //         justifyContent: 'center',
        //         alignItems: 'center',
        //         display: 'flex',
        //         backgroundColor: hasSelectedEdge
        //         ? theme.palette.secondary.main
        //         : (element.selected()
        //           ? theme.palette.primary.main
        //           : color),
        //         // hasSelectedEdge
        //         //   ? theme.palette.secondary.main
        //         //   : (element.selected()
        //         //     ? theme.palette.primary.main
        //         //     : theme.palette.background.paper),
        //         borderRadius: size,
        //       }}
        //       onPress={() => {
        //         cy.$(':selected').unselect()
        //         element.select()
        //       }}
        //     >
        //       <Graph.Text
        //         style={{
        //           position: 'absolute',
        //           top: -size/1.5,
        //           left: 20,
        //         }}
        //         isSprite
        //       >
        //         {R.takeLast(6, item.id)}
        //       </Graph.Text>
        //     </Graph.Pressable>
        //   )
        // }}
        renderEdge={(props) => {
          const {
            cy,
            item,
            element,
            theme
          } = props
          return (
            <Graph.Pressable
              style={{
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
              }}
              onPress={() => {
                cy.$(':selected').unselect()
                element.select()
              }}
            >
              <Graph.Text
                style={{
                  // position: 'absolute',
                  // top: -40,
                  // backgroundColor: DefaultTheme.palette.background.paper,
                  fontSize: 12,
                }}
                isSprite
              >
                {R.takeLast(6, item.id)}
              </Graph.Text>
            </Graph.Pressable>
          )
        }}
        // renderNode={({ item: { id, data } }) => {
          // const size = calculateNodeSize(data, configRef.current.visualization.nodeSize)
          // const color = calculateColor(data, configRef.current.visualization.nodeColor)
        //   return (
        //     <Graph.HoverContainer
        //       style={{
        //         width: size,
        //         height: size,
        //         alignItems: 'center',
        //         justifyContent: 'center',
        //         borderRadius: 25,//(size/2 )+10,
        //         backgroundColor: color
        //         }}
        //         renderHoverElement={() => (
        //           <Graph.View
        //             style={{
        //               width: size,
        //               height: 20,
        //               position: 'absolute',
        //               left: 0,
        //               backgroundColor: color
        //             }}
        //           >
        //             <Graph.Text style={{
        //               fontSize: 20,
        //                textAlign: 'center',
        //               }}>
        //               {R.replace('ECLI:NL:', '')(data.ecli)}
        //             </Graph.Text>
        //           </Graph.View>
        //         )}
        //     >
        //       <Graph.Text style={{fontSize: 10}}>
        //         {R.replace('ECLI:NL:', '')(data.ecli)}
        //       </Graph.Text>
        //     </Graph.HoverContainer>
        //   )
        // }}
        {...rest}
      />
      </Div>
  )
}

export const mergeDeepAll = (list: Record<string, any>[]) => R.reduce(
  R.mergeDeepRight,
  // @ts-ignore
  {},
)(list)




const MUI_THEMES = {
  Dark: MUIDarkTheme,
  Light: MUILightTheme,
}
export default (props: Props) => {
  const [theme, setTheme] = React.useState(MUI_THEMES.Light)
  return (
    <MuiThemeProvider theme={theme}>
      <AppContainer
        changeMUITheme={(name)=> setTheme(MUI_THEMES[name])}
        {...props}
      />
    </MuiThemeProvider>
  )
}