import * as R from 'colay/ramda'
import * as C from 'colay/color'
import * as PIXI from 'pixi.js'
import { applyDefaultProps as nativeApplyDefaultProps } from '@inlet/react-pixi'
import { EventMap } from 'colay-ui/type'
import { BoundingBox, Position } from 'colay/type'
// import { Properties } from 'csstype'
// import * as C from 'colay/color'
import {
  Element, NodeData, EdgeData, ElementData,
  DisplayObjectWithYoga, NodeContext, EdgeContext,
  Cluster, EventInfo, GraphEditorRef, ControllerState,
  ViewportRef, LightEventInfo,
  EdgeElement, NodeElement,
} from '@type'
import {
  ELEMENT_DATA_FIELDS, EVENT,
  QUALITY_LEVEL,
} from '@constants'

// type Result = {
//   x: number;
//   y: number;
//   width: number;
//   height: number;
//   fill: number;
// }
// export const processStyle = (style: Properties): Result => {
//   const newStyle: Result = {} as Result
//   const _ = R.forEachObjIndexed((val: any, key: string) => {
//     let isNumber = true
//     if (R.isString(val) && R.includes(val, '%')) {
//       isNumber = false
//       val = (parseFloat(R.replace(val, '%', '')) / 100)
//     }
//     switch (key) {
//       case 'width':
//         newStyle.width = isNumber ? val : val * parent.width
//         break
//       case 'height':
//         newStyle.height = isNumber ? val : val * parent.height
//         break
//       case 'top':
//         newStyle.y = isNumber ? val : val * parent.height
//         break
//       case 'left':
//         newStyle.x = isNumber ? val : val * parent.width
//         break
//       case 'backgroundColor':
//         newStyle.fill = C.rgbNumber(val)
//         break
//       case 'borderRadius':
//         newStyle.radius = val
//         break
//       default:
//         break
//     }
//   }, style)
//   return newStyle
// }

export const processStyle = (props: any = {}, mutableInstance): any => {
  const { parent } = mutableInstance
  const {
    style = {},
  } = props
  const newProps: any = {}
  R.forEachObjIndexed((val: any, key: string) => {
    let isNumber = true
    if (R.is(String)(val) && R.includes(val, '%')) {
      isNumber = false
      val = (parseFloat(R.replace(val, '%', '')) / 100)
    }
    switch (key) {
      case 'width':
        newProps.width = isNumber ? val : val * parent.width
        break
      case 'height':
        newProps.height = isNumber ? val : val * parent.height
        break
      case 'top':
        newProps.y = isNumber ? val : val * parent.height
        break
      case 'left':
        newProps.x = isNumber ? val : val * parent.width
        break
      case 'backgroundColor':
        newProps.fill = C.rgbNumber(val)
        break
      case 'borderRadius':
        newProps.radius = val
        break
      default:
        break
    }
  }, style)
  return newProps
}

const JUSTIFY_CONTENT = {
  'flex-start': 'left',
  center: 'center',
  'flex-end': 'right',
}
export const processTextStyle = (style: {
  fontFamily?: string;
  fontWeight?: string;
  fontSize?: number;
  justifyContent?: keyof typeof JUSTIFY_CONTENT;
  color?: string;
  width?: number;
}) => {
  const {
    fontFamily,
    fontWeight,
    fontSize,
    justifyContent,
    color,
    width,
    // fontStyle,
    // letterSpacing,
    // textDecorationLine,
    // textTransform,
  } = style

  return new PIXI.TextStyle({
    // @ts-ignore
    align: JUSTIFY_CONTENT[justifyContent ?? 'flex-start'],
    ...(fontFamily ? { fontFamily } : {}),
    ...(fontSize ? { fontSize: parseFloat(R.replace(`${fontSize}`, '%', '')) * width! } : {}),
    ...(fontWeight ? { fontWeight: `${parseFloat(fontWeight)}` } : {}),
    fill: color, // gradient
    stroke: color,
    strokeThickness: 20,
    letterSpacing: 20,
    // dropShadow: true,
    // dropShadowColor: '#ccced2',
    // dropShadowBlur: 4,
    // dropShadowAngle: Math.PI / 6,
    // dropShadowDistance: 6,
    // wordWrap: true,
    // wordWrapWidth: 440,
  })
}

