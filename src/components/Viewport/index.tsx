import {drawGraphics} from '@components/Graphics'
import {Theme, useTheme} from '@core/theme'
import {PixiComponent, useApp} from '@inlet/react-pixi'
import {ViewportType} from '@type'
import {getBoundingBox, getPointerPositionOnViewport, isMultipleTouches} from '@utils'
import {useForwardRef, wrapComponent} from 'colay-ui'
import * as R from 'colay/ramda'
import {BoundingBox, Position} from 'colay/type'
import {Viewport as ViewportNative} from 'pixi-viewport'
import * as PIXI from 'pixi.js'
// import Cull from 'pixi-cull'
import React from 'react'
import Vector from 'victor'

type ViewportOnPressEvent = {
  /**
   * Original event
   */
  nativeEvent: PIXI.InteractionEvent
  /**
   * Event position
   */
  position: Position
}

export type ViewportOnPress = (event: ViewportOnPressEvent) => void | undefined

type NativeViewportProps = {
  /**
   * Current PIXI app instance
   */
  app: PIXI.Application
  width: number
  height: number
  /**
   * Theme for the viewport and its children
   */
  theme: Theme
  onCreate?: (v: ViewportNative) => void
  onPress?: ViewportOnPress
  zoom?: number
  /**
   * Scale, rotation and position of the viewport
   */
  transform?: {
    x?: number
    y?: number
    scaleX?: number
    scaleY?: number
    rotation?: number
    skewX?: number
    skewY?: number
    pivotX?: number
    pivotY?: number
  }
  /**
   * Event handler for box selection start
   */
  onBoxSelectionStart?: (c: {event: PIXI.InteractionEvent; startPosition: Position}) => void
  /**
   * Event handler for box selection
   */
  onBoxSelection?: (c: {
    event: PIXI.InteractionEvent
    startPosition: Position
    endPosition: Position
    boundingBox: BoundingBox
  }) => void
  /**
   * Event handler for box selection end
   */
  onBoxSelectionEnd?: (c: {
    event: PIXI.InteractionEvent
    startPosition: Position
    endPosition: Position
    boundingBox: BoundingBox
  }) => void
}

