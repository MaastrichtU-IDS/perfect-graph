import React from 'react'
import {
  DefaultRenderEdge,
  DefaultRenderNode, Graph, GraphProps,
} from '@components'
import {
  Box,
  Backdrop,
  CircularProgress,
} from '@material-ui/core'
import {
  EditorMode, EventInfo,
  GraphConfig,
  GraphEditorRef, GraphLabelData,
  RecordedEvent, GraphEditorRenderEdge,
  GraphEditorRenderNode, EventHistory,
  OnEvent,
  GraphEditorConfig,
  NodeElement,
  Playlist,
  OnEventLite,
  NetworkStatistics,
  EventType,
} from '@type'
import {
  getLabel, getSelectedItemByElement,
  throttle, cyUnselectAll,
  getPointerPositionOnViewport,
} from '@utils'
import { EDITOR_MODE, EVENT } from '@constants'
import { useTimeoutManager } from '@utils/useTimeoutManager'
import { calculateStatistics } from '@utils/networkStatistics'
import { useForwardRef, wrapComponent } from 'colay-ui'
import { PropsWithRef } from 'colay-ui/type'
import * as R from 'colay/ramda'
import { Clusters } from '@core/clusters'
import { useImmer } from 'colay-ui/hooks/useImmer'
import { ContextMenu } from '@components/ContextMenu'
import { GraphEditorProvider } from '@hooks/useGraphEditor'
import { ActionBar, ActionBarProps } from './ActionBar'
import { DataBar, DataBarProps } from './DataBar'
import { MouseIcon } from './MouseIcon'
import { SettingsBar, SettingsBarProps } from './SettingsBar'
import { RecordedEventsModal } from './RecordedEventsModal'
import { PreferencesModal, PreferencesModalProps } from './PreferencesModal'

type RenderElementAdditionalInfo = {
  // label: string;
}

export type GraphEditorProps = {
  onEvent?: OnEvent;
  graphConfig?: GraphConfig;
  config?: GraphEditorConfig;
  renderMoreAction?: () => React.ReactElement;
  label?: GraphLabelData;
  settingsBar?: SettingsBarProps;
  dataBar?: Pick<DataBarProps, 'editable'| 'isOpen'>;
  actionBar?: Pick<ActionBarProps, 'renderMoreAction' | 'isOpen' | 'recording' |'eventRecording' | 'autoOpen' | 'theming'>;
  preferencesModal?: PreferencesModalProps;
  selectedElementIds?: string[] | null;
  mode?: EditorMode;
  renderEdge?: GraphEditorRenderEdge<RenderElementAdditionalInfo>;
  renderNode?: GraphEditorRenderNode<RenderElementAdditionalInfo>;
  events?: RecordedEvent[]
  eventHistory?: EventHistory;
  playlists?: Playlist[];
  networkStatistics?: NetworkStatistics;
  isLoading?: boolean;
} & Omit<
GraphProps,
'config'|'onPress' | 'renderNode' | 'renderEdge'
>

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
    graphConfig,
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
    ...rest
  } = props
  const localDataRef = React.useRef({
    initialized: false,
    targetNode: null as NodeElement | null,
    props,
    issuedClusterId: null as string|null,
    newClusterBoxSelection: {
      elementIds: [] as string[],
    },
    networkStatistics: {
      local: null,
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
  })
  localDataRef.current.props = props
  React.useEffect(() => {
    localDataRef.current.initialized = true
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
        : collection
    },
    // if (!localDataRef.current.initialized) {
    //   const callback = () => {
    //     setTimeout(() => {
    //       if (graphEditorRef.current.cy) {

    //       } else {
    //         callback()
    //       }
    //     }, 1000)
    //   }
    // } else if (selectedElementIds?.length > 0) {
    //   return graphEditorRef.current.cy && graphEditorRef.current.cy.$id(R.last(selectedElementIds))
    // }

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
    (events ?? []).map((event, index) => ({
      ...event,
      after: events?.[index - 1]
        ? new Date(
          event.date,
        ).getMilliseconds() - new Date(events[index - 1].date).getMilliseconds()
        : 0,
    })),
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
  React.useEffect(() => {
    if (!config.enableNetworkStatistics) {
      localDataRef.current.networkStatistics.local = networkStatistics?.local
    } else {
      localDataRef.current.networkStatistics.local = R.mergeDeepRight(
        calculateStatistics({ nodes, edges }),
        (networkStatistics?.local ?? {}),
      )
    }
  }, [])
  React.useMemo(() => {
    if (localDataRef.current.initialized) {
      localDataRef.current.networkStatistics.local = R.mergeDeepRight(
        calculateStatistics({ nodes, edges }),
        (networkStatistics?.local ?? {}),
      )
    }
  }, [nodes, edges, networkStatistics?.local, config.enableNetworkStatistics])
  React.useEffect(() => {
    localDataRef.current.targetNode = null
  }, [mode])
  const graphEditorValue = React.useMemo(() => ({
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
  ])
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
            })
          }}
          onBoxSelection={(event) => {
            const { mode } = localDataRef.current.props
            const {
              elementIds,
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
            localDataRef.current.newClusterBoxSelection.elementIds = elementIds
            updateState((draft) => {
              const e = event.event.data.originalEvent
              draft.contextMenu.visible = true
              draft.contextMenu.position = {
                x: e.clientX,
                y: e.clientY,
              }
              // getPointerPositionOnViewport(
              //   graphEditorRef.current.viewport,
              //   // @ts-ignore
              //   event.event.data.originalEvent,
              // )
            })
            // TODO: **DANGER
            onEvent({
              type: EVENT.BOX_SELECTION,
              payload: {
                elementIds,
              },
            })
          }}
          renderNode={({ item, element, ...rest }) => (
            <Graph.View
              interactive
              click={(event) => {
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
                      items: [item],
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
          )}
          renderEdge={({ item, element, ...rest }) => (
            <Graph.View
              interactive
              click={(event) => {
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
                      items: [item],
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
            { value: 'Settings', label: 'Settings' },
          ]}
          onSelect={(value) => {
            updateState((draft) => {
              draft.contextMenu.visible = false
            })
            switch (value) {
              case 'CreateCluster':
                onEvent({
                  type: EVENT.CREATE_CLUSTER,
                  payload: {
                    items: [{
                      id: R.uuid(),
                      name: `Cluster-${graphConfig?.clusters?.length ?? 0}`,
                      ids: localDataRef.current.newClusterBoxSelection.elementIds,
                      childClusterIds: [],
                    }],
                  },
                })
                break
              case 'Delete':
                onEvent({
                  type: EVENT.DELETE_NODE,
                  payload: {
                    items: nodes.filter(
                      (nodeItem) => localDataRef.current.newClusterBoxSelection.elementIds
                        .includes(nodeItem.id),
                    ),
                  },
                })
                break
              default:
                break
            }
            localDataRef.current.newClusterBoxSelection.elementIds = []
          }}
          position={state.contextMenu.position}
          open={state.contextMenu.visible}
        />
      </Box>
      <PreferencesModal
        {...preferencesModal}
      />
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </GraphEditorProvider>

  )
}

const convert = (object: any) => {
  const cache: any[] = []
  return JSON.stringify(object, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      // Duplicate reference found, discard key
      if (cache.includes(value)) return null

      // Store value in our collection
      cache.push(value)
    }
    return value
  })
}
const extractGraphEditorData = (props: GraphEditorProps) => convert({
  graphConfig: props.graphConfig,
  label: props.label,
  // settingsBar: R.omit(['header', 'footer'], props.settingsBar),
  dataBar: R.omit(['header', 'footer'], props.dataBar),
  actionBar: R.omit(['right', 'left'], props.actionBar),
  eventHistory: props.eventHistory,
  mode: props.mode,
  nodes: props.nodes,
  edges: props.edges,
})

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
