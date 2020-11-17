import React from 'react'
import {
  GraphData, Element, EditorMode, GraphLabelData, RDFType,
  DataItem, EventInfo,
} from '@type'
import { GraphEditorProps } from '@components/GraphEditor'
import {
  EVENT, ELEMENT_DATA_FIELDS, EDITOR_MODE,
} from '@utils/constants'
import { getSelectedItemByElement } from '@utils'
import {
  useData,
} from 'unitx-ui'
import * as R from 'unitx/ramda'

type ControllerOptions = {
  onEvent?: (info: EventInfo, draft: ControllerState) => boolean;
}
type ControllerState = {
  label: GraphLabelData;
} & Pick<
GraphEditorProps,
'nodes' | 'edges' | 'mode' | 'selectedElement'
| 'actionBar' | 'dataBar' | 'filterBar'
>

export const useController = (data: GraphData, options: ControllerOptions = {}) => {
  const [state, update] = useData<ControllerState, void>({
    ...data,
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
    filterBar: {
      opened: false,
    },
    mode: EDITOR_MODE.DEFAULT as EditorMode,
    selectedElement: null as Element | null,
  }, {
    deps: [data],
  })

  const onEvent = React.useCallback((eventInfo: EventInfo) => {
    const {
      type,
      element,
      extraData = {},
      index = 0,
      dataItem = {} as DataItem,
    } = eventInfo
    const isNode = element?.isNode()
    const targetPath = isNode ? 'nodes' : 'edges'
    update((draft) => {
      const isAllowedToProcess = options.onEvent?.(eventInfo, draft)
      if (isAllowedToProcess === false) {
        return
      }
      const {
        item,
        index: itemIndex,
      } = (element && getSelectedItemByElement(element, draft)) ?? {}
      const targetDataList = item?.data!// getSelectedItemByElement(element, draft).data
      switch (type) {
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
          }
          break
        }
        case EVENT.MODE_CHANGED: {
          draft.mode = extraData.value
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
            break
          }
          element.select()
          draft.selectedElement = element
          break
        }
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
          draft.filterBar!.opened = !draft.filterBar?.opened
          break
        case EVENT.TOGGLE_DATA_BAR:
          draft.dataBar!.opened = !draft.dataBar?.opened
          break
        case EVENT.TOGGLE_ACTION_BAR:
          draft.actionBar!.opened = !draft.actionBar?.opened
          break
          // draft.
        default:
          break
      }
    })
  }, [update])
  return [
    {
      ...state,
      onEvent,
    } as Pick<GraphEditorProps, 'nodes' | 'edges' | 'onEvent'>,
    {},
  ]
}

const getValueByType = (type: RDFType, value: string) => value
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