const DEFAULT_EVENT_HANDLER = () => {}
const ReactViewportComp = PixiComponent('Viewport', {
  create: (props: NativeViewportProps) => {
    const {
      app: {renderer, ticker},
      theme,
      height,
      width,
      onCreate,
      onBoxSelectionStart = DEFAULT_EVENT_HANDLER,
      onBoxSelection = DEFAULT_EVENT_HANDLER,
      onBoxSelectionEnd = DEFAULT_EVENT_HANDLER
    } = props
    const viewport: ViewportType = new ViewportNative({
      screenWidth: width,
      screenHeight: height,
      worldWidth: width,
      worldHeight: height,
      ticker,
      interaction: renderer.plugins.interaction,
      passiveWheel: false,
      divWheel: renderer.view
    }) as ViewportType
    onCreate?.(viewport)
    viewport.sortableChildren = true
    viewport.drag({pressDrag: false}).pinch().wheel({
      trackpadPinch: true,
      wheelZoom: false
    })
    const localDataRef = {
      current: {
        boxSelection: {
          enabled: false,
          startPosition: null as Position | null,
          currentPosition: null as Position | null,
          boxElement: null as PIXI.Graphics | null
        }
      }
    }
    // to avoid dragging when onClick child
    viewport.on('pointerdown', e => {
      // const { metaKey } = e.data.originalEvent
      // BOX_SELECTION
      // @ts-ignore
      if (e.target === e.currentTarget && !isMultipleTouches(e)) {
        // @ts-ignore
        const position = getPointerPositionOnViewport(viewport, e.data.originalEvent)
        localDataRef.current.boxSelection.startPosition = {
          x: position.x,
          y: position.y
        }
        viewport.plugins.pause('drag')
      }
      // const { x, y } = viewport.toWorld(e.data.global)
      viewport.isClick = true
      setTimeout(() => {
        viewport.isClick = false
      }, 250)
    })
    viewport.on('pointerup', e => {
      viewport.plugins.resume('drag')
      if (localDataRef.current.boxSelection.enabled) {
        const {boxElement, currentPosition, startPosition} = localDataRef.current.boxSelection
        onBoxSelectionEnd({
          event: e,
          startPosition: startPosition!,
          endPosition: currentPosition!,
          boundingBox: getBoundingBox(startPosition!, currentPosition!)
        })
        viewport.removeChild(boxElement!)
        boxElement?.destroy()
      }
      // @ts-ignore
      localDataRef.current.boxSelection = {}
    })
    viewport.on('pointermove', e => {
      // const { metaKey } = e.data.originalEvent
      if (localDataRef.current.boxSelection.startPosition && !localDataRef.current.boxSelection.boxElement) {
        const position = getPointerPositionOnViewport(viewport, e.data.originalEvent)
        // R.pipe(
        //   V.subtract(localDataRef.current.boxSelection.startPosition),
        //   V.length,
        // )(position)
        if (
          Vector.fromObject(position)
            .subtract(Vector.fromObject(localDataRef.current.boxSelection.startPosition))
            .length() > 20
        ) {
          const boxElement = new PIXI.Graphics()
          viewport.addChild(boxElement!)
          localDataRef.current.boxSelection.boxElement = boxElement
          onBoxSelectionStart({
            event: e,
            startPosition: localDataRef.current.boxSelection.startPosition
          })
          localDataRef.current.boxSelection.enabled = true
        }
      }
      if (localDataRef.current.boxSelection.enabled) {
        // @ts-ignore
        const position = getPointerPositionOnViewport(viewport, e.data.originalEvent)
        localDataRef.current.boxSelection.currentPosition = {
          x: position.x,
          y: position.y
        }
        const {startPosition, currentPosition, boxElement: pBoxElement} = localDataRef.current.boxSelection
        const boxElement = pBoxElement!
        const boundingBox = getBoundingBox(startPosition!, currentPosition!)
        onBoxSelection({
          event: e,
          endPosition: currentPosition!,
          startPosition: startPosition!,
          boundingBox
        })
        boxElement.x = boundingBox.x
        boxElement.y = boundingBox.y
        drawGraphics(boxElement, {
          width: boundingBox.width,
          height: boundingBox.height,
          alpha: 0,
          fill: theme.palette.text.primary,
          lineFill: theme.palette.text.primary,
          lineWidth: 1 / viewport.scale.x
        })
      }
    })
    viewport.on('wheel', data => {
      // @ts-ignore
      data.event.preventDefault()
    })
    // TODO: CULL and Adaptive Performance Optimizer
    // // PIXI CULL
    // const cull = new Simple({
    //   dirtyTest: false,
    // }) // new SpatialHash()
    // cull.addList(viewport.children)
    // cull.cull(viewport.getVisibleBounds())

    // // cull whenever the viewport moves
    // PIXI.Ticker.shared.add(() => {
    // Cull the viewport
    // if (viewport.dirty) {
    //   cull.cull(viewport.getVisibleBounds())
    //   viewport.children.map((child) => {
    //     if (R.isFalse(child._visible)) {
    //       child.visible = child._visible
    //     }
    //   })
    //   viewport.dirty = false
    // }
    // PERFORMANCE
    // const visibleChildren = viewport.children.filter((child) => child.visible)
    // const objectCount = visibleChildren.length
    // adjustVisualQuality(objectCount, viewport)

    // const traverse = (displayObject: PIXI.DisplayObject) => {
    //   // if (displayObject instanceof PIXI.Sprite) {
    //   //   displayObject.forceToRender()
    //   // }
    //   // if (displayObject.children) {
    //   //   displayObject.children.forEach((child) => {
    //   //     traverse(child)
    //   //   })
    //   // }
    //   const qualityLevelChanged = (
    //     displayObject.qualityLevel ?? QUALITY_LEVEL.LOW
    //   ) < viewport.qualityLevel
    //   if (
    //     displayObject instanceof PIXI.Sprite
    //     && qualityLevelChanged) {
    //     displayObject.qualityLevel = viewport.qualityLevel
    //     displayObject.forceToRender()
    //   }
    //   if (displayObject.children && qualityLevelChanged) {
    //     displayObject.children.forEach((child) => {
    //       traverse(child)
    //     })
    //   }
    // }
    // const update = () => {
    //   visibleChildren.forEach((child) => {
    //     traverse(child)
    //   })
    // }

    // // if (viewport.qualityChanged && !viewport.moving) {
    // //   viewport.qualityChanged = false
    // //   if (viewport.oldQualityLevel < viewport.qualityLevel) {
    // //     update()
    // //   }
    // // }
    // if (!viewport.moving) {
    //   update()
    // }
    // })
    // PIXI CULL
    // TODO: CULL and Adaptive Performance Optimizer
    return viewport
  },
  applyProps: (mutableViewport: ViewportType, oldProps, newProps) => {
    const {transform, onPress, zoom, width, height} = newProps
    mutableViewport.resize(width, height)
    mutableViewport.removeListener('pointertap', mutableViewport.clickEvent)
    mutableViewport.clickEvent = (e: PIXI.InteractionEvent) =>
      R.ifElse(
        R.equals(e.target),
        () => {
          const {x, y} = mutableViewport.toWorld(e.data.global)
          return R.when(R.equals(true), () => onPress?.({nativeEvent: e, position: {x, y}}))(mutableViewport.isClick)
        },
        R.identity
      )(e.currentTarget)
    R.unless(R.equals(oldProps.zoom), () => mutableViewport.setZoom(zoom ?? 1, true))(zoom)
    R.unless(R.equals(oldProps.transform), () =>
      mutableViewport.setTransform(
        transform?.x,
        transform?.y,
        transform?.scaleX,
        transform?.scaleY,
        transform?.rotation,
        transform?.skewX,
        transform?.skewY,
        transform?.pivotX,
        transform?.pivotY
      )
    )(transform)
    mutableViewport.on('pointertap', mutableViewport.clickEvent)
    // return
  },
  didMount: () => {},
  willUnmount: () => {}
})

export type ViewportProps = {
  children?: React.ReactNode
} & Omit<NativeViewportProps, 'app' | 'theme'>

function ViewportElement(props: Omit<ViewportProps, 'theme'>, ref: React.ForwardedRef<ViewportType>) {
  const {children, ...rest} = props
  const app = useApp()
  const viewportRef = useForwardRef(ref, {})
  const theme = useTheme()
  const keyboardRef = React.useRef({
    pressedKeys: {} as Record<string, boolean>,
    intervalTimeout: null as number | null
  })
  React.useEffect(() => {
    const keyDownListener = (e: KeyboardEvent) => {
      if (document.body === e.target) {
        keyboardRef.current.pressedKeys[e.key] = true
        if (!keyboardRef.current.intervalTimeout) {
          const interval = setInterval(() => {
            const {
              current: {center}
            } = viewportRef
            const {
              current: {pressedKeys}
            } = keyboardRef
            const pointer = {
              x: 0,
              y: 0
            }
            const MULTIPLIER = 30
            Object.keys(pressedKeys).map(key => {
              switch (key) {
                case 'ArrowRight':
                  pointer.x += MULTIPLIER
                  break
                case 'ArrowLeft':
                  pointer.x -= MULTIPLIER
                  break
                case 'ArrowUp':
                  pointer.y -= MULTIPLIER
                  break
                case 'ArrowDown':
                  pointer.y += MULTIPLIER
                  break

                default:
                  break
              }
            })
            const newCenter = new PIXI.Point(center.x + pointer.x, center.y + pointer.y)
            viewportRef.current.center = newCenter
          }, 5)
          keyboardRef.current.intervalTimeout = interval as unknown as number
        }
        // viewportRef.current.center =
      }
    }
    const keyUpListener = () => {
      clearInterval(keyboardRef.current.intervalTimeout!)
      keyboardRef.current.intervalTimeout = null
      keyboardRef.current.pressedKeys = {}
    }
    document.addEventListener('keydown', keyDownListener)
    document.addEventListener('keyup', keyUpListener)
    return () => {
      document.removeEventListener('keydown', keyDownListener)
      document.removeEventListener('keyup', keyUpListener)
    }
  }, [])
  return (
    <ReactViewportComp ref={viewportRef} app={app} theme={theme} {...rest}>
      {children}
    </ReactViewportComp>
  )
}

/**
 * The wrapper for Node and Edge Elements to provide drag, pinch, and zoom functionality.
 */
export const Viewport = wrapComponent<ViewportProps>(ViewportElement, {
  isForwardRef: true
})