export type EventType = (e: PIXI.InteractionEvent) => void
export type Events = EventMap

export const applyEvents = (
  instance: PIXI.DisplayObject,
  props: Record<string, any>,
) => {
  
}

const processProps = (props: Record<string, any>, mutableInstance) => {
  return props
}

type ApplyDefaultPropsConfig = {
  isFlex?: boolean;
  rescaleToYoga?: boolean;
}

export const preprocessProps = <T extends Record<string, any>>(props: T): T => ({
  ...props,
})

export const IS_FLEX_DEFAULT = false

export const applyDefaultProps = <P extends Record<string, any> >(
  instance: PIXI.Graphics | PIXI.DisplayObject | PIXI.Container,
  oldProps: P,
  // @ts-ignore
  newProps: P = {},
  config: ApplyDefaultPropsConfig = {
    isFlex: IS_FLEX_DEFAULT,
    rescaleToYoga: false,
  },
) => {
  const mutableInstance = instance as DisplayObjectWithYoga
  const {
    isFlex = IS_FLEX_DEFAULT,
    rescaleToYoga = false,
  } = config
  const { style = {}, ...restProps } = newProps
  if (isFlex) {
    mutableInstance.flex = true // display === 'flex'
    mutableInstance.yoga.flexDirection = style?.flexDirection ?? 'column'
    mutableInstance.yoga.keepAspectRatio = R.equals(
      newProps.resizeMode,
      'contain',
    )
    // @TODO: was true
    mutableInstance.yoga.rescaleToYoga = rescaleToYoga
    mutableInstance.yoga.fromConfig(style)
  }
  // FOR CULLING
  mutableInstance._visible = newProps.visible
  // FOR CULLING
  return nativeApplyDefaultProps(
    mutableInstance,
    processProps(oldProps, mutableInstance),
    processProps(restProps, mutableInstance),
  )
}

/**
 * Helper util for fetching the texture from props
 * Can be either texture or image
 *
 * @param {string} elementType
 * @param {object} props
 * @returns {PIXI.Texture|null}
 */
export const getTextureFromProps = (elementType: string, pureProps: Record<string, any> = {}) => {
  const {
    source,
    ...rest
  } = pureProps
  const isUriSource = R.has('uri')(source)
  const props: Record<string, any> = {
    ...rest,
    ...(isUriSource ? ({ image: source.uri }) : ({ texture: source })),
  }
  const emitChange = () => requestAnimationFrame(() => {
    window.dispatchEvent(new CustomEvent('__REACT_PIXI_REQUEST_RENDER__'))
  })

  const check = (inType: any, validator: any) => {
    if (props.hasOwnProperty(inType)) {
      const valid = validator.typeofs.some((t: any) => typeof props[inType] === t)
        || validator.instanceofs.some((i: any) => props[inType] instanceof i)
      R.throwWhen([
        [R.always(!valid), R.always(`${elementType} ${inType} prop is invalid`)],
      ])('')
      return props[inType]
    }
  }

  if (props.texture) {
    R.throwWhen([
      [R.always(R.not(props.texture instanceof PIXI.Texture)), R.always(`${elementType} texture needs to be typeof \`PIXI.Texture\``)],
    ])('')
    return props.texture
  }
  const result = check('image', { typeofs: ['string'], instanceofs: [HTMLImageElement] })
      || check('video', { typeofs: ['string'], instanceofs: [HTMLVideoElement] })
      || check('source', {
        typeofs: ['string', 'number'],
        instanceofs: [HTMLImageElement, HTMLVideoElement, HTMLCanvasElement, PIXI.Texture],
      })

  R.throwWhen([
    [R.always(!result), R.always(`${elementType} could not get texture from props`)],
  ])('')

  const texture = PIXI.Texture.from(result)
  texture.once('update', emitChange)
  texture.once('loaded', emitChange)

  if (texture.valid) {
    emitChange()
  }

  return texture
}

