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
  RenderNode,
} from '@type'
import { getLabel, getSelectedItemByElement } from '@utils'
// import { useGraph } from '@hooks'
import { EDITOR_MODE, EVENT } from '@utils/constants'
import { useTimeoutManager } from '@utils/useTimeoutManager'
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
  onEvent?: (info: EventInfo) => void;
  graphConfig?: GraphConfig;
  renderMoreAction?: () => React.ReactElement;
  label?: GraphLabelData;
  settingsBar?: SettingsBarProps;
  dataBar?: Pick<DataBarProps, 'editable'| 'opened'>;
  actionBar?: Pick<ActionBarProps, 'renderMoreAction' | 'opened' | 'recording' |'eventRecording'>;
  selectedElementId?: string | null;
  mode?: EditorMode;
  renderEdge?: RenderEdge<RenderElementAdditionalInfo>;
  renderNode?: RenderNode<RenderElementAdditionalInfo>;
  events?: RecordedEvent[]
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
    selectedElementId,
    label,
    mode = EDITOR_MODE.DEFAULT,
    events,
    ...rest
  } = props
  const [state, setState] = React.useState({
    eventsModal: {
      visible: false,
    },
  })
  const graphId = React.useMemo<string>(
    () => graphConfig?.graphId ?? R.uuid(),
    [graphConfig?.graphId],
  )
  // const { cy } = useGraph({
  //   id: graphId,
  // })
  const graphEditorRef = useForwardRef(ref)
  const selectedElement = React.useMemo(
    () => selectedElementId && graphEditorRef.current.cy && graphEditorRef.current.cy.$id(selectedElementId),
    [nodes, edges, selectedElementId],
  )
  const selectedItem = selectedElement && getSelectedItemByElement(
    selectedElement, { nodes, edges },
  ).item
  const selectedElementIsNode = selectedElement && selectedElement.isNode()
  const targetPath = selectedElementIsNode ? 'nodes' : 'edges'
  const onEventCallback = React.useCallback((eventInfo) => {
    onEvent({
      ...eventInfo,
    })
  }, [onEvent])
  // const eventTimeoutsManagerRef = React.useRef(null)
  // React.useEffect(
  //   () => {
  //     if (!events) {
  //       return () => {}
  //     }
  //     const eventTimeoutsManager = createTimeoutManager(
  //       events,
  // (event, index) => {
  //   if (index === events.length - 1) {
  //     eventTimeoutsManagerRef.current = null
  //   }
  //   onEvent(event.data)
  // },
  //     )
  //     eventTimeoutsManagerRef.current = eventTimeoutsManager
  //     return () => {
  //       eventTimeoutsManager?.clear()
  //       eventTimeoutsManagerRef.current = null
  //     }
  //   },
  //   [events],
  // )
  const eventTimeoutsManager = useTimeoutManager(
    events,
    (event) => {
      onEvent(event.data)
    },
    {
      deps: [events],
      renderOnFinished: true,
      renderOnPlayChanged: true,
      autostart: false,
    },
  )

  return (
    <Box
      style={{
        ...style,
        overflow: 'hidden',
        position: 'relative',
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
        onPress={({ position }) => {
          onEventCallback({
            type: EVENT.PRESS_BACKGROUND,
            payload: position,
          })
        }}
        renderNode={({ item, element, ...rest }) => (
          <Graph.Pressable
            onPress={(event) => {
              graphEditorRef.current.cy.$(':selected').unselect()
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
              ...rest,
            })}
          </Graph.Pressable>
        )}
        renderEdge={({ item, element, ...rest }) => (
          <Graph.Pressable
            onPress={() => {
              graphEditorRef.current.cy.$(':selected').unselect()
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
              element,
              ...rest,
            })
}
          </Graph.Pressable>
        )}
      />

      <DataBar
        {...dataBar}
        item={selectedItem}
        localLabel={selectedElement && (label?.[targetPath][selectedItem?.id!])}
        globalLabel={label?.global?.[targetPath]}
        isGlobalLabelFirst={label?.isGlobalFirst}
        onEvent={onEventCallback}
      />
      {
        settingsBar && (
          <SettingsBar
            {...settingsBar}
            onEvent={onEventCallback}
          />
        )
      }
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
