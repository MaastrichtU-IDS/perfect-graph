import * as R from 'colay/ramda'
import * as PIXI from 'pixi.js'
import { applyDefaultProps as nativeApplyDefaultProps } from '@inlet/react-pixi'
import { NativeEventMap } from 'colay-ui/type'
// import { Properties } from 'csstype'
// import * as C from 'colay/color'
import {
  Element, NodeData, EdgeData, ElementData,
  DisplayObjectWithYoga, NodeContext, EdgeContext,
  Cluster, EventInfo, GraphEditorRef, ControllerState,
} from '@type'
import { ELEMENT_DATA_FIELDS, PIXI_EVENT_NAMES, EVENT } from '@utils/constants'

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

// position: 'absolute',
//     width: 231,
//     height: 20,
//     left: 151,
//     top: 72,
//     fontFamily: 'Roboto',
//     fontStyle: 'italic',
//     fontWeight: '500',
//     fontSize: '8.66%',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'flex-start',
//     letterSpacing: 0,
//     textDecorationLine: 'none',
//     textTransform: 'lowercase',
//     color: 'rgba(255,255,255,1)',
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
    align: JUSTIFY_CONTENT[justifyContent ?? 'flex-start'],
    ...(fontFamily ? { fontFamily } : {}),
    ...(fontSize ? { fontSize: parseFloat(R.replace(fontSize, '%', '')) * width! } : {}),
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
// export const PIXI_EVENT_NAMES = {
//   onAdded: 'added',
//   onClick: 'click',
//   onMouseDown: 'mousedown',
//   onMouseMove: 'mousemove',
//   onMouseOut: 'mouseout',
//   onMouseOver: 'mouseover',
//   onMouseUp: 'mouseup',
//   onMouseUpOutside: 'mouseupoutside',
//   onPointerCancel: 'pointercancel',
//   onPointerDown: 'pointerdown',
//   onPointerMove: 'pointermove',
//   onPointerOut: 'pointerout',
//   onPointerOver: 'pointerover',
//   onPointerTap: 'pointertap',
//   onPointerUp: 'pointerup',
//   onPointerUpOutside: 'pointerupoutside',
//   onRemoved: 'removed',
//   onRightClick: 'rightclick',
//   onRightDown: 'rightdown',
//   onRightUp: 'rightup',
//   onRightUpOutside: 'rightupoutside',
//   onTap: 'tap',
//   onTouchCancel: 'touchcancel',
//   onTouchEnd: 'touchend',
//   onTouchEndoutside: 'touchendoutside',
//   onTouchMove: 'touchmove',
//   onTouchStart: 'touchstart',
// }

export type EventType = (e: PIXI.InteractionEvent) => void
export type Events = NativeEventMap

// export const processEventProps = (props: Record<string, any>) => {
//   const newProps = { ...props }
//   Object
//     .keys(PIXI_EVENT_NAMES)
//     .map((eventName) => {
//       // @ts-ignore
//       const domEventName = PIXI_EVENT_NAMES[eventName]
//       const callback = props[eventName]
//       if (callback) {
//         newProps[domEventName] = callback
//       }
//     })
//   return newProps
// }

export const applyEvents = (
  instance: PIXI.DisplayObject,
  props: Record<string, any>,
) => {
  Object
    .keys(PIXI_EVENT_NAMES)
    .map((eventName) => {
      // @ts-ignore
      const domEventName = PIXI_EVENT_NAMES[eventName]
      const callback = props[eventName]
      if (callback) {
        instance.on(domEventName, callback)
      }
    })
}

const processProps = (props: Record<string, any>) => {
  const newProps = { ...props }
  Object
    .keys(PIXI_EVENT_NAMES)
    .map((eventName) => {
      // @ts-ignore
      const domEventName = PIXI_EVENT_NAMES[eventName]
      const callback = props[eventName]
      if (callback) {
        newProps[domEventName] = callback
      }
    })
  return newProps
}

type ApplyDefaultPropsConfig = {
  isFlex?: boolean;
  rescaleToYoga?: boolean;
}

export const preprocessProps = <T extends Record<string, any>>(props: T): T => ({
  ...props,
})

export const applyDefaultProps = <P extends Record<string, any> >(
  instance: PIXI.Graphics | PIXI.DisplayObject,
  oldProps: P,
  // @ts-ignore
  newProps: P = {},
  config: ApplyDefaultPropsConfig = {
    isFlex: true,
    rescaleToYoga: false,
  },
) => {
  const mutableInstance = instance as DisplayObjectWithYoga
  const {
    isFlex = true,
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
    // mutableInstance.yoga.animationConfig = {
    //   time: 200,
    //   easing: (t) => t,
    // }
  }
  return nativeApplyDefaultProps(
    mutableInstance,
    processProps(oldProps),
    processProps(restProps),
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
  info: { nodes: NodeData[]; edges: EdgeData[]},
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

export const getLabel = (path: string[] = [], item: ElementData): string => {
  const firstKey = path[0]
  if (firstKey === ELEMENT_DATA_FIELDS.DATA) {
    const name = path[1]
    const foundDataItem = item.data?.find((dataItem) => dataItem.name === name)
    return foundDataItem?.value[0] ?? ''
  }
  return R.path(path)(item)
}

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

export const calculateObjectBoundsWithoutChildren = (container: PIXI.Container) => {
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
  const object = container.getChildAt(0)
  const children = object.removeChildren()
  if (object.width === 0) {
    children.forEach((child) => {
      object.addChild(child)
    })
    return {
      ...calculateObjectBoundsWithoutChildren(object),
      ...position,
    }
  }
  const box = {
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
    visible = visible && (cluster.visible ?? true)
  })
  return visible
}
// export const calculateDisplayObjectBounds = (object: PIXI.Container) => {
//   const box = object.getLocalBounds()
//   box.width = 45
//   box.height = 45
//   return {
//     // x: object.x + (box.x - object.pivot.x) * object.scale.x,
//     // y: object.y + (box.y - object.pivot.y) * object.scale.y,
//     width: box.width * object.scale.x,
//     height: box.height * object.scale.y,
//     x: object.x * object.scale.x,
//     y: object.y * object.scale.y,}
//   }
export const getNodeContextByElement = (element: Element): NodeContext => element.data(
  ELEMENT_DATA_FIELDS.CONTEXT,
)
export const getEdgeContextByElement = (element: Element): EdgeContext => element.data(
  ELEMENT_DATA_FIELDS.CONTEXT,
)
export const calculateVisibilityByContext = (
  context: EdgeContext | NodeContext,
): boolean => {
  const visibility = R.all(R.isTrue)(Object.values(context.settings.visibility))
  return visibility
}

// @ts-ignore
export const filterEdges = (nodes: {id: string}[]) => (
  edges: {source:string;target:string}[],
) => {
  const nodeMap = R.groupBy(R.prop('id'))(nodes)
  return R.filter(
    (edge) => nodeMap[edge.source] && nodeMap[edge.target],
  )(edges)
}

type GetUndoActionsSettings = {
  draft: ControllerState,
  graphEditor: GraphEditorRef
}
export const getUndoEvents = (events: EventInfo[], settings: GetUndoActionsSettings) => {
  const {
    draft,
    graphEditor,
  } = settings
  const addHistory = true
  const undoEvents: EventInfo[] = R.unnest(
    events.map((event): EventInfo[] => {
      const {
        elementId,
        type,
        payload,
      } = event
      const oldSelectedElementId = draft.selectedElementId
      const element = elementId
        ? graphEditor.cy.$id(`${elementId}`)
        : null
      const {
        item,
        index: itemIndex,
      } = (element && getSelectedItemByElement(element, draft)) ?? {}
      switch (type) {
        case EVENT.ADD_NODE:
          return [
            {
              type: EVENT.DELETE_NODE,
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
        case EVENT.DELETE_EDGE:
          return [
            {
              type: EVENT.ADD_EDGE,
              item,
            },
          ]

        case EVENT.LAYOUT_CHANGED:
          return [
            {
              type: EVENT.SET_POSITIONS_IMPERATIVELY,
              payload: {
                oldLayout: draft.graphConfig?.layout,
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
        case EVENT.CHANGE_THEME:
          return [
            {
              type: EVENT.CHANGE_THEME,
              payload: payload === 'dark' ? 'default' : 'dark',
            },
          ]
        case EVENT.ELEMENT_SELECTED:
          return oldSelectedElementId
            ? [
              {
                type: EVENT.ELEMENT_SELECTED,
                elementId: oldSelectedElementId,
                ...event,
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
        case EVENT.PRESS_BACKGROUND:
          return oldSelectedElementId
            ? [
              {
                ...event,
                elementId: oldSelectedElementId,
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