export const getSelectedItemByElement = (
  element: Element,
  info: { nodes: NodeData[]; edges: EdgeData[] },
) => {
  const id = element.id()
  const isNode = element.isNode()
  const targetPath = isNode ? 'nodes' : 'edges'
  const index = info[targetPath].findIndex((targetItem: ElementData) => targetItem.id === id)
  return {
    item: info[targetPath][index] as NodeData | EdgeData,
    index: index as number,
  }
}

export const getSelectedElementInfo = (
  controllerState: ControllerState, graphEditor: GraphEditorRef,
) => {
  const itemIds = controllerState.selectedElementIds
  const selectedItemId = R.last(itemIds ?? [])
  const selectedElement = selectedItemId
    ? graphEditor.cy.$id(`${selectedItemId}`)
    : null
  if (!selectedElement) {
    return {}
  }
  const isNode = selectedElement.isNode()
  const targetPath = isNode ? 'nodes' : 'edges'
  const index = controllerState[targetPath].findIndex(
    (targetItem: ElementData) => targetItem.id === selectedItemId,
  )
  return {
    selectedItem: controllerState[targetPath][index],
    selectedElement,
    index,
    type: targetPath,
  }
}

export const getLabel = (path: string[] = [], item: ElementData): string => (R.isEmpty(path)
  ? item.id
  : (R.path([ELEMENT_DATA_FIELDS.DATA, ...path], item) ?? item.id))
// const firstKey = path[0]
// if (firstKey === ELEMENT_DATA_FIELDS.DATA) {
//   const name = path[1]
//   const foundDataItem = item.data?.find((dataItem) => dataItem.name === name)
//   return foundDataItem?.value[0] ?? ''
// }
// return R.path(path)(item)

export const readTextFile = async (blob: Blob, encoding?: string) => new Promise<string>(
  (res, rej) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      const { result } = reader
      // @ts-ignore
      res(result)
    })
    reader.addEventListener('error', (error) => {
      rej(error)
    })
    reader.readAsText(blob, encoding)
  },
)

export const calculateObjectBoundsWithoutChildren = (
  container: PIXI.Container,
): BoundingBox => {
  const position = {
    x: container.x * container.scale.x,
    y: container.y * container.scale.y,
  }
  if (container.children.length === 0) {
    return {
      ...position,
      width: 0,
      height: 0,
    }
  }
  const object = container.getChildAt(0) as PIXI.Container
  const children = object.removeChildren()
  if (object.width === 0) {
    children.forEach((child) => {
      object.addChild(child)
    })
    return {
      ...calculateObjectBoundsWithoutChildren(object),
      ...position,
    } as BoundingBox
  }
  const box: BoundingBox = {
    ...position,
    width: object.width * object.scale.x,
    height: object.height * object.scale.y,
  }
  children.forEach((child) => {
    object.addChild(child)
  })
  return box
}

export const getClusterVisibility = (id: string, clusters: Cluster[] = []) => {
  let visible = true
  clusters.forEach((cluster) => {
    if (cluster.ids.includes(id)) {
      visible = visible && !(cluster.visible ?? true)
    }
  })
  return visible
}

export const calculateVisibilityByContext = (
  element: EdgeElement | NodeElement,
): boolean => {
  const context = contextUtils.get(element)
  // const visibility = Object.values(context.settings.visibility).reduce(
  //   (acc, curr) => acc && curr,
  //   true,
  // )
  const visibility = R.all(R.isTrue)(Object.values(context.settings.visibility))
  // if (element.isEdge()) {
  //   const target = element.target()
  //   const source = element.source()
  //   return visibility && calculateVisibilityByContext(target)
  //   && calculateVisibilityByContext(source)
  // }
  return visibility
}

// @ts-ignore
export const filterEdges = (nodes: NodeData[]) => (
  edges: EdgeData[],
) => {
  const nodeMap = R.groupBy(R.prop('id'), nodes)
  return R.filter(
    (
      edge: EdgeData,
    ) => !!(nodeMap[edge.source] && nodeMap[edge.target]),
    edges,
  )
}

type GetUndoActionsSettings = {
  controllerState: ControllerState,
  graphEditor: GraphEditorRef
}
export const getUndoEvents = (events: EventInfo[], settings: GetUndoActionsSettings) => {
  const {
    controllerState,
    graphEditor,
  } = settings
  // const addHistory = true
  const undoEvents: LightEventInfo[] = R.unnest(
    events.map((event): LightEventInfo[] => {
      const {
        // elementId,
        type,
        payload,
      } = event
      const oldSelectedElementIds = controllerState.selectedElementIds
      const {
        selectedElement,
        selectedItem,
      } = getSelectedElementInfo(controllerState, graphEditor)
      switch (type) {
        case EVENT.ADD_CLUSTER_ELEMENT:
          return [
            {
              type: EVENT.DELETE_CLUSTER_ELEMENT,
              payload,
            },
          ]
        case EVENT.ADD_EDGE:
          return [
            {
              type: EVENT.DELETE_EDGE,
              payload,
            },
          ]
        case EVENT.ADD_NODE:
          return [
            {
              type: EVENT.DELETE_NODE,
              payload,
            },
          ]
        case EVENT.CHANGE_THEME:
          return [
            {
              type: EVENT.CHANGE_THEME,
              payload: {
                value: controllerState.actionBar?.theming?.value,
              },
            },
          ]
        case EVENT.CHANGE_CLUSTER_VISIBILITY:
          return [
            {
              type: EVENT.CHANGE_CLUSTER_VISIBILITY,
              payload: {
                ...payload,
                value: !payload.value,
              },
            },
          ]
        case EVENT.CLEAR_NODE_GLOBAL_LABEL:
          return [
            {
              type: EVENT.SET_NODE_GLOBAL_LABEL,
              payload: {
                value: controllerState.label!.global!.nodes!,
              },
            },
          ]
        case EVENT.CLEAR_NODE_LOCAL_LABEL:
          return [
            {
              type: EVENT.SET_NODE_LOCAL_LABEL,
              payload: {
                value: controllerState.label!.nodes[selectedItem!.id],
              },
            },
          ]
        case EVENT.CREATE_PLAYLIST:
          return [
            {
              type: EVENT.DELETE_PLAYLIST,
              payload: {
                itemIds: payload.items?.map((item) => item.id),
              },
            },
          ]
        case EVENT.CREATE_CLUSTER:
          return [
            {
              type: EVENT.DELETE_CLUSTER,
              payload: {
                itemIds: payload.items?.map((item) => item.id),
              },
            },
          ]
        case EVENT.DELETE_CLUSTER: {
          const {
            itemIds = [],
          } = payload
          const items = controllerState.graphConfig?.clusters?.filter(
            (cluster) => itemIds.includes(cluster.id),
          )
          return [
            {
              type: EVENT.CREATE_CLUSTER,
              payload: {
                items,
              },
            },
          ]
        }
        case EVENT.DELETE_CLUSTER_ELEMENT: {
          return [
            {
              type: EVENT.ADD_CLUSTER_ELEMENT,
              payload,
            },
          ]
        }

        case EVENT.DELETE_EDGE:
          return [
            {
              type: EVENT.ADD_EDGE,
              payload: {
                items: controllerState.edges!.filter(
                  (item) => payload.itemIds.includes(item.id),
                ),
              },
            },
          ]
        case EVENT.DELETE_NODE: {
          const {
            itemIds,
          } = payload
          const relatedEdges = controllerState.edges.filter(
            (edgeItem) => itemIds.includes(edgeItem.source)
            || itemIds.includes(edgeItem.target),
          )
          return [
            {
              type: EVENT.ADD_NODE,
              payload: {
                items: controllerState.nodes!.filter(
                  (item) => itemIds.includes(item.id),
                ).map((item) => {
                  const position = graphEditor.cy.$id(item.id).position()
                  return {
                    ...item,
                    position,
                  }
                }),
                edgeItems: relatedEdges,
              },
            },
          ] }
        case EVENT.DELETE_PLAYLIST:
          return [
            {
              type: EVENT.CREATE_PLAYLIST,
              payload: {
                items: controllerState.playlists!.filter(
                  (playlist) => payload.itemIds.includes(playlist.id),
                ),
              },
            },
          ]
        case EVENT.ELEMENT_SELECTED:
          return (oldSelectedElementIds && oldSelectedElementIds.length > 0)
            ? [
              {
                ...event,
                type: EVENT.ELEMENT_SELECTED,
                payload: {
                  itemIds: oldSelectedElementIds,
                },
              },
            ]
            : [
              {
                type: EVENT.PRESS_BACKGROUND,
                payload: {
                  x: graphEditor.viewport.center.x,
                  y: graphEditor.viewport.center.y,
                },
              },
            ]
        case EVENT.ELEMENT_SELECTED_WITH_ZOOM:
          return (oldSelectedElementIds && oldSelectedElementIds.length > 0)
            ? [
              {
                ...event,
                type: EVENT.ELEMENT_SELECTED,
                payload: {
                  itemIds: oldSelectedElementIds,
                },
              },
            ]
            : [
              {
                type: EVENT.PRESS_BACKGROUND,
                payload: {
                  x: graphEditor.viewport.center.x,
                  y: graphEditor.viewport.center.y,
                },
              },
            ]
        case EVENT.LAYOUT_CHANGED:
          return [
            {
              type: EVENT.SET_POSITIONS_IMPERATIVELY,
              payload: {
                oldLayout: controllerState.graphConfig?.layout,
                positions: graphEditor.cy.nodes().map((element) => ({
                  position: {
                    x: element.position().x,
                    y: element.position().y,
                  },
                  elementId: element.id(),
                })),
              },
            },
          ]

        case EVENT.MODE_CHANGED:
          return [
            {
              type: EVENT.MODE_CHANGED,
              payload: {
                value: controllerState.mode,
              },
            },
          ]

        case EVENT.PRESS_BACKGROUND:
          // @ts-ignore
          return oldSelectedElementIds
            ? [
              {
                ...event,
                payload: {
                  itemIds: oldSelectedElementIds,
                },
                type: EVENT.ELEMENT_SELECTED,
                event: {
                  data: {
                    originalEvent: {
                      metaKey: false,
                    },
                  },
                },
              },
            ]
            : []
        case EVENT.SET_NODE_GLOBAL_LABEL:
          return [
            {
              type: EVENT.SET_NODE_GLOBAL_LABEL,
              payload: {
                value: controllerState.label!.global!.nodes!,
              },
            },
          ]
        case EVENT.SET_NODE_LOCAL_LABEL:
          return [
            {
              type: EVENT.SET_NODE_LOCAL_LABEL,
              payload: {
                value: controllerState.label!.nodes[selectedItem!.id],
              },
            },
          ]
        case EVENT.UPDATE_DATA:
          return [
            {
              type: EVENT.UPDATE_DATA,
              payload: {
                value: selectedItem!.data,
              },
            },
          ]
        case EVENT.SET_POSITIONS_IMPERATIVELY:
          return [
            {
              type: EVENT.SET_POSITIONS_IMPERATIVELY,
              payload: {
                oldLayout: controllerState.graphConfig?.layout,
                positions: payload.positions.map(({ elementId }) => {
                  const element = graphEditor.cy.$id(`${elementId}`)
                  return {
                    position: {
                      x: element.position().x,
                      y: element.position().y,
                    },
                    elementId,
                  }
                }),

              },
            },
          ]
        default:
          break
      }
      return []
    }),
  )
  return {
    addHistory: !R.isEmpty(undoEvents),
    events: undoEvents,
  }
}

