import React from 'react'
import {
  EditorMode,
  GraphLabelData, RDFType,
  DataItem, EventInfo,
  GraphEditorRef,
  RecordedEvent,
} from '@type'
import { GraphEditorProps } from '@components/GraphEditor'
import { Graph } from '@components'
import {
  EVENT, ELEMENT_DATA_FIELDS, EDITOR_MODE,
} from '@utils/constants'
import GraphLayouts from '@core/layouts'
import { getSelectedItemByElement } from '@utils'
import { download } from 'colay-ui/utils'
import { useImmer } from 'colay-ui/hooks/useImmer'
import * as R from 'colay/ramda'
import { createHistory } from '@utils/createHistory'

type ControllerOptions = {
  // onEvent?: (info: EventInfo, draft: ControllerState) => boolean;
}
type ControllerState = {
  label: GraphLabelData;
} & Pick<
GraphEditorProps,
'nodes' | 'edges' | 'mode' | 'selectedElementId'
| 'actionBar' | 'dataBar' | 'settingsBar'
| 'graphConfig'
>

type UseControllerData = Pick<
GraphEditorProps,
'nodes'| 'edges' | 'mode'
| 'actionBar' | 'dataBar' | 'settingsBar'
| 'graphConfig' | 'events'
> & {
  onEvent?: (info: EventInfo, draft: ControllerState) => boolean;
}

// export type UseControllerResult = [
//   UseControllerData,
//   {},
// ]
const getUndoActions = (events: EventInfo[]) => {
  const addHistory = true
  const undoActions: EventInfo[] = R.unnest(
    events.map((event): EventInfo[] => {
      const {
        item,
        type,
      } = event
      switch (type) {
        case EVENT.ADD_NODE:
          return [
            {
              type: EVENT.DELETE_NODE,
              item,
            },
          ]
        case EVENT.DELETE_EDGE:
          return [
            {
              type: EVENT.ADD_EDGE,
              item,
            },
          ]
        case EVENT.DELETE_NODE:
          return [
            {
              type: EVENT.ADD_NODE,
              item,
            },
          ]
        case EVENT.LAYOUT_CHANGED:
          return [
            {
              type: EVENT.LAYOUT_CHANGED,
              payload
            },
          ]

        default:
          break
      }
      return []
    }),
  )
  return {
    addHistory,
    undoActions,
  }
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
  const history = React.useMemo(() => createHistory({
    onAction: (event) => {
      // const {
      //   actions,
      //   name,
      //   type
      // } = event
      console.log(event)
    },
  }), [])
  const [state, update] = useImmer(controllerConfig)
  const localGraphEditorRef = React.useRef(null)
  const graphEditorRef = _graphEditorRef ?? localGraphEditorRef
  // const [state, update] = React.useState<ControllerState>(
  //   controllerConfig,
  // )
  const localDataRef = React.useRef({
    recordedEvents: [] as RecordedEvent[],
    targetNode: null,
  })
  const onEvent = React.useCallback((eventInfo: EventInfo) => {
    const {
      type,
      payload = {},
      index = 0,
      dataItem = {} as DataItem,
      event,
      elementId,
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
        const recordableOriginalEvent = R.pickPaths([
          ['data', 'originalEvent', 'metaKey'],
        ])(event)
        if (!avoidHistoryRecording) {
          history.add({
            doActions: [
              {
                ...eventInfo,
                event: recordableOriginalEvent,
              },
            ],
            undoActions: [
              {
                ...eventInfo,
                event: recordableOriginalEvent,
              },
            ],
          })
        }
        if (
          draft.actionBar?.eventRecording
          && type !== EVENT.TOGGLE_RECORD_EVENTS
          && !avoidEventRecording
        ) {
          const lastEvent = R.last(localDataRef.current.recordedEvents)
          localDataRef.current.recordedEvents.push({
            type: '@',
            data: {
              ...eventInfo,
              event: recordableOriginalEvent,
            },
            date: new Date(),
            after: lastEvent ? new Date() - new Date(lastEvent.date) : 0,
          })
        }
        const isAllowedToProcess = controllerConfig.onEvent?.(eventInfo, draft)
        if (isAllowedToProcess === false) {
          return
        }
        const {
          item,
          index: itemIndex,
        } = (element && getSelectedItemByElement(element, draft)) ?? {}
        const targetDataList = item?.data!// getSelectedItemByElement(element, draft).data

        switch (type) {
          case EVENT.REDO_EVENT:
            history.redo()
            break
          case EVENT.UNDO_EVENT:
            history.undo()
            break
          case EVENT.UPDATE_DATA:
            item.data = payload.value
            break
          case EVENT.ADD_DATA:
            targetDataList.push({
              ...payload,
              value: [payload.value],
            })
            break
          case EVENT.MAKE_DATA_LABEL: {
            const newLabel = [ELEMENT_DATA_FIELDS.DATA, dataItem.name]
            const isSame = R.equals(draft.label[targetPath][item.id], newLabel)
            if (isSame) {
              delete draft.label[targetPath][item.id]
            } else {
              draft.label[targetPath][item.id] = newLabel
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
          case EVENT.PRESS_BACKGROUND: {
            if (
              // @ts-ignore
              [EDITOR_MODE.ADD, EDITOR_MODE.CONTINUES_ADD].includes(draft.mode)
            ) {
              const position = payload
              draft.nodes.push({
                id: `${draft.nodes.length + 1}`, // R.uuid(),
                position,
                data: [],
              })
              if (draft.mode === EDITOR_MODE.ADD) {
                draft.mode = EDITOR_MODE.DEFAULT
              }
            } else {
              draft.selectedElementId = null
              graphEditor.cy.$(':selected').unselect()
            }
            break
          }
          case EVENT.ELEMENT_SELECTED: {
            if (
              // @ts-ignore
              [EDITOR_MODE.DELETE, EDITOR_MODE.CONTINUES_DELETE].includes(draft.mode)
            ) {
              draft[targetPath].splice(itemIndex, 1)
              if (isNode) {
                draft.edges = draft.edges.filter(
                  (edgeItem) => edgeItem.source !== item.id && edgeItem.target !== item.id,
                )
              }
              if (draft.mode === EDITOR_MODE.DELETE) {
                draft.mode = EDITOR_MODE.DEFAULT
              }
              return
            }
            if (
              [EDITOR_MODE.ADD, EDITOR_MODE.CONTINUES_ADD].includes(draft.mode)
            ) {
              if (isNode) {
                if (localDataRef.current.targetNode) {
                  draft.edges.push({
                    id: R.uuid(),
                    source: localDataRef.current.targetNode.id(),
                    target: element.id(),
                    data: {},
                  })
                  localDataRef.current.targetNode = null
                } else {
                  localDataRef.current.targetNode = element
                }
              }
              if (!localDataRef.current.targetNode && draft.mode === EDITOR_MODE.ADD) {
                draft.mode = EDITOR_MODE.DEFAULT
              }
              return
            }
            graphEditor.cy.$(':selected').unselect()
            element.select()
            draft.selectedElementId = item.id
            if (event && event.data.originalEvent.metaKey) {
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
            localDataRef.current.targetNode.current = null
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
            draft.events = [...(payload.value ?? [])]
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
      onEvent,
    } as Pick<GraphEditorProps, 'nodes' | 'edges' | 'onEvent' | 'graphConfig'>,
    {
      update,
      onEvent,
    },
  ]
}

const getValueByType = (type: RDFType, value: string) => value

const DEFAULT_CONTROLLER_CONFIG = {
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
  selectedElementId: null as string | null,
  graphConfig: {},
}

// if (type === DATA_TYPE.number) {
//   try {
//     return Number.parseFloat(value)
//   } catch (error) {
//     // Toast.show({
//     //   color: 'danger',
//     //   text: 'Please enter number value!!!',
//     //   title: 'Error',
//     // })
//   }
// }
// return value
