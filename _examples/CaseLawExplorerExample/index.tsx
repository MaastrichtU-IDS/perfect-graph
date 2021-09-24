/* eslint-disable */
// @ts-nocheck
import React from 'react'
import * as R from 'colay/ramda'
import {
  useTheme as useMuiTheme,
  ThemeProvider as MuiThemeProvider,
  createTheme as createMuiTheme,
  Button,
  Typography,
  Backdrop,
  CircularProgress,
  Modal,
  Slide,
  Snackbar,
  Alert,
  AlertTitle,
} from '@material-ui/core'
import { View, useForwardRef, useMeasure } from 'colay-ui'
import { useImmer } from 'colay-ui/hooks/useImmer'
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
  useTheme
} from '../../src/core/theme'
import { GraphRef } from '../../src/type'
import { GraphEditorProps, GraphEditor } from '../../src/components/GraphEditor'
import { Graph } from '../../src/components'
import { UseEffect } from '../../src/components/UseEffect'
import { drawLine } from '../../src/components/Graphics'
import defaultData from './data'
import * as C from 'colay/color'
import { getFilterSchema, getFetchSchema, VIEW_CONFIG_SCHEMA, RECORDED_EVENTS } from './constants'
import { EVENT } from '../../src/constants'
import { useController } from '../../src/plugins/controller'
import { createSchema } from '../../src/plugins/createSchema'
import { getSelectedItemByElement, getSelectedElementInfo } from '../../src/utils'
import { calculateStatistics } from './utils/networkStatistics'
import { RenderNode } from './RenderNode'
import { RenderEdge } from './RenderEdge'
import * as API from './API'
import { QueryBuilder } from './QueryBuilder'
import { HelpModal } from './HelpModal'
import { TermsOfService } from './TermsOfService'
// import { Data } from '../../components/Graph/Default'
import { Auth } from 'aws-amplify'
import { useUser } from './useUser'
import GraphLayouts from '../../src/core/layouts'

export const ACTIONS = {
  TEST_API: 'TEST_API',
}

const HELP_VIDEO_ID = "OrzMIhLpVps"

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
const filterEdges = (nodes: { id: string }[]) => (edges: { source: string; target: string }[]) => {
  const nodeMap = R.groupBy(R.prop('id'))(nodes)
  return R.filter(
    (edge) => nodeMap[edge.source] && nodeMap[edge.target]
  )(edges)
}
const CHUNK_COUNT = 3
const prepareData = (data) => {
  const {
    nodes,
    edges
  } = data
  const preNodes = R.splitEvery(Math.ceil(nodes.length / CHUNK_COUNT))(nodes)[0]
  const preEdges = filterEdges(preNodes)(edges)
  return {
    nodes: preNodes,
    edges: preEdges
  }
}

const populate = (times, data) => ({
  nodes: R.concatAll(R.times(()=>R.clone(data.nodes), times)).map(
    (n, i) => i<data.nodes.length ? n : ({
    ...n,
    id: i, 
  })
  ),
  edges: R.concatAll(R.times(()=>R.clone(data.edges), times)).map(
    (n, i) => i<data.edges.length ? n : ({
    ...n,
    id: i,
  })
  )
})

const data = prepareData(defaultData)
// const data = populate(4,prepareData(defaultData))