const throttleTimeTable: Record<string, number> = {}
export const throttle = (callback: (id: string)=> void, delay: number, _id?: string) => {
  const time = (new Date()).getTime()
  const id = _id ?? R.uuid()
  const diff = throttleTimeTable[id] ? (time - throttleTimeTable[id]) : time

  if (diff > delay) {
    throttleTimeTable[id] = time
    callback(id)
  }
}

export const isPositionInBox = (position: Position, box: BoundingBox) => {
  const {
    x,
    y,
  } = position
  const x_ = box.x + box.width
  const y_ = box.y + box.height
  const startPos = {
    x: box.x < x_ ? box.x : x_,
    y: box.y < y_ ? box.y : y_,
  }
  const endPos = {
    x: box.x < x_ ? x_ : box.x,
    y: box.y < y_ ? y_ : box.y,
  }
  return x >= startPos.x && y >= startPos.y && x <= endPos.x
  && y <= endPos.y
}

export const getBoundingBox = (
  startPos: Position, endPos: Position, abs = false,
) => {
  const width = endPos.x - startPos.x
  const height = endPos.y - startPos.y
  // const x = startPos.x < endPos.x ? startPos.x : endPos.x
  // const y = startPos.y < endPos.y ? startPos.y : endPos.y
  return {
    ...startPos,
    // x,
    // y,
    width: abs ? Math.abs(width) : width,
    height: abs ? Math.abs(height) : height,
  }
}

export const cyUnselectAll = (cy: cytoscape.Core) => {
  cy.elements(':selected').unselect()
}

export const getElementsCollectionByIds = (cy: cytoscape.Core, ids: string[]) => {
  let collection = cy.collection()
  ids.forEach((id) => {
    collection = collection.merge(cy.$id(id))
  })
  return collection
}

export const getPointerPositionOnViewport = (
  viewport: ViewportRef,
  event: MouseEvent,
) => {
  const position = getEventClientPosition(event)
  // @ts-ignore
  if (viewport.options.interaction) {
    // @ts-ignore
    viewport.options.interaction.mapPositionToPoint(position, position.x, position.y)
  }
  position.x /= viewport.scale.x
  position.y /= viewport.scale.y
  position.x += viewport.left
  position.y += viewport.top
  return position
}

export const getEventClientPosition = (e) => {
  const event = e.touches?.[0] ?? e.changedTouches?.[0] ?? e
  return {
    x: event.clientX,
    y: event.clientY,
  }
}

export const isMultipleTouches = (e) => {
  const touches = e.touches ?? e.changedTouches
  return touches && touches.length > 0
}

export const contextUtils = {
  update: (element: Element, context: any) => {
    element.data({
      [ELEMENT_DATA_FIELDS.CONTEXT]: context,
    })
  },
  get: (element: Element) => element.data(ELEMENT_DATA_FIELDS.CONTEXT),
  getNodeContext: (element: Element): NodeContext => element.data(
    ELEMENT_DATA_FIELDS.CONTEXT,
  ),
  getEdgeContext: (element: Element): EdgeContext => element.data(
    ELEMENT_DATA_FIELDS.CONTEXT,
  ),
}

export const getElementData = (element: Element) => element.data(ELEMENT_DATA_FIELDS.DATA)

export const getItemFromElement = (element: Element) => ({
  id: element.id(),
  data: getElementData(element),
})

export const pauseEvent = (e) => {
  if (e.stopPropagation) e.stopPropagation()
  if (e.preventDefault) e.preventDefault()
  e.cancelBubble = true
  e.returnValue = false
  return false
}

export const adjustVisualQuality = (objectCount: number, viewport: ViewportRef)=>{
  const qualityLevel = objectCount < 150
    ? QUALITY_LEVEL.HIGH
    : (
      objectCount < 400
        ? QUALITY_LEVEL.MEDIUM
        : QUALITY_LEVEL.LOW
    )
  if (viewport.qualityLevel !== qualityLevel) {
    viewport.oldQualityLevel = viewport.qualityLevel
    viewport.qualityLevel = qualityLevel
    // viewport.qualityChanged = true
    switch (qualityLevel) {
      case QUALITY_LEVEL.HIGH:
        // HIGH
        PIXI.settings.ROUND_PIXELS = true
        // @ts-ignore
        PIXI.settings.PRECISION_FRAGMENT = PIXI.PRECISION.HIGH
        PIXI.settings.RESOLUTION = 32// 64// window.devicePixelRatio
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR
        break
      case QUALITY_LEVEL.MEDIUM:
        PIXI.settings.ROUND_PIXELS = false// true
        // @ts-ignore
        PIXI.settings.PRECISION_FRAGMENT = PIXI.PRECISION.MEDIUM
        PIXI.settings.RESOLUTION = 12// 32// 64// window.devicePixelRatio
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
        break
      case QUALITY_LEVEL.LOW:
        PIXI.settings.ROUND_PIXELS = false
        // @ts-ignore
        PIXI.settings.PRECISION_FRAGMENT = PIXI.PRECISION.LOW
        PIXI.settings.RESOLUTION = 0.8// 32// 64// window.devicePixelRatio
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
        break
      default:
        break
    }
  }
}