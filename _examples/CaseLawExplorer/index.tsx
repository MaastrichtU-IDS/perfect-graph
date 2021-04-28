/* eslint-disable */
// @ts-nocheck
import React from 'react'
import * as R from 'colay/ramda'
import { 
  useTheme as useMuiTheme,
   ThemeProvider as MuiThemeProvider,
   createMuiTheme
} from '@material-ui/core'
import { View, } from 'colay-ui'
import { useImmer } from 'colay-ui/hooks/useImmer'
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
import { getFilterSchema, getFetchSchema, VIEW_CONFIG_SCHEMA, RECORDED_EVENTS  } from './constants'
import { EVENT } from '../../src/utils/constants'
import {useController} from '../../src/plugins/controller'
import { createSchema } from '../../src/plugins/createSchema'
import {calculateStatistics} from './utils/networkStatistics'
import {RenderNode} from './RenderNode'
import {RenderEdge} from './RenderEdge'
// import * as API from './API'
import {QueryBuilder} from './QueryBuilder'
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

const AUTO_CREATED_SCHEMA = {
  schema: createSchema(data.nodes)
}
console.log('a', AUTO_CREATED_SCHEMA.schema)
const AppContainer = ({
  changeMUITheme,
  ...rest
}) => {
  const configRef = React.useRef({
    visualization: {
      nodeSize: null,
      nodeColor: null
    },
    filtering: {
      year: [1960, 2021],
      degree: [0, 100],
      indegree: [0, 100],
      outdegree: [0, 100]
    }
  })
  
  const FILTER_SCHEMA = React.useMemo(() => getFilterSchema(), [])
  const FETCH_SCHEMA = React.useMemo(() => getFetchSchema({
    onPopupPress: () => updateState((draft) => {
      draft.queryBuilder.visible = true
    })
  }), [])
  const THEMES = {
    Dark: DarkTheme,
    Default: DefaultTheme
  }
  const NODE_ID = 'http://deeplink.rechtspraak.nl/uitspraak?id=ECLI:NL:HR:2014:3519'
  const filteredDataRef = React.useRef({})
  const [state, updateState] = useImmer({
    queryBuilder: {
      visible: false,
      query: {},
    }
  })
  const [controllerProps, controller] = useController({
    ...data,
    // events: RECORDED_EVENTS,
    graphConfig: {
      layout: Graph.Layouts.cose,
      zoom: 0.2,
      nodes: {},
      clusters: [
        {
          id: '123',
          name: 'SimpleCluster',
          ids: [
            'http://deeplink.rechtspraak.nl/uitspraak?id=ECLI:NL:HR:2015:3019',
            'http://deeplink.rechtspraak.nl/uitspraak?id=ECLI:NL:HR:2015:644',
            'http://deeplink.rechtspraak.nl/uitspraak?id=ECLI:NL:HR:2014:3519'
          ],
          childClusterIds: []
        },
        {
          id: '1234',
          name: 'SimpleCluster2',
          ids: [
            'http://deeplink.rechtspraak.nl/uitspraak?id=ECLI:NL:HR:2015:3019',
            'http://deeplink.rechtspraak.nl/uitspraak?id=ECLI:NL:HR:2015:644',
            'http://deeplink.rechtspraak.nl/uitspraak?id=ECLI:NL:HR:2014:3519'
          ],
          childClusterIds: []
        }
      ]
    },
    settingsBar: {
      opened: true,
      // forms: [AUTO_CREATED_SCHEMA,FETCH_SCHEMA, VIEW_CONFIG_SCHEMA, {...FILTER_SCHEMA,  formData: configRef.current.filtering}, ],
      forms: [FETCH_SCHEMA, VIEW_CONFIG_SCHEMA, {...FILTER_SCHEMA,  formData: configRef.current.filtering}, ],
      createClusterForm: {
        ...FILTER_SCHEMA,
        schema: {...FILTER_SCHEMA.schema, title: 'Create Cluster', },
        formData: configRef.current.filtering
      },
    },
    dataBar: {
      // opened: true,
      editable: false,
    },
    actionBar: {
      // opened: true,
      // autoOpen: true,
      eventRecording: false,
      actions: {
        // add: { visible: false },
        // delete: { visible: false },
      },
      theming: {
        options: [
          {
            name: 'Dark',
            value: 'Dark',
          },
          {
            name: 'Default',
            value: 'Default',
          }
        ],
        value: 'Default'
      },
    },
    onEvent: ({
      type,
      payload,
      elementId,
      graphRef,
      graphEditor
    },draft) => {
      const {
        cy,
      } = graphEditor
      switch (type) {
        case EVENT.CREATE_CLUSTER_FORM_SUBMIT: {
          const {
            name,
            formData,
          } = payload
          const {
            year,
            degree,
            indegree,
            outdegree
           }= formData
          const clusterItemIds = draft.nodes.filter((item) => {
            const element = cy.$id(item.id)
            return (
              R.inBetween(year[0], year[1])(item.data.year)
                && R.inBetween(degree[0], degree[1])(element.degree())
                && R.inBetween(indegree[0], indegree[1])(element.indegree())
                && R.inBetween(outdegree[0], outdegree[1])(element.outdegree())
                
              )
          }).map((item) => item.id)
          draft.graphConfig.clusters.push({
            id: R.uuid(),
            name,
            ids: clusterItemIds,
            childClusterIds: []
          })
          return false
        }
        case EVENT.SETTINGS_FORM_CHANGED:{
          draft.settingsBar.forms[payload.index].formData = payload.value
          if (payload.form.schema.title === FILTER_SCHEMA.schema.title) {
            configRef.current = {
              ...configRef.current,
              filtering: payload.value
            }
            draft.graphConfig.nodes.filter =  {
              test: ({ element,item }) => {
                const {
                  year,
                  degree,
                  indegree,
                  outdegree
                 }= payload.value
                  return (
                    R.inBetween(year[0], year[1])(item.data.year)
                      && R.inBetween(degree[0], degree[1])(element.degree())
                      && R.inBetween(indegree[0], indegree[1])(element.indegree())
                      && R.inBetween(outdegree[0], outdegree[1])(element.outdegree())
                      
                    )
                },
                settings: {
                  opacity: 0.2
                }
            }

          } else {
            configRef.current = {
              ...configRef.current,
              visualization: payload.value
            }
          }
          return false
          break
        }
      
        case EVENT.CHANGE_THEME: {
          const {
            value
          } = payload
          draft.graphConfig.theme = THEMES[value]
          changeMUITheme(value)
          draft.actionBar.theming.value = value
          return false
          break
        }
        // case EVENT.ELEMENT_SELECTED: {
        //   if (element.isNode()) {
        //     // const TARGET_SIZE = 700
        //     // const {
        //     //   viewport
        //     // } = graphRef.current
        //     // const currentBoundingBox = {
        //     //   x1: viewport.hitArea.x,
        //     //   y1: viewport.hitArea.y,
        //     //   w: viewport.hitArea.width,
        //     //   h: viewport.hitArea.height,
        //     // }
        //     // const zoom = (currentBoundingBox.w / TARGET_SIZE ) * graphRef.current.viewport.scale.x
        //     // const position = element.position()
        //     // graphRef.current.viewport.snapZoom({
        //     //   center: position, 
        //     //   width: TARGET_SIZE,
        //     //   height: TARGET_SIZE,
        //     //   time: Graph.Layouts.grid.animationDuration
        //     // })
        //     // element.connectedEdges().connectedNodes().layout({
        //     //   ...Graph.Layouts.random,
        //     //   boundingBox: {
        //     //     ...currentBoundingBox,
        //     //     h: TARGET_SIZE,
        //     //     w: TARGET_SIZE,
        //     //     // x1: element.position().x,
        //     //     // y1: element.position().y,
        //     //   }
        //     // }).start()
        //   }
        //   // return false
        //   break
        // }
      
        default:
          break;
      }
      return null
    }
  },)
  // React.useEffect(() => {
  //   const call = async () =>{
  //     const results = await listCases()
  //     const nodes = results.map(({id, ...data}) => ({
  //       id: `${data.doctype}:${id}`,
  //       data
  //     }))
  //     controller.update((draft) => {
  //       draft.nodes = nodes
  //       draft.edges = []
  //     })
  //   }
  //   call()
  // }, [])
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
      <View style={{ display: 'flex', flexDirection: 'column',width: '100%', height: '100%'}}>
      <GraphEditor
        ref={graphEditorRef}
        {...controllerProps}
        // {...R.omit(['eventHistory', ])(controllerProps)}
        payload={[configRef.current]}
        style={{ width: '100%', height: 800, }}
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
        renderEdge={RenderEdge}
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
      <QueryBuilder 
        isOpen={state.queryBuilder.visible}
        query={state.queryBuilder.query}
        onClose={() => updateState((draft) => {
          draft.queryBuilder.visible = false
        })}
        onCreate={(query) => updateState((draft) => {
          draft.queryBuilder.visible = false
          draft.queryBuilder.query = query
          alert(JSON.stringify(query))
          // const data = API.complexQuery(query)
          // QueryCallback(query)
        })}
      />
      </View>
  )
}


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

// type Node = {
//   id: string;
//   data: {
//     year: string;
//     ...
//   },
// }

// type Edge = {
//   id: string;
//   source: string;
//   target: string;
//   data: {
//     year: string;
//     ...
//   },
// }