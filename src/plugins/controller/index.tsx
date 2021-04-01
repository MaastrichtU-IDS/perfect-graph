import React from 'react'
import {
  EditorMode,
  GraphLabelData, RDFType,
  DataItem, EventInfo,
  GraphEditorRef,
  RecordedEvent,
  ControllerState,
} from '@type'
import { GraphEditorProps } from '@components/GraphEditor'
import { Graph } from '@components'
import {
  EVENT, ELEMENT_DATA_FIELDS, EDITOR_MODE, MOCK_DATA,
} from '@utils/constants'
import GraphLayouts from '@core/layouts'
import {
  getSelectedItemByElement, getUndoEvents, cyUnselectAll,
  getElementsCollectionByIds,
} from '@utils'
import { Clusters } from '@core/clusters'
import { download } from 'colay-ui/utils'
import { useImmer } from 'colay-ui/hooks/useImmer'
import * as R from 'colay/ramda'
import { createHistory } from '@utils/createHistory'

type ControllerOptions = {
  // onEvent?: (info: EventInfo, draft: ControllerState) => boolean;
}

type UseControllerData = Pick<
GraphEditorProps,
'nodes'| 'edges' | 'mode'
| 'actionBar' | 'dataBar' | 'settingsBar'
| 'graphConfig' | 'events' | 'label' | 'playlists'
> & {
  onEvent?: (info: EventInfo & {
    graphEditor: GraphEditorRef;
  }, draft: ControllerState) => boolean;
}

// export type UseControllerResult = [
//   UseControllerData,
//   {},
// ]

const closeAllBars = (draft:UseControllerData) => {
  draft.actionBar!.opened = false
  draft.dataBar!.opened = false
  draft.settingsBar!.opened = false
}

export const useController = (
  useControllerData: UseControllerData,
  _graphEditorRef?: React.MutableRefObject<GraphEditorRef>,
  options: ControllerOptions = {},
) => {
  const controllerConfig: UseControllerData = React.useMemo<UseControllerData>(
    () => R.mergeDeepAll([
      DEFAULT_CONTROLLER_CONFIG,
      useControllerData,
    ]) as UseControllerData, [], // useControllerData
  )
  const eventHistory = React.useMemo(() => createHistory({
    onEvent: (event) => {
      const {
        actions,
      } = event
      actions.map(onEvent)
    },
  }), [])
  const [state, update] = useImmer(controllerConfig)
  const localGraphEditorRef = React.useRef(null)
  const graphEditorRef = _graphEditorRef ?? localGraphEditorRef
  const localDataRef = React.useRef({
    recordedEvents: [] as RecordedEvent[],
    // targetNode: null,
  })
  const onEvent = React.useCallback((eventInfo: EventInfo) => {
    const {
      type,
      payload = {},
      index = 0,
      dataItem = {} as DataItem,
      event,
      elementId,
      item,
      avoidEventRecording,
      avoidHistoryRecording,
    } = eventInfo
    const graphEditor = graphEditorRef.current
    const element = elementId
      ? graphEditor.cy.$id(`${elementId}`)
      : null
    const isNode = element?.isNode()
    const targetPath = isNode ? 'nodes' : 'edges'
    update((draft) => {
      try {
        if (!avoidHistoryRecording) {
          const {
            addHistory,
            events: undoEvents,
          } = getUndoEvents([eventInfo], { graphEditor, draft })
          if (addHistory) {
            eventHistory.add({
              do: [
                {
                  ...eventInfo,
                  event,
                  avoidEventRecording: true,
                  avoidHistoryRecording: true,
                },
              ],
              undo: undoEvents.map((e) => ({
                ...e,
                avoidEventRecording: true,
                avoidHistoryRecording: true,
              })),
            })
          }
        }
        if (
          draft.actionBar?.eventRecording
          && type !== EVENT.TOGGLE_RECORD_EVENTS
          && !avoidEventRecording
        ) {
          localDataRef.current.recordedEvents.push({
            ...eventInfo,
            event,
          })
        }
        const isAllowedToProcess = controllerConfig.onEvent?.({
          ...eventInfo,
          graphEditor,
        }, draft)
        if (isAllowedToProcess === false) {
          return
        }
        const {
          item: selectedItem,
          index: selectedItemIndex,
        } = (element && getSelectedItemByElement(element, draft)) ?? {}
        const targetDataList = selectedItem?.data!// getSelectedItemByElement(element, draft).data
        switch (type) {
          case EVENT.REDO_EVENT:
            eventHistory.redo()
            break
          case EVENT.UNDO_EVENT:
            eventHistory.undo()
            break
          case EVENT.UPDATE_DATA:
            selectedItem.data = payload.value
            break
          case EVENT.ADD_DATA:
            targetDataList.push({
              ...payload,
              value: [payload.value],
            })
            break
          case EVENT.MAKE_DATA_LABEL: {
            const newLabel = [ELEMENT_DATA_FIELDS.DATA, dataItem.name]
            const isSame = R.equals(draft.label[targetPath][selectedItem.id], newLabel)
            if (isSame) {
              delete draft.label[targetPath][selectedItem.id]
            } else {
              draft.label[targetPath][selectedItem.id] = newLabel
            }
            // targetDataList[index].name = payload.value
            break
          }
          case EVENT.MAKE_DATA_LABEL_FIRST: {
            draft.label.isGlobalFirst = false
            break
          }
          case EVENT.MAKE_GLOBAL_DATA_LABEL: {
            const newLabel = [ELEMENT_DATA_FIELDS.DATA, dataItem.name]
            const isSame = R.equals(draft.label.global[targetPath], newLabel)
            draft.label.global[targetPath] = isSame ? [ELEMENT_DATA_FIELDS.ID] : newLabel
            break
          }
          case EVENT.MAKE_GLOBAL_DATA_LABEL_FIRST: {
            draft.label.isGlobalFirst = true
            break
          }
          case EVENT.ADD_NODE: {
            const {
              items,
            } = payload
            draft.nodes = draft.nodes.concat(items)
            // const { position } = payload
            // draft.nodes.push({
            //   id: `${draft.nodes.length + 1}`, // R.uuid(),
            //   position,
            //   data: [],
            // })
            if (draft.mode === EDITOR_MODE.ADD) {
              draft.mode = EDITOR_MODE.DEFAULT
            }
            break
          }
          case EVENT.DELETE_NODE: {
            const {
              items = [],
            } = payload as {
              items: {id: string} []
            }
            const itemIds = items.map((item) => item.id)
            // const itemIndex = draft.nodes.findIndex((node) => node.id === item.id)
            // draft.nodes.splice(itemIndex, 1)
            draft.nodes = draft.nodes.filter((nodeItem) => !itemIds.includes(nodeItem.id))
            draft.edges = draft.edges.filter(
              (edgeItem) => !itemIds.includes(edgeItem.source)
              && !itemIds.includes(edgeItem.target),
            )
            if (draft.mode === EDITOR_MODE.DELETE) {
              draft.mode = EDITOR_MODE.DEFAULT
            }
            break
          }
          case EVENT.ADD_EDGE: {
            draft.edges = draft.edges.concat(payload.items)
            // const {
            //   id,
            //   source,
            //   target,
            // } = payload
            // draft.edges.push({
            //   id,
            //   source,
            //   target,
            //   data: {},
            // })
            if (draft.mode === EDITOR_MODE.ADD) {
              draft.mode = EDITOR_MODE.DEFAULT
            }
            break
          }
          case EVENT.DELETE_EDGE: {
            const {
              items = [],
            } = payload as {
              items: {id: string} []
            }
            const itemIds = items.map((item) => item.id)
            draft.edges = draft.edges.filter((edgeItem) => !itemIds.includes(edgeItem.id))
            if (draft.mode === EDITOR_MODE.DELETE) {
              draft.mode = EDITOR_MODE.DEFAULT
            }
            break
          }
          case EVENT.PRESS_BACKGROUND: {
            draft.selectedElementIds = []
            break
          }
          case EVENT.ELEMENT_SELECTED: {
            draft.selectedElementIds = [selectedItem.id]
            if (event && event.data.originalEvent.metaKey && element?.isNode()) {
              draft.dataBar!.opened = true
              const {
                viewport,
              } = graphEditor
              const TARGET_SIZE = 2000 // viewport.hitArea.width / 2// 800
              const MARGIN_SIZE = 180
              const position = element.position()
              const center = {
                x: position.x + TARGET_SIZE / 4,
                y: position.y,
              }
              element.neighborhood().layout({
                ...Graph.Layouts.circle,
                boundingBox: {
                  x1: center.x - TARGET_SIZE / 2,
                  y1: center.y - TARGET_SIZE / 3,
                  w: TARGET_SIZE / 2,
                  h: TARGET_SIZE / 2,
                },
              }).start()
              viewport.snapZoom({
                center,
                width: TARGET_SIZE,
                forceStart: true,
                time: Graph.Layouts.grid.animationDuration + 500,
                removeOnComplete: true,
                removeOnInterrupt: true,
              })
            }

            break
          }
          case EVENT.MODE_CHANGED: {
            draft.mode = payload.value
            // localDataRef.current.targetNode.current = null
            break
          }
          case EVENT.CHANGE_DATA_NAME:
            targetDataList[index].name = payload.value
            break
          case EVENT.CHANGE_DATA_VALUE:
            targetDataList[index].value[payload.valueIndex] = getValueByType(
              dataItem.type!,
              payload.value,
            )
            break
          case EVENT.ADD_DATA_VALUE:
            targetDataList[index].value.push(payload.value)
            break
          case EVENT.DELETE_DATA_VALUE:
            targetDataList[index].value.splice(payload.valueIndex, 1)
            break
          case EVENT.DATA_VALUE_UP: {
            const { value } = targetDataList[index]
            const { length } = value
            const temporary = value[payload.valueIndex]
            const changeIndex = (payload.valueIndex === 0
              ? (length - 1)
              : (payload.valueIndex - 1)) % length
            value[payload.valueIndex] = value[changeIndex]
            value[changeIndex] = temporary
            break
          }
          case EVENT.DATA_VALUE_DOWN: {
            const { value } = targetDataList[index]
            const { length } = value
            const temporary = value[payload.valueIndex]
            const changeIndex = (payload.valueIndex + 1) % length
            value[payload.valueIndex] = value[changeIndex]
            value[changeIndex] = temporary
            break
          }
          case EVENT.DELETE_DATA:
            targetDataList.splice(index, 1)
            break

          case EVENT.CHANGE_DATA_NAME_ADDITIONAL: {
            const additionalItem = targetDataList[index]!.additional![payload.index]!
            additionalItem.name = payload.value
            break
          }
          case EVENT.CHANGE_DATA_VALUE_ADDITIONAL: {
            const additionalItem = targetDataList[index]!.additional![payload.index]
            targetDataList[index]!.additional![payload.index].value[payload.valueIndex] = getValueByType(
              additionalItem.type, payload.value,
            )
            break
          }
          case EVENT.ADD_DATA_ADDITIONAL:
            targetDataList[index]!.additional!.push(payload)
            break
          case EVENT.ADD_DATA_VALUE_ADDITIONAL: {
            targetDataList[index]!.additional![payload.index].value.push(payload.value)
            break
          }
          case EVENT.DELETE_DATA_VALUE_ADDITIONAL:
            targetDataList[index]!.additional![payload.index].value.splice(payload.valueIndex, 1)
            break
          case EVENT.DELETE_DATA_ADDITIONAL:
            targetDataList[index]!.additional!.splice(payload.index, 1)
            break
          case EVENT.TOGGLE_FILTER_BAR:
            draft.settingsBar!.opened = !draft.settingsBar?.opened
            break
          case EVENT.TOGGLE_DATA_BAR:
            draft.dataBar!.opened = !draft.dataBar?.opened
            break
          case EVENT.TOGGLE_ACTION_BAR:
            draft.actionBar!.opened = !draft.actionBar?.opened
            break
          case EVENT.IMPORT_DATA:
            R.mapObjIndexed((value, key) => {
              draft[key] = value
            })(payload.value)
            break
          case EVENT.IMPORT_EVENTS:
            closeAllBars(draft)
            draft.events = [...(payload.value ?? [])]
            break
          case EVENT.PLAY_EVENTS:
            closeAllBars(draft)
            draft.events = [...(payload.events ?? [])]
            break
          case EVENT.APPLY_EVENTS:
            payload.events.map((event) => onEvent(event))
            break
          case EVENT.EXPORT_DATA:
            download(JSON.stringify(payload.value), 'perfect-graph.json')
            break
          case EVENT.TOGGLE_RECORD:
            draft.actionBar.recording = !draft.actionBar?.recording
            break
          case EVENT.TOGGLE_RECORD_EVENTS:
            if (draft.actionBar?.eventRecording) {
              download(JSON.stringify(localDataRef.current.recordedEvents), 'recorded-events.json')
              localDataRef.current.recordedEvents = []
            }
            draft.actionBar.eventRecording = !draft.actionBar?.eventRecording
            break
          case EVENT.RECORD_FINISHED:
            download(eventInfo.payload.value, 'perfect-graph.mp4')
            break
          case EVENT.LAYOUT_CHANGED: {
            let layout
            if (payload.value.name) {
              layout = R.pickBy((val) => R.isNotNil(val))({
                ...GraphLayouts[payload.value.name],
                ...payload.value,
              })
            }
            draft.graphConfig.layout = layout
            break
          }
          case EVENT.SET_POSITIONS_IMPERATIVELY: {
            const {
              positions,
              oldLayout,
            } = payload
            positions.forEach((positionItem) => {
              graphEditor?.cy.$id(positionItem.elementId).position(positionItem.position)
            })
            draft.graphConfig.layout = oldLayout
            break
          }

          case EVENT.SET_NODE_LOCAL_LABEL: {
            const {
              value,
            } = payload
            draft.label.nodes[selectedItem.id] = value
            break
          }
          case EVENT.CLEAR_NODE_LOCAL_LABEL: {
            delete draft.label.nodes[selectedItem.id]
            break
          }
          case EVENT.TOGGLE_NODE_GLOBAL_LABEL_FIRST: {
            draft.label.isGlobalFirst.nodes = !draft.label?.isGlobalFirst?.nodes
            break
          }
          case EVENT.SET_NODE_GLOBAL_LABEL: {
            const {
              value,
            } = payload
            draft.label.global.nodes = value
            break
          }
          case EVENT.CLEAR_NODE_GLOBAL_LABEL: {
            delete draft.label.global.nodes
            break
          }
          case EVENT.SELECT_CLUSTER: {
            const {
              itemIds = [],
            } = payload
            const selectedClusters = draft.graphConfig?.clusters?.filter((cluster) => itemIds.includes(cluster.id))
            draft.selectedElementIds = R.concatAll(
              selectedClusters!.map((cluster) => cluster.ids),
            )
            break
          }
          case EVENT.DELETE_CLUSTER: {
            const {
              itemIds = [],
            } = payload
            draft.graphConfig.clusters = draft.graphConfig?.clusters?.filter((cluster) => !itemIds.includes(cluster.id))
            break
          }
          case EVENT.DELETE_CLUSTER_ELEMENT: {
            const {
              clusterId,
              elementIds = [],
            } = payload
            const selectedCluster = draft.graphConfig?.clusters?.find((cluster) => cluster.id === clusterId)
            selectedCluster.ids = selectedCluster?.ids.filter((id) => !elementIds.includes(id))
            break
          }
          case EVENT.CREATE_CLUSTER: {
            const {
              items = [],
            } = payload
            draft.graphConfig.clusters  = draft.graphConfig?.clusters?.concat(items)
            break
          }
          case EVENT.PRESS_ADD_CLUSTER_ELEMENT: {
            if (draft.mode === EDITOR_MODE.ADD_CLUSTER_ELEMENT) {
              draft.mode = EDITOR_MODE.DEFAULT
              return
            }
            draft.mode = EDITOR_MODE.ADD_CLUSTER_ELEMENT
            break
          }
          case EVENT.ADD_CLUSTER_ELEMENTS: {
            const {
              clusterId,
              elementIds,
            } = payload
            const selectedCluster = draft.graphConfig?.clusters?.find((cluster) => cluster.id === clusterId)
            selectedCluster.ids = R.union(selectedCluster?.ids, elementIds)
            break
          }
          case EVENT.CHANGE_CLUSTER_VISIBILITY: {
            const {
              clusterId,
              value,
            } = payload
            const selectedCluster = draft.graphConfig?.clusters?.find((cluster) => cluster.id === clusterId)
            selectedCluster.visible = value
            break
          }
          case EVENT.DELETE_HISTORY_ITEM: {
            const {
              itemIds = [],
            } = payload
            eventHistory.delete(eventHistory.getEventIdsByDoItemIds(itemIds))
            break
          }
          case EVENT.REORDER_HISTORY_ITEM: {
            const {
              fromIndex,
              toIndex,
            } = payload
            eventHistory.reorder(
              fromIndex,
              toIndex,
            )
            break
          }
          // case EVENT.CREATE_CLUSTER_BY_ALGORITHM: {
          // const {
          //   config = {},
          //   name,
          // } = payload
          // const clusterResult = Clusters[name].getByItem({
          //   cy: graphEditor?.cy,
          //   nodes: draft.nodes,
          //   edges: draft.edges,
          //   ...config,
          // })
          //   // draft.graphConfig.layout = oldLayout
          //   break
          // }
          case EVENT.REORDER_CLUSTER: {
            const {
              fromIndex,
              toIndex,
            } = payload
            draft.graphConfig!.clusters = R.reorder(
              fromIndex,
              toIndex,
              draft.graphConfig?.clusters,
            )
            break
          }
          case EVENT.CREATE_PLAYLIST: {
            const {
              items = [],
            } = payload
            draft.playlists = draft.playlists.concat(items)
            break
          }
          case EVENT.REORDER_PLAYLIST: {
            const {
              fromIndex,
              toIndex,
            } = payload
            draft.playlists = R.reorder(
              fromIndex,
              toIndex,
              draft.playlists,
            )
            break
          }
          case EVENT.DELETE_PLAYLIST: {
            const {
              itemIds = [],
            } = payload
            draft.playlists = draft.playlists.filter((playlist) => !itemIds.includes(playlist.id))
            break
          }
          default:
            break
        }
      } catch (error) {
        console.log('error', error)
      }
    })
  }, [])
  return [
    // @ts-ignore
    {
      ...state,
      ...(
        !_graphEditorRef
          ? { ref: localGraphEditorRef }
          : {}
      ),
      eventHistory: {
        currentIndex: eventHistory.record.currentIndex - 1,
        events: R.unnest(
          R.map((item) => item.do, eventHistory.record.items),
        ),
        undoEvents: R.unnest(
          R.map((item) => item.undo, eventHistory.record.items),
        ),
      },
      onEvent,
    } as Pick<GraphEditorProps, 'nodes' | 'edges' | 'onEvent' | 'graphConfig' | 'eventHistory'>,
    {
      update,
      onEvent,
    },
  ]
}

const getValueByType = (type: RDFType, value: string) => value

const DEFAULT_CONTROLLER_CONFIG: UseControllerData = {
  nodes: [],
  edges: [],
  label: {
    global: { nodes: ['id'], edges: ['id'] },
    nodes: {},
    edges: {},
    isGlobalFirst: false,
  } as GraphLabelData,
  actionBar: {
    opened: false,
  },
  dataBar: {
    opened: false,
  },
  settingsBar: {
    opened: false,
  },
  mode: EDITOR_MODE.DEFAULT as EditorMode,
  selectedElementIds: [] as string[] | null,
  graphConfig: {
    clusters: [],
  },
  playlists: [
    {
      id: R.uuid(),
      name: 'My playlist',
      events: MOCK_DATA.events,
    },
    {
      id: R.uuid(),
      name: 'My playlist2',
      events: MOCK_DATA.events,
    },
  ],
}