console.log('NODES:', data.nodes.length, )
console.log('EDGES:', data.edges.length, )
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
  return ((fieldRangeValue / fieldRangeGap) * sizeRangeGap) + NODE_SIZE_RANGE_MAP.size[0]
}
const calculateColor = (data: object, fieldName?: keyof typeof NODE_SIZE_RANGE_MAP) => {
  if (!fieldName) {
    return perc2color(0)
  }
  const fieldRange = NODE_SIZE_RANGE_MAP[fieldName]
  const sizeRangeGap = NODE_SIZE_RANGE_MAP.size[1] - NODE_SIZE_RANGE_MAP.size[0]
  const fieldRangeGap = fieldRange[1] - fieldRange[0]
  const fieldRangeValue = (data[fieldName] ?? fieldRange[0]) - fieldRange[0]
  return perc2color((fieldRangeValue / fieldRangeGap) * 100)
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



const DataBarHeader = () => {
  const [user] = useUser()
  return (
    <View
      style={{ flexDirection: 'row', justifyContent: 'space-between' }}
    >
      <Typography>{user?.attributes?.email}</Typography>
      <Button
        color="secondary"
        onClick={() => Auth.signOut()}
      >
        Signout
      </Button>
    </View>
  )
}

const AppContainer = ({
  changeMUITheme,
  dispatch,
  width,
  height,
  ...rest
}) => {
  const [user] = useUser()
  const alertRef= React.useRef(null)
  const configRef = React.useRef({
    visualization: {
      nodeSize: null,
      nodeColor: null
    },
    fetching: {
      source: [
        "Rechtspraak"
      ],
      year: [
        1969,
        2015
      ],
      instances: [
        "Hoge Raad",
        "Raad van State",
        "Centrale Raad van Beroep",
        "College van Beroep voor het bedrijfsleven",
        "Gerechtshof Arnhem-Leeuwarden"
      ],
      domains: [
        "Not"
      ],
      doctypes: [
        "DEC",
        "OPI"
      ],
      degreesSources: 3,
      popup: false,
      liPermission: false,
      keywords: "test",
      degreesTargets: 3,
      eclis: "",
      articles: ""
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
    onPopupPress: async () => {
      updateState((draft) => {
        draft.queryBuilder.visible = true
      })
    }
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
      query: {
        DataSources: [
          "RS"
        ],
        Date: [
          1969,
          2015
        ],
        Instances: [
          "Hoge Raad", "Raad van State",
        ],
        Domains: [
          ""
        ],
        Doctypes: [
          "DEC",
          "OPI"
        ],
        DegreesSources: 1,
        Keywords: "",
        DegreesTargets: 1,
        Eclis: "ECLI:NL:GHSGR:1972:AB4988",
        Articles: ""
      },
    },
    helpModal: {
      isOpen: false,
    }
  })
  const ActionBarRight = React.useMemo(() => () => (
    <View
      style={{ flexDirection: 'row' }}
    >
      <Button
        onClick={() => updateState((draft) => {
          draft.helpModal.isOpen = true
        })}
      >
        Help
      </Button>
      <Button
        onClick={() => dispatch({
          type: ACTIONS.TEST_API
        })}
      >
        Test the API
      </Button>
    </View>
  ), [dispatch])
  const [controllerProps, controller] = useController({
    ...data,
    // nodes: [],
    // edges: [],
    // events: RECORDED_EVENTS,
    graphConfig: {
      // layout: Graph.Layouts.cose,
      zoom: 0.2,
      nodes: {},
      clusters: [
        {
          id: '123',
          name: 'SimpleCluster',
          ids: [
             'http://deeplink.rechtspraak.nl/uitspraak?id=ECLI:NL:XX:2010:BL0510'
            // 'http://deeplink.rechtspraak.nl/uitspraak?id=ECLI:NL:HR:2015:3019',
            // 'http://deeplink.rechtspraak.nl/uitspraak?id=ECLI:NL:HR:2015:644',
            // 'http://deeplink.rechtspraak.nl/uitspraak?id=ECLI:NL:HR:2014:3519'
          ],
          childClusterIds: []
        },
        // {
        //   id: '1234',
        //   name: 'SimpleCluster2',
        //   ids: [
        //     'http://deeplink.rechtspraak.nl/uitspraak?id=ECLI:NL:HR:2015:3019',
        //     'http://deeplink.rechtspraak.nl/uitspraak?id=ECLI:NL:HR:2015:644',
        //     'http://deeplink.rechtspraak.nl/uitspraak?id=ECLI:NL:HR:2014:3519'
        //   ],
        //   childClusterIds: []
        // }
      ]
    },
    // modals: {
    //   ElementSettings: {
    //     form: {
    //       schema: FILTER_SCHEMA.schema,
    //     },
    //     isOpen: false
    //   }
    // },
    preferencesModal: {
      // isOpen: true,
    },
    settingsBar: {
      opened: true,
      // forms: [AUTO_CREATED_SCHEMA,FETCH_SCHEMA, VIEW_CONFIG_SCHEMA, {...FILTER_SCHEMA,  formData: configRef.current.filtering}, ],
      forms: [{ ...FETCH_SCHEMA, formData: configRef.current.fetching }, VIEW_CONFIG_SCHEMA, { ...FILTER_SCHEMA, formData: configRef.current.filtering },],
      createClusterForm: {
        ...FILTER_SCHEMA,
        schema: { ...FILTER_SCHEMA.schema, title: 'Create Cluster', },
        formData: configRef.current.filtering
      },
    },
    dataBar: {
      // isOpen: true,
      editable: true,
      header: DataBarHeader,
    },
    actionBar: {
      // isOpen: true,
      right: ActionBarRight,
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
    onEvent: async ({
      type,
      payload,
      elementId,
      graphRef,
      graphEditor,
      update,
      state,
    }, draft) => {
      const {
        cy,
      } = graphEditor
      const element = cy.$id(elementId)
      // const {
      //   item: eventRelatedItem,
      // } = (element && getSelectedItemByElement(element, draft)) ?? {}
      switch (type) {
        case EVENT.ELEMENT_SELECTED: {
          // draft.isLoading = true
          const {
            itemIds,
          } = payload
          draft.selectedElementIds = itemIds
          const {
            selectedItem
          } = getSelectedElementInfo(draft, graphEditor)
          let elementData = null
          try {
            elementData = await API.getElementData({ id: selectedItem.data.ecli });
          } catch (error) {
            alertRef.current.alert({
              text: JSON.stringify(error),
              type: 'error'
            })
            console.error(error)
          }
          if (elementData && !R.isEmpty(elementData)) {
            selectedItem.data = elementData
          } else {
            // alertRef.current.alert({
            //   type: 'warning',
            //   text: 'Data is not available!'
            // })
          }
          break
        }
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
          } = formData
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
        case EVENT.SETTINGS_FORM_CHANGED: {
          draft.settingsBar.forms[payload.index].formData = payload.value
          if (payload.form.schema.title === FILTER_SCHEMA.schema.title) {
            configRef.current = {
              ...configRef.current,
              filtering: payload.value
            }
            draft.graphConfig.nodes.filter = {
              test: ({ element, item }) => {
                const {
                  year,
                  degree,
                  indegree,
                  outdegree
                } = payload.value
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
        // case EVENT.LAYOUT_CHANGED: {
        //   const {
        //     value
        //   } = payload
        //   let layout: any
        //     if (value.name) {
        //       layout = R.pickBy((val) => R.isNotNil(val))({
        //         // @ts-ignore
        //         ...GraphLayouts[value.name],
        //         ...value,
        //       })
        //     }
        //     const { hitArea } = graphEditorRef.current.viewport
        //     console.log(graphEditorRef.current.viewport)
        //   const boundingBox = {
        //     x1: hitArea.x + 300,
        //     y1: hitArea.y + 300,
        //     w: hitArea.width,
        //     h: hitArea.height,
        //   }
        //     draft.graphConfig!.layout = {
        //       ...layout,
        //       boundingBox
        //     }
          
        //   return false
        //   break
        // }
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
  })
  // React.useEffect(() => {
  //    if (user){
  //     Auth.updateUserAttributes(user, {
  //       'custom:isOldUser': 'no'
  //     })
  //    }
  // }, [user])
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
  //       draft.graphConfig.clusters[0].visible = true
  //     })
  //   }, 9000)
  // }, [])
  React.useEffect(() => {
    // setTimeout(() => {
    //   controller.update((draft, { graphEditorRef }) => {
    //     try {
    //       const { hitArea } = graphEditorRef.current.viewport
    //       const margin = 500
    //       const boundingBox = {
    //         x1: hitArea.x + margin,
    //         y1: hitArea.y + margin,
    //         w: hitArea.width - 2*margin,
    //         h: hitArea.height - 2*margin,
    //       }
    //       const layout = Graph.Layouts.cose
    //       draft.graphConfig!.layout = {
    //         ...layout,
    //         animationDuration: 0,
    //         boundingBox,
    //       } 
    //     } catch (error) {
    //       console.log('error',error)
    //     }
    //   })
    // }, 1000)
}, [])

  return (
    <View
      style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}
    >
      <GraphEditor
        {...controllerProps}
        // {...R.omit(['eventHistory', ])(controllerProps)}
        payload={[configRef.current]}
        style={{ width, height }}
        renderNode={(props) => (
          <RenderNode
            {...props}
            {...configRef.current}
          />
        )}
        renderEdge={RenderEdge}
        {...rest}
      />
      <QueryBuilder
        isOpen={state.queryBuilder.visible}
        query={state.queryBuilder.query}
        onClose={() => updateState((draft) => {
          draft.queryBuilder.visible = false
        })}
        onStart={() => {
          controller.update((draft) => {
            draft.isLoading = true
          })
          updateState((draft) => {
            draft.queryBuilder.visible = false
          })
        }}
        onError={(error) => {
          controller.update((draft) => {
            draft.isLoading = false
          })
          updateState((draft) => {
            draft.queryBuilder.visible = true
          })
          alertRef.current.alert({
            type: 'warning',
            text: error.message
          })
        }}
        onFinish={({
          nodes = [],
          edges= [],
          networkStatistics,
          message
        } = {}) => {
          controller.update((draft) => {
            draft.nodes = nodes
            draft.edges = edges
            draft.networkStatistics = {
              local: networkStatistics
            }
            draft.isLoading = false
            draft.graphConfig!.layout = Graph.Layouts.circle
          })
          if (message) {
            alertRef.current.alert({
              type: 'warning',
              text: message
            })
          }
        }}
      />
      <HelpModal 
        isOpen={state.helpModal.isOpen}
        onClose={() => updateState((draft) => {
          draft.helpModal.isOpen = false
        })}
        videoId={HELP_VIDEO_ID}
      />
      {/* <TermsOfService
          user={user}
          onAgree={async () => {
            updateState((draft) => {
              draft.helpModal.isOpen = true
            })
            await Auth.updateUserAttributes(user, {
              'custom:isOldUser': 'yes'
            })
          }}
          // onDisagree={() => {
          //   alert('To proceed on signin, you need to accept the Terms of Usage!')
          // }}
        /> */}
        <AlertContent 
          ref={alertRef}
        />
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={controllerProps.isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </View>
  )
}

const AlertContent = React.forwardRef((props,forwardedRef) => {
    const [open, setOpen] = React.useState(false);
    const [messageInfo, setMessageInfo] = React.useState(undefined);
    const ref = useForwardRef(
      forwardedRef,
      {},
      ()=> ({
        alert: (message) => {
          setMessageInfo({
            key: R.uuid(),
            ...message,
          })
          setOpen(true)
        }
      })
    )
    const handleClose = (event, reason) => {
      // if (reason === 'clickaway') {
      //   return;
      // }
      setOpen(false);
    }
    const TransitionUp = React.useCallback((props) =>(
      <Slide 
        {...props}
        direction="down"
          handleExited={() => {
          setMessageInfo(undefined);
        }}
      />
    ), [])
    return (
      <Snackbar
        key={messageInfo?.key}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={open}
        autoHideDuration={4000}
        TransitionComponent={TransitionUp}
        onClose={handleClose}
      >
        <Alert 
          onClose={handleClose}
          severity={messageInfo?.type ?? 'error'}
        >
          <AlertTitle>{messageInfo ? R.upperFirst(messageInfo.type): ''}</AlertTitle>
          {
            messageInfo?.text
          }
        </Alert>
      </Snackbar>
    )
})

const MUI_THEMES = {
  Dark: MUIDarkTheme,
  Light: MUILightTheme,
}

export default (props: Props) => {
  const [theme, setTheme] = React.useState(MUI_THEMES.Light)
  return (
    <MuiThemeProvider theme={theme}>
      <AppContainer
        changeMUITheme={(name) => setTheme(MUI_THEMES[name])}
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