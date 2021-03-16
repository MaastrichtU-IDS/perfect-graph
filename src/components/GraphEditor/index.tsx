import {
  DefaultRenderEdge,
  DefaultRenderNode, Graph, GraphProps,
} from '@components'
import {
  Box,
} from '@material-ui/core'
import {
  EditorMode, EventInfo,
  GraphConfig,
  GraphEditorRef, GraphLabelData,
  RecordedEvent, RenderEdge,
  RenderNode, EventHistory,
  OnEvent,
  GraphEditorConfig,
  NodeElement,
} from '@type'
import { getLabel, getSelectedItemByElement,
   throttle,cyUnselectAll } from '@utils'
// import { useGraph } from '@hooks'
import { EDITOR_MODE, EVENT } from '@utils/constants'
import { useTimeoutManager } from '@utils/useTimeoutManager'
import { calculateStatistics } from '@utils/networkStatistics'
import { useForwardRef, wrapComponent } from 'colay-ui'
import { PropsWithRef } from 'colay-ui/type'
import * as R from 'colay/ramda'
import React from 'react'
import { ActionBar, ActionBarProps } from './ActionBar'
import { DataBar, DataBarProps } from './DataBar'
import { MouseIcon } from './MouseIcon'
import { SettingsBar, SettingsBarProps } from './SettingsBar'
import { RecordedEventsModal } from './RecordedEventsModal'

type RenderElementAdditionalInfo = {
  label: string;
}

export type GraphEditorProps = {
  onEvent?: OnEvent;
  graphConfig?: GraphConfig;
  config?: GraphEditorConfig;
  renderMoreAction?: () => React.ReactElement;
  label?: GraphLabelData;
  settingsBar?: SettingsBarProps;
  dataBar?: Pick<DataBarProps, 'editable'| 'opened'>;
  actionBar?: Pick<ActionBarProps, 'renderMoreAction' | 'opened' | 'recording' |'eventRecording' | 'autoOpen'>;
  selectedElementIds?: string[] | null;
  mode?: EditorMode;
  renderEdge?: RenderEdge<RenderElementAdditionalInfo>;
  renderNode?: RenderNode<RenderElementAdditionalInfo>;
  events?: RecordedEvent[]
  eventHistory?: EventHistory;
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
  [EDITOR_MODE.DEFAULT]: null,
}

const DEFAULT_HANDLER = R.identity as (info: EventInfo) => void

export type GraphEditorType = React.FC<GraphEditorProps>

const DEFAULT_GRAPH_EDITOR_CONFIG: GraphEditorConfig = {
  enableNetworkStatistics: true,
}
const GraphEditorElement = (
  props: GraphEditorProps,
  ref: React.ForwardedRef<GraphEditorRef>,
) => {
  const {
    onEvent = DEFAULT_HANDLER,
    renderEdge,
    renderNode,
    graphConfig,
    style,
    settingsBar,
    actionBar,
    dataBar = {},
    nodes,
    edges,
    selectedElementIds = [],
    label,
    mode = EDITOR_MODE.DEFAULT,
    events,
    eventHistory,
    config = DEFAULT_GRAPH_EDITOR_CONFIG,
    ...rest
  } = props
  const localDataRef = React.useRef({
    initialized: false,
    targetNode: null as NodeElement | null,
    props,
  })
  localDataRef.current.props = props
  React.useEffect(() => {
    localDataRef.current.initialized = true
  }, [])
  const [state, setState] = React.useState({
    eventsModal: {
      visible: false,
    },
  })
  const graphId = React.useMemo<string>(
    () => graphConfig?.graphId ?? R.uuid(),
    [graphConfig?.graphId],
  )
  const graphEditorRef = useForwardRef(ref)
  const selectedElement = React.useMemo(
    () => {
      return graphEditorRef.current?.cy?.$id(R.last(selectedElementIds)!)
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
      
    },
    [nodes, edges, selectedElementIds],
  )
  const selectedItem = selectedElement && getSelectedItemByElement(
    selectedElement, { nodes, edges },
  ).item
  const selectedElementIsNode = selectedElement && selectedElement.isNode()
  const targetPath = selectedElementIsNode ? 'nodes' : 'edges'
  const onEventCallback = React.useCallback((eventInfo) => {
    // switch (eventInfo.type) {
    //   case EVENT.CALCULATE_LOCAL_NETWORK_STATISTICS:
    //     localNetworkStatisticsRef.current = calculateStatistics({ nodes, edges })
    //     break

    //   default:
    //     break
    // }
    onEvent({
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
  }, [onEvent, selectedElement?.id()])
  const eventTimeoutsManager = useTimeoutManager(
    events?.map((event, index) => ({
      ...event,
      after: events[index - 1]
        ? new Date(event.date) - new Date(events[index - 1].date)
        : 0,
    })),
    (event) => {
      onEvent(event)
    },
    {
      deps: [events],
      renderOnFinished: true,
      renderOnPlayChanged: true,
      autostart: false,
    },
  )
  const localNetworkStatisticsRef = React.useRef(null)
  React.useEffect(() => {
    if (!config.enableNetworkStatistics) {
      localNetworkStatisticsRef.current = null
    } else {
      localNetworkStatisticsRef.current = calculateStatistics({ nodes, edges })
    }
  }, [])
  React.useMemo(() => {
    if (localDataRef.current.initialized) {
      localNetworkStatisticsRef.current = calculateStatistics({ nodes, edges })
    }
  }, [nodes, edges, config.enableNetworkStatistics])
  React.useEffect(() => {
    localDataRef.current.targetNode = null
  }, [mode])
  return (
    <Box
      style={{
        ...style,
        overflow: 'hidden',
        position: 'relative',
      }}
      onMouseMove={(e) => {
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
                && !props.actionBar?.opened) {
                return onEvent({
                  type: EVENT.TOGGLE_ACTION_BAR,
                  avoidHistoryRecording: true,
                })
              }
              if (pageY + 50 <= offsetTop + offsetHeight && props.actionBar?.opened) {
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
          width: '100%',
          height: '100%',
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
          const { mode } = localDataRef.current.props
          if (
            // @ts-ignore
            [EDITOR_MODE.ADD, EDITOR_MODE.CONTINUES_ADD].includes(mode)
          ) {
            onEventCallback({
              type: EVENT.ADD_NODE,
              payload: {
                id: R.uuid(),
                position,
              },
            })
            return
          }
          onEventCallback({
            type: EVENT.PRESS_BACKGROUND,
            payload: { position },
          })
        }}
        renderNode={({ item, element, ...rest }) => (
          <Graph.Pressable
            onPress={(event) => {
              const { mode } = localDataRef.current.props
              if (
                // @ts-ignore
                [
                  EDITOR_MODE.DELETE,
                  EDITOR_MODE.CONTINUES_DELETE].includes(mode)
              ) {
                onEventCallback({
                  type: EVENT.DELETE_NODE,
                  item,
                  event,
                })
                return
              }
              if (
                [EDITOR_MODE.ADD, EDITOR_MODE.CONTINUES_ADD].includes(mode)
              ) {
                if (localDataRef.current.targetNode) {
                  onEventCallback({
                    type: EVENT.ADD_EDGE,
                    elementId: element.id(),
                    payload: {
                      id: R.uuid(),
                      source: localDataRef.current.targetNode.id(),
                      target: element.id(),
                    },
                    event,
                  })
                  localDataRef.current.targetNode = null
                } else {
                  localDataRef.current.targetNode = element
                }
                return
              }
              cyUnselectAll(graphEditorRef.current.cy)
              element.select()
              onEventCallback({
                type: EVENT.ELEMENT_SELECTED,
                elementId: element.id(),
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
              labelPath: label?.isGlobalFirst
              ? (label?.global.nodes ?? label?.nodes?.[item.id])
              : (label?.nodes?.[item.id] ?? label?.global.nodes),
              ...rest,
            })}
          </Graph.Pressable>
        )}
        renderEdge={({ item, element, ...rest }) => (
          <Graph.Pressable
            onPress={(event) => {
              const { mode } = localDataRef.current.props
              if (
                // @ts-ignore
                [
                  EDITOR_MODE.DELETE,
                  EDITOR_MODE.CONTINUES_DELETE].includes(mode)
              ) {
                onEventCallback({
                  type: EVENT.DELETE_EDGE,
                  elementId: element.id(),
                  event,
                })
                return
              }
              cyUnselectAll(graphEditorRef.current.cy)
              element.select()
              onEventCallback({
                type: EVENT.ELEMENT_SELECTED,
                elementId: element.id(),
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
              labelPath: label?.isGlobalFirst
              ? (label?.global.edges ?? label?.edges?.[item.id])
              : (label?.edges?.[item.id] ?? label?.global.edges),
              element,
              ...rest,
            })
}
          </Graph.Pressable>
        )}
      />
      {
        settingsBar && (
          <SettingsBar
            {...settingsBar}
            onEvent={onEventCallback}
            eventHistory={eventHistory}
            clusters={graphConfig?.clusters}
          />
        )
      }
      <DataBar
        {...dataBar}
        graphEditorConfig={config}
        item={selectedItem}
        localLabel={selectedElement && (label?.[targetPath][selectedItem?.id!])}
        globalLabel={label?.global?.[targetPath]}
        isGlobalLabelFirst={label?.isGlobalFirst?.[targetPath]}
        onEvent={onEventCallback}
        statistics={{
          localNetworkStatistics: localNetworkStatisticsRef.current?.[selectedItem?.id],
          // globalNetworkStatistics: localNetworkStatisticsRef.current?.[selectedItem?.id],
        }}
      />

      {
        actionBar && (
        <ActionBar
          onEvent={onEvent}
          graphEditorRef={graphEditorRef}
          mode={mode}
          graphConfig={graphConfig}
          onAction={({ type, value }) => {
            switch (type) {
              case EVENT.EXPORT_DATA:
                onEventCallback({
                  type: EVENT.EXPORT_DATA,
                  payload: {
                    value: extractGraphEditorData(props),
                  },
                })
                break
              case EVENT.CHANGE_THEME:
                onEventCallback({
                  type: EVENT.CHANGE_THEME,
                  payload: {
                    value,
                  },
                })
                break

              default:
                onEventCallback({
                  type,
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
          setState({ ...state })
          eventTimeoutsManager.clear()
        }}
      />
    </Box>
  )
}

const extractGraphEditorData = (props: GraphEditorProps) => ({
  graphConfig: props.graphConfig,
  label: props.label,
  settingsBar: props.settingsBar,
  dataBar: props.dataBar,
  actionBar: props.actionBar,
  mode: props.mode,
  nodes: props.nodes,
  edges: props.edges,
})

/**
 * ## Usage
 * To create a GraphEditor easily, you can just pass data and render methods.
 * Check example
 *
 * ```js live=true
 * function MyGraphEditor() {
 *  const [data, setData] = React.useState({
 *    nodes: [
 *         { id: 1, position: { x: 10, y: 10 } },
 *         { id: 2, position: { x: 300, y: 100 } },
 *       ],
 *    edges: [
 *         { id: 51, source: 1, target: 2 }
 *       ]
 *  })
 *  return (
 *    <GraphEditor
 *       style={{ width: '100%', height: 250 }}
 *       configExtractor={({ item }) => ({ data: { data: item }})}
 *       nodes={data.nodes}
 *       edges={data.edges}
 *     />
 *  )
 * }
 * ```
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
