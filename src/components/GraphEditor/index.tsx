import {
  DefaultRenderEdge,
  DefaultRenderNode, Graph,
} from '@components'
import { DEFAULT_EDGE_CONFIG, DEFAULT_NODE_CONFIG } from '@constants'
import { ContextMenu } from '@components/ContextMenu'
import { EDITOR_MODE, EVENT } from '@constants'
import { Clusters } from '@core/clusters'
import { GraphEditorProvider } from '@hooks/useGraphEditor'
import {
  Backdrop, Box, CircularProgress,
  IconButton,
} from '@mui/material'
import {
  EditorMode, EventHistory, EventInfo, EventType,
  GraphConfig, GraphEditorConfig, GraphEditorRef, GraphEditorRenderEdge,
  GraphEditorRenderNode, GraphLabelData, NetworkStatistics,
  NodeElement, OnEvent, OnEventLite, Playlist, RecordedEvent,
  NodeData, EdgeData, GraphEditorContextType, Element,
  RenderClusterNode,
  DrawLine,
  OnBoxSelection,
  PreviousData,
  PropsWithRef,
} from '@type'
import {
  getEventClientPosition, getLabel, getSelectedItemByElement,
  throttle,
} from '@utils'
import { useTimeoutManager } from '@utils/useTimeoutManager'
import { useForwardRef, wrapComponent, ViewProps } from 'colay-ui'
import * as ReactIs from 'colay-ui/utils/is-react'
import { useImmer } from 'colay-ui/hooks/useImmer'
import * as R from 'colay/ramda'
import React from 'react'
import { ActionBar, ActionBarConfig } from './ActionBar'
import { DataBar, DataBarProps } from './DataBar'
import { SettingsBar, SettingsBarProps } from './SettingsBar'
import { ModalComponent, ModalComponentProps } from './ModalComponent'
import { MouseIcon } from './MouseIcon'
import { PreferencesModal, PreferencesModalProps } from './PreferencesModal/index'
import { RecordedEventsModal } from './RecordedEventsModal'
import { Icon } from  '@components/Icon'

type RenderElementAdditionalInfo = {
  // label: string;
}

export type GraphEditorProps = {
  /**
   * Event handler for all events that are emitted by the graph editor.
   */
  onEvent?: OnEvent;
  /**
   * All graph config data for nodes and edges. It will supply the config data for the graph.
   */
  graphConfig?: GraphConfig;
  /**
   * GraphEditor config data for all operations.
   */
  config?: GraphEditorConfig;
  /**
   * Render React component into ActionBar.
   */
  renderMoreAction?: () => React.ReactElement;
  /**
   * Config for labels of nodes and edges
   */
  label?: GraphLabelData;
  /**
   * Config for SettingsBar
   */
  settingsBar?: SettingsBarProps;
  /**
   * Config for DataBar
   */
  dataBar?: DataBarProps;
  /**
   * Config for ActionBar
   */
  actionBar?: ActionBarConfig;
  /**
   * Config for PreferencesModal
   */
  preferencesModal?: PreferencesModalProps;
  /**
   * It gives the selected nodes. It is used for selected node highlighting and DataBar
   */
  selectedElementIds?: string[];
  /**
   * Editor mode for changing actions and mouse icon
   */
  mode?: EditorMode;
  /**
   * It returns a PIXI.DisplayObject instance as React.Node for the edge
   */
  renderEdge?: GraphEditorRenderEdge<RenderElementAdditionalInfo>;
  /**
   * It returns a PIXI.DisplayObject instance as React.Node for the node
   */
  renderNode?: GraphEditorRenderNode<RenderElementAdditionalInfo>;
  /**
   * Recorded events will be displayed on SettingsBar
   */
  events?: RecordedEvent[]
  /**
   * Event history will be displayed on SettingsBar
   */
  eventHistory?: EventHistory;
  /**
   * Events playlist will be displayed on SettingsBar
   */
  playlists?: Playlist[];
  /**
   * Calculated network statistics will be displayed on SettingsBar
   */
  networkStatistics?: NetworkStatistics;
  /**
   * Display loading indicator
   */
  isLoading?: boolean;
  /**
   * Modal components for displaying modal dialogs
   */
  modals?: {
    ElementSettings?: ModalComponentProps
  };
  /**
   * Focus mode for chunk stacked nodes
   */
  isFocusMode?: boolean;
  /**
   * Focus mode stack
   */
  previousDataList?: PreviousData[]
  children?: React.ReactNode;
  /**
   * To rerender the graph when the extra data changes
   */
  extraData?: any;
  /**
   * Node data list to render
   */
  nodes: NodeData[];
  /**
   * Edge data list to render
   */
  edges: EdgeData[];
  /**
   * Style for graph container view
   */
  style?: ViewProps['style'];
  /**
   * It returns a PIXI.DisplayObject instance as React.Node for the cluster node
   */
  renderClusterNode?: RenderClusterNode;
  /**
   * The function to draw line for edge connection vectors
   */
  drawLine?: DrawLine;
  /**
   * Event handler for box selection event. It gives the selected nodes
   */
  onBoxSelection?: OnBoxSelection;
}

const MODE_ICON_SCALE = 0.8
const MODE_ICON_MAP_BY_URL = {
  [EDITOR_MODE.ADD]: `https://img.icons8.com/material/${MODE_ICON_SCALE}x/plus-math.png`,
  [EDITOR_MODE.DELETE]: `https://img.icons8.com/material/${MODE_ICON_SCALE}x/minus--v2.png`,
  [EDITOR_MODE.CONTINUES_ADD]: `https://img.icons8.com/material/${MODE_ICON_SCALE}x/plus.png`,
  [EDITOR_MODE.CONTINUES_DELETE]: `https://img.icons8.com/material/${MODE_ICON_SCALE}x/minus-sign.png`,
  [EDITOR_MODE.ADD_CLUSTER_ELEMENT]: `https://img.icons8.com/material/${MODE_ICON_SCALE}x/doctors-folder.png`,
  [EDITOR_MODE.DEFAULT]: null,
}

const DEFAULT_HANDLER = R.identity as (info: EventInfo) => void

export type GraphEditorType = React.FC<GraphEditorProps>

const DEFAULT_GRAPH_EDITOR_CONFIG: GraphEditorConfig = {
  enableNetworkStatistics: true,
}
const GraphEditorElement = (
  props: GraphEditorProps,
  ref: React.MutableRefObject<GraphEditorRef>,
) => {
  const {
    onEvent: onEventCallback = DEFAULT_HANDLER,
    renderEdge,
    renderNode,
    graphConfig: _graphConfig,
    style,
    settingsBar,
    actionBar,
    dataBar = {},
    preferencesModal = {},
    nodes,
    edges,
    selectedElementIds = [],
    label,
    mode = EDITOR_MODE.DEFAULT,
    events,
    eventHistory,
    config = DEFAULT_GRAPH_EDITOR_CONFIG,
    playlists,
    networkStatistics,
    isLoading = false,
    modals = {},
    isFocusMode = false,
    ...rest
  } = props

  const graphConfig = React.useMemo(() =>{ 
    return {
      ...(_graphConfig ?? {}),
      nodes: R.mergeAll([DEFAULT_NODE_CONFIG, _graphConfig?.nodes ?? {} ]),
      edges: R.mergeAll([DEFAULT_EDGE_CONFIG, _graphConfig?.edges ?? {} ]),
    } as GraphConfig
  }, [_graphConfig])
  const localDataRef = React.useRef({
    initialized: false,
    targetNode: null as NodeElement | null,
    props,
    issuedClusterId: null as string | null,
    newClusterBoxSelection: {
      elementIds: [] as string[],
    },
    networkStatistics: {
      local: null,
    },
    contextMenu: {
      itemIds: [] as string[],
    },
  })
  const [state, updateState] = useImmer({
    eventsModal: {
      visible: false,
    },
    contextMenu: {
      visible: false,
      position: {
        x: 0,
        y: 0,
      },
    },
    isLoading: false,
  })
  localDataRef.current.props = props
  React.useEffect(() => {
    localDataRef.current.initialized = true
    // setTimeout(() => updateState((draft) => {
    //   draft.isLoading = false
    // }), 2200)
  }, [])
  const graphId = React.useMemo<string>(
    () => graphConfig?.graphId ?? R.uuid(),
    [graphConfig?.graphId],
  )
  const graphEditorRef = useForwardRef(ref)
  // @TODO: DANGER
  React.useEffect(() => {
    setTimeout(() => {
      ref.current = graphEditorRef.current
    }, 1000)
  }, [graphEditorRef.current])
  // @TODO: DANGER
  const selectedElement = React.useMemo(
    () => {
      const collection = graphEditorRef.current?.cy?.$id(R.last(selectedElementIds)!)
      return collection?.length === 0
        ? null
        : collection as Element
    },
    [nodes, edges, selectedElementIds],
  )
  const selectedItem = selectedElement && getSelectedItemByElement(
    selectedElement, { nodes, edges },
  ).item
  // const selectedElementIsNode = selectedElement && selectedElement.isNode()
  // const targetPath = selectedElementIsNode ? 'nodes' : 'edges'
  const onEvent: OnEventLite = React.useCallback((eventInfo) => {
    const {
      props: {
        nodes,
        edges,
      },
    } = localDataRef.current
    switch (eventInfo.type) {
      case EVENT.PRESS_ADD_CLUSTER_ELEMENT:
        localDataRef.current.issuedClusterId = eventInfo.payload.clusterId
        break
      case EVENT.CREATE_CLUSTER_BY_ALGORITHM_FORM_SUBMIT: {
        const {
          config = {},
          name,
        } = eventInfo.payload
        const clusterCollections: cytoscape.Collection[] = Clusters[name as keyof typeof Clusters]
          .getByItem({
            cy: graphEditorRef.current?.cy,
            nodes,
            edges,
            ...config,
          })
        let clusterLength = (graphConfig?.clusters?.length ?? 0) - 1
        const clusters = clusterCollections.map((collection) => {
          const elementIds = collection.map((el) => el.id())
          clusterLength += 1
          return {
            id: R.uuid(),
            name: `Cluster-${clusterLength}`,
            ids: elementIds,
            childClusterIds: [],
          }
        }).filter((val) => !!val)
        if (clusters.length === 0) {
          alert('There is no clusters with this configuration!')
        } else {
          onEventCallback({
            id: R.uuid(),
            date: new Date().toString(),
            type: EVENT.CREATE_CLUSTER,
            payload: {
              items: clusters,
            },
          })
        }

        return
      }

      default:
        break
    }
    onEventCallback({
      ...(selectedElement ? { elementId: selectedElement.id() } : {}),
      ...eventInfo,
      id: R.uuid(),
      date: new Date().toString(),
      ...(
        eventInfo.event
          ? {
            event: R.pickPaths([
              ['data', 'originalEvent', 'metaKey'],
            ])(eventInfo.event),
          }
          : {}
      ),
    })
  }, [onEventCallback, selectedItem?.id])
  const eventTimeoutsManager = useTimeoutManager(
    (events ?? []).map((event, index) => {
      return {
        ...event,
        after: events?.[index - 1]
          ? new Date(
            event.date,
          ).getTime() - new Date(events[index - 1].date).getTime()
          : 0,
      }
    }),
    (event) => {
      onEventCallback(event)
    },
    {
      deps: [events],
      renderOnFinished: true,
      renderOnPlayChanged: true,
      autostart: false,
    },
  )
  React.useMemo(() => {
    localDataRef.current.networkStatistics.local = networkStatistics?.local
  }, [networkStatistics?.local])
  // React.useEffect(() => {
  //   if (!config.enableNetworkStatistics) {
  //     localDataRef.current.networkStatistics.local = networkStatistics?.local
  //   } else {
  //     localDataRef.current.networkStatistics.local = R.mergeDeepRight(
  //       calculateStatistics({ nodes, edges }),
  //       (networkStatistics?.local ?? {}),
  //     )
  //   }
  // }, [])
  // React.useMemo(() => {
  //   if (localDataRef.current.initialized) {
  //     localDataRef.current.networkStatistics.local = R.mergeDeepRight(
  //       calculateStatistics({ nodes, edges }),
  //       (networkStatistics?.local ?? {}),
  //     )
  //   }
  // }, [nodes, edges, networkStatistics?.local, config.enableNetworkStatistics])
  React.useEffect(() => {
    localDataRef.current.targetNode = null
  }, [mode])
  const graphEditorValue: GraphEditorContextType = React.useMemo(() => ({
    config,
    eventHistory,
    events,
    graphConfig,
    label,
    mode,
    onEvent,
    playlists,
    selectedElementIds,
    localDataRef,
    selectedItem,
    selectedElement,
    networkStatistics,
    graphEditorRef,
    nodes,
    edges,
  }),
  [
    config,
    eventHistory,
    events,
    graphConfig,
    label,
    mode,
    onEvent,
    playlists,
    selectedElementIds,
    selectedItem,
    selectedElement,
    networkStatistics,
    graphEditorRef,
    nodes,
    edges,
  ])
  if (graphEditorRef.current) {
    graphEditorRef.current.context = graphEditorValue
  }
  return (
    <GraphEditorProvider
      value={graphEditorValue}
    >
      <Box
      // @ts-ignore
        style={{
          ...style,
          overflow: 'hidden',
          position: 'relative',
        }}
        onMouseMove={(e: React.MouseEvent<HTMLDivElement>) => {
          throttle(
            () => {
              const {
                pageY,
              } = e.nativeEvent
              const {
                offsetHeight,
                offsetTop,
              } = e.currentTarget
              if (props.actionBar && props.actionBar.autoOpen) {
                if (pageY + 25 >= offsetTop + offsetHeight
                && !props.actionBar?.isOpen) {
                  return onEvent({
                    type: EVENT.TOGGLE_ACTION_BAR,
                    avoidHistoryRecording: true,
                  })
                }
                if (pageY + 50 <= offsetTop + offsetHeight && props.actionBar?.isOpen) {
                  return onEvent({
                    type: EVENT.TOGGLE_ACTION_BAR,
                    avoidHistoryRecording: true,
                  })
                }
              }
            },
            1000,
            'GraphEditorOnMouseMove',
          )
        }}
      >
        <Graph
        // @ts-ignore
          ref={graphEditorRef}
          style={{
            width: style?.width,
            height: style?.height,
          }}
          nodes={nodes}
          edges={edges}
          {...rest}
          extraData={{
            label,
            extraData: rest.extraData,
          }}
          // @ts-ignore
          config={{
            ...graphConfig,
            graphId,
          }}
          selectedElementIds={selectedElementIds}
          onPress={({ position }) => {
            if (state.contextMenu.visible) {
              updateState((draft) => {
                draft.contextMenu.visible = false
              })
            }
            const { mode } = localDataRef.current.props
            if (
            // @ts-ignore
              [EDITOR_MODE.ADD, EDITOR_MODE.CONTINUES_ADD].includes(mode)
            ) {
              onEvent({
                type: EVENT.ADD_NODE,
                payload: {
                  items: [{
                    id: R.uuid(),
                    position,
                    data: {},
                  }],
                },
              })
              return
            }
            onEvent({
              type: EVENT.PRESS_BACKGROUND,
              payload: { position },
              avoidHistoryRecording: true,
            })
          }}
          onBoxSelection={(event) => {
            const { mode } = localDataRef.current.props
            const {
              itemIds,
            } = event
            if (EDITOR_MODE.ADD_CLUSTER_ELEMENT === mode) {
              onEvent({
                type: EVENT.ADD_CLUSTER_ELEMENT,
                payload: {
                  clusterId: localDataRef.current.issuedClusterId,
                  itemIds,
                },
              })
              return
            }
            // TODO: DANGER**
            localDataRef.current.newClusterBoxSelection.elementIds = itemIds
            if (itemIds.length > 0) {
              localDataRef.current.contextMenu.itemIds = itemIds
              updateState(
                (draft) => {
                  const e = event.event.data.originalEvent
                  draft.contextMenu.visible = true
                  draft.contextMenu.position = getEventClientPosition(e)
                },
                () => {
                  onEvent({
                    type: EVENT.BOX_SELECTION,
                    payload: {
                      itemIds,
                    },
                  })
                },
              )
              
            }
          }}
          renderNode={({ item, element, ...rest }) => {
            return (
              <Graph.View
                interactive
                rightclick={(event) => {
                  localDataRef.current.contextMenu.itemIds = [element.id()]
                  updateState((draft) => {
                    draft.contextMenu.visible = true
                    draft.contextMenu.position = getEventClientPosition(event.data.originalEvent)
                  })
                  event.stopPropagation()
                }}
                pointertap={(event) => {
                  const { mode } = localDataRef.current.props
                  const elementId = element.id()
                  if (
                    [
                      EDITOR_MODE.DELETE,
                      // @ts-ignore
                      EDITOR_MODE.CONTINUES_DELETE].includes(mode)
                  ) {
                    onEvent({
                      type: EVENT.DELETE_NODE,
                      payload: {
                        itemIds: [item.id],
                      },
                      event,
                    })
                    return
                  }
                  if (
                    // @ts-ignore
                    [EDITOR_MODE.ADD, EDITOR_MODE.CONTINUES_ADD].includes(mode)
                  ) {
                    if (localDataRef.current.targetNode) {
                      onEvent({
                        type: EVENT.ADD_EDGE,
                        payload: {
                          items: [{
                            id: R.uuid(),
                            source: localDataRef.current.targetNode.id(),
                            target: elementId,
                          }],
                        },
                        event,
                      })
                      localDataRef.current.targetNode = null
                    } else {
                      localDataRef.current.targetNode = element
                    }
                    return
                  }
                  if (EDITOR_MODE.ADD_CLUSTER_ELEMENT === mode) {
                    onEvent({
                      type: EVENT.ADD_CLUSTER_ELEMENT,
                      payload: {
                        clusterId: localDataRef.current.issuedClusterId,
                        itemIds: [elementId],
                      },
                    })
                    return
                  }
                  // cyUnselectAll(graphEditorRef.current.cy)
                  // element.select()
                  onEvent({
                    type: EVENT.ELEMENT_SELECTED,
                    payload: {
                      itemIds: [element.id()],
                    },
                    event,
                    avoidHistoryRecording: true,
                  })
                }}
              >
                {(renderNode ?? DefaultRenderNode)({
                  item,
                  element,
                  // @ts-ignore
                  label: getLabel(
                    label?.isGlobalFirst
                      ? (label?.global.nodes ?? label?.nodes?.[item.id])
                      : (label?.nodes?.[item.id] ?? label?.global.nodes),
                    item,
                  ),
                  labelPath: (label?.isGlobalFirst
                    ? (label?.global.nodes ?? label?.nodes?.[item.id])
                    : (label?.nodes?.[item.id] ?? label?.global.nodes)) ?? [],
                  ...rest,
                })}
              </Graph.View>
            )
          }}
          renderEdge={({ item, element, ...rest }) => (
            <Graph.View
              interactive
              rightclick={(event) => {
                onEvent({
                  type: EVENT.ELEMENT_SELECTED,
                  payload: {
                    itemIds: [element.id()],
                  },
                  event,
                  avoidHistoryRecording: true,
                })
                updateState((draft) => {
                  draft.contextMenu.visible = true
                })
                event.stopPropagation()
              }}
              pointertap={(event) => {
                const { mode } = localDataRef.current.props
                if (
                  [
                    EDITOR_MODE.DELETE,
                    // @ts-ignore
                    EDITOR_MODE.CONTINUES_DELETE].includes(mode)
                ) {
                  onEvent({
                    type: EVENT.DELETE_EDGE,
                    payload: {
                      itemIds: [item.id],
                    },
                    event,
                  })
                  return
                }
                // cyUnselectAll(graphEditorRef.current.cy)
                // element.select()
                onEvent({
                  type: EVENT.ELEMENT_SELECTED,
                  payload: {
                    itemIds: [element.id()],
                  },
                  avoidHistoryRecording: true,
                })
              }}
            >
              {
               // @ts-ignore
            (renderEdge ?? DefaultRenderEdge)({
              item,
              // @ts-ignore
              label: getLabel(
                label?.isGlobalFirst
                  ? (label?.global.edges ?? label?.edges?.[item.id])
                  : (label?.edges?.[item.id] ?? label?.global.edges),
                item,
              ),
              labelPath: (label?.isGlobalFirst
                ? (label?.global.edges ?? label?.edges?.[item.id])
                : (label?.edges?.[item.id] ?? label?.global.edges)) ?? [],
              element,
              ...rest,
            })
}
            </Graph.View>
          )}
        />
        {
        settingsBar && (
          <SettingsBar
            {...settingsBar}
          />
        )
      }
        <DataBar
          {...dataBar}
        />

        {
        actionBar && (
        <ActionBar
          onAction={({ type, value }) => {
            switch (type) {
              case EVENT.EXPORT_DATA:
                onEvent({
                  type: EVENT.EXPORT_DATA,
                  payload: {
                    value: extractGraphEditorData(props),
                  },
                })
                break
              case EVENT.CHANGE_THEME:
                onEvent({
                  type: EVENT.CHANGE_THEME,
                  payload: {
                    value,
                  },
                })
                break

              default:
                onEvent({
                  type: type as EventType,
                  payload: value,
                })
                break
            }
          }}
          {...actionBar}
        />
        )
}
        <MouseIcon
        // name={MODE_ICON_MAP[mode]}
          name={MODE_ICON_MAP_BY_URL[mode]}
          cursor
        />
        <RecordedEventsModal
          timeoutManager={eventTimeoutsManager}
          onClose={() => {
            updateState(() => {})
            eventTimeoutsManager.clear()
          }}
        />
        <ContextMenu
          graphEditorRef={graphEditorRef}
          items={[
            { value: 'CreateCluster', label: 'Create Cluster' },
            { value: 'Delete', label: 'Delete' },
            { value: 'Focus', label: 'Focus' },
            // { value: 'Settings', label: 'Settings' },
          ]}
          onSelect={(value) => {
            const {
              current: {
                contextMenu: {
                  itemIds,
                },
              },
            } = localDataRef
            switch (value) {
              case 'CreateCluster':
                onEvent({
                  type: EVENT.CREATE_CLUSTER,
                  payload: {
                    items: [{
                      id: R.uuid(),
                      name: `Cluster-${graphConfig?.clusters?.length ?? 0}`,
                      ids: itemIds,
                      childClusterIds: [],
                    }],
                  },
                })
                break
              case 'Delete':
                onEvent({
                  type: EVENT.DELETE_NODE,
                  payload: {
                    itemIds,
                  },
                })
                break
              case 'Settings':
                onEvent({
                  type: EVENT.ELEMENT_SETTINGS,
                  payload: {
                    itemIds,
                  },
                })
                break
              case 'Focus':
                onEvent({
                  type: EVENT.FOCUS,
                  payload: {
                    itemIds,
                  },
                })
                break
              default:
                break
            }
            localDataRef.current.newClusterBoxSelection.elementIds = []
            localDataRef.current.contextMenu.itemIds = []
            updateState((draft) => {
              draft.contextMenu.visible = false
            })
          }}
          position={state.contextMenu.position}
          open={state.contextMenu.visible}
        />
      </Box>
      <PreferencesModal
        {...preferencesModal}
      />
      {
        Object.keys(modals).map((modalName) => (
          <ModalComponent
            key={modalName}
            // @ts-ignore
            {...(modals[modalName]! ?? {})}
            name={modalName}
          />
        ))
      }
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading || state.isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <IconButton
        onClick={()=> onEvent({
          type: EVENT.DEFOCUS,
        })}
        style={{
          position: 'absolute',
          left: '49%',
          visibility: isFocusMode ? 'visible' : 'hidden',
        }}
      >
<Icon 
        name="cancel_rounded"
        
      />
      </IconButton>
      
    </GraphEditorProvider>

  )
}

const convertWithoutFunctions = (object: any) => {
  const cache: any[] = []
  return JSON.stringify(object, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      // Duplicate reference found, discard key
      if (cache.includes(value)) return null

      // Store value in our collection
      cache.push(value)
    }
    if (value && (value.isNode || typeof value === 'function' || ReactIs.isValidElementType(value) || value.$$typeof)) return null
    return value
  })
}

const extractGraphEditorData = (props: GraphEditorProps) => convertWithoutFunctions(props)

// const convert = (object: any) => {
//   const cache: any[] = []
//   return JSON.stringify(object, (key, value) => {
//     if (typeof value === 'object' && value !== null) {
//       // Duplicate reference found, discard key
//       if (cache.includes(value)) return null

//       // Store value in our collection
//       cache.push(value)
//     }
//     return value
//   })
// }
// const extractGraphEditorData = (props: GraphEditorProps) => convert({
//   graphConfig: props.graphConfig,
//   label: props.label,
//   settingsBar: R.omit(['header', 'footer'], props.settingsBar),
//   dataBar: R.omit(['header', 'footer'], props.dataBar),
//   actionBar: R.omit(['right', 'left'], props.actionBar),
//   eventHistory: props.eventHistory,
//   mode: props.mode,
//   nodes: props.nodes,
//   edges: props.edges,
//   networkStatistics: props.networkStatistics,
// })

/**
 * It is a wrapper for Graph with editor components. It has Sidebar, DataBar, ActionBar
 * to give the power of editing.
 */
export const GraphEditor = wrapComponent<
PropsWithRef<GraphEditorRef, GraphEditorProps>
>(
  GraphEditorElement,
  {
    isEqual: (item, otherItem) => {
      if (R.is(Function, item)) {
        return true
      }
      return item === otherItem
    }, // R.equalsExclude(R.is(Function)),
    isForwardRef: true,
  },
)
