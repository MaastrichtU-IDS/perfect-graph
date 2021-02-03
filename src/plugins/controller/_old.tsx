import React from 'react'
import {
  EditorMode,
  GraphLabelData, RDFType,
  DataItem, EventInfo,
} from '@type'
import { GraphEditorProps } from '@components/GraphEditor'
import {
  EVENT, ELEMENT_DATA_FIELDS, EDITOR_MODE,
} from '@utils/constants'
import GraphLayouts from '@core/layouts'
import { getSelectedItemByElement } from '@utils'
import { download } from 'colay-ui/utils'
import * as R from 'colay/ramda'

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
| 'graphConfig'
> & {
  onEvent?: (info: EventInfo, draft: ControllerState) => boolean;
}

export type UseControllerResult = [
  UseControllerData,
  {},
]

export const useController = (
  useControllerData: UseControllerData,
  options: ControllerOptions = {},
): UseControllerResult => {
  const controllerConfig: UseControllerData = React.useMemo<UseControllerData>(
    () => R.mergeDeepAll([
      DEFAULT_CONTROLLER_CONFIG,
      useControllerData,
    ]) as UseControllerData, [], // useControllerData
  )
  const [state, update] = React.useState<ControllerState>(
    controllerConfig,
  )
  const targetNodeRef = React.useRef(null)
  const onEvent = React.useCallback((eventInfo: EventInfo) => {
    const {
      type,
      element,
      extraData = {},
      index = 0,
      dataItem = {} as DataItem,
      graphEditor,
      // graphEditor,
    } = eventInfo
    const isNode = element?.isNode()
    const targetPath = isNode ? 'nodes' : 'edges'
    update((_state) => {
      const draft = R.clone(_state)
      const isAllowedToProcess = controllerConfig.onEvent?.(eventInfo, draft)
      if (isAllowedToProcess === false) {
        return draft
      }
      const {
        item,
        index: itemIndex,
      } = (element && getSelectedItemByElement(element, draft)) ?? {}
      const targetDataList = item?.data!// getSelectedItemByElement(element, draft).data

      switch (type) {
        case EVENT.UPDATE_DATA:
          item.data = extraData.value
          break
        case EVENT.ADD_DATA:
          targetDataList.push({
            ...extraData,
            value: [extraData.value],
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
          // targetDataList[index].name = extraData.value
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
            const position = extraData
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
          } else if (
            [EDITOR_MODE.ADD, EDITOR_MODE.CONTINUES_ADD].includes(draft.mode)
          ) {
            if (isNode) {
              if (targetNodeRef.current) {
                draft.edges.push({
                  id: R.uuid(),
                  source: targetNodeRef.current.id(),
                  target: element.id(),
                  data: {},
                })
                targetNodeRef.current = null
              } else {
                targetNodeRef.current = element
              }
            }
            if (!targetNodeRef.current && draft.mode === EDITOR_MODE.ADD) {
              draft.mode = EDITOR_MODE.DEFAULT
            }
          } else {
            element.select()
            draft.selectedElementId = item.id
          }
          

          break
        }
        case EVENT.MODE_CHANGED: {
          draft.mode = extraData.value
          targetNodeRef.current = null
          break
        }
        case EVENT.CHANGE_DATA_NAME:
          targetDataList[index].name = extraData.value
          break
        case EVENT.CHANGE_DATA_VALUE:
          targetDataList[index].value[extraData.valueIndex] = getValueByType(
            dataItem.type!,
            extraData.value,
          )
          break
        case EVENT.ADD_DATA_VALUE:
          targetDataList[index].value.push(extraData.value)
          break
        case EVENT.DELETE_DATA_VALUE:
          targetDataList[index].value.splice(extraData.valueIndex, 1)
          break
        case EVENT.DATA_VALUE_UP: {
          const { value } = targetDataList[index]
          const { length } = value
          const temporary = value[extraData.valueIndex]
          const changeIndex = (extraData.valueIndex === 0
            ? (length - 1)
            : (extraData.valueIndex - 1)) % length
          value[extraData.valueIndex] = value[changeIndex]
          value[changeIndex] = temporary
          break
        }
        case EVENT.DATA_VALUE_DOWN: {
          const { value } = targetDataList[index]
          const { length } = value
          const temporary = value[extraData.valueIndex]
          const changeIndex = (extraData.valueIndex + 1) % length
          value[extraData.valueIndex] = value[changeIndex]
          value[changeIndex] = temporary
          break
        }
        case EVENT.DELETE_DATA:
          targetDataList.splice(index, 1)
          break

        case EVENT.CHANGE_DATA_NAME_ADDITIONAL: {
          const additionalItem = targetDataList[index]!.additional![extraData.index]!
          additionalItem.name = extraData.value
          break
        }
        case EVENT.CHANGE_DATA_VALUE_ADDITIONAL: {
          const additionalItem = targetDataList[index]!.additional![extraData.index]
          targetDataList[index]!.additional![extraData.index].value[extraData.valueIndex] = getValueByType(
            additionalItem.type, extraData.value,
          )
          break
        }
        case EVENT.ADD_DATA_ADDITIONAL:
          targetDataList[index]!.additional!.push(extraData)
          break
        case EVENT.ADD_DATA_VALUE_ADDITIONAL: {
          // const additionalItem = targetDataList[index]!.additional![extraData.index]!
          // additionalItem.type === DATA_TYPE.number ? 0 : ''
          targetDataList[index]!.additional![extraData.index].value.push(extraData.value)
          break
        }
        case EVENT.DELETE_DATA_VALUE_ADDITIONAL:
          targetDataList[index]!.additional![extraData.index].value.splice(extraData.valueIndex, 1)
          break
        case EVENT.DELETE_DATA_ADDITIONAL:
          targetDataList[index]!.additional!.splice(extraData.index, 1)
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
          })(extraData.value)
          break
        case EVENT.EXPORT_DATA:
          download(JSON.stringify(extraData.value), 'perfect-graph.json')
          break
        case EVENT.TOGGLE_RECORD:
          draft.actionBar.recording = !draft.actionBar?.recording
          break
        case EVENT.RECORD_FINISHED:
          download(eventInfo.extraData.value, 'perfect-graph.mp4')
          break
        case EVENT.LAYOUT_SELECTED: {
          const animationDuration = draft.graphConfig.layout?.animationDuration ?? 5000
          draft.graphConfig.layout = GraphLayouts[extraData.value]
          draft.graphConfig.layout.animationDuration = animationDuration
          break
        }
        case EVENT.LAYOUT_CHANGED: {
          let layout
          if (extraData.value.name) {
            layout = R.pickBy((val) => R.isNotNil(val))({
              ...GraphLayouts[extraData.value.name],
              ...extraData.value,
            })
          }
          draft.graphConfig.layout = layout
          break
        }
        case EVENT.LAYOUT_ANIMATION_DURATION_CHANGED: {
          if (draft.graphConfig?.layout) {
            draft.graphConfig.layout.animationDuration = eventInfo.extraData.value
          }
          break
        }
        default:
          break
      }
      return draft
    })
  }, [])
  return [
    // @ts-ignore
    {
      ...state,
      onEvent,
    } as Pick<GraphEditorProps, 'nodes' | 'edges' | 'onEvent' | 'graphConfig'>,
    {
      update: (callback: (draft: ControllerState) => ControllerState) => {
        update((currState) => {
          const draft = R.clone(currState)
          return callback(draft)
        })
      },
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