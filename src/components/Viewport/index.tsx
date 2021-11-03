import { PixiComponent, useApp } from '@inlet/react-pixi'
import * as R from 'colay/ramda'
import { Viewport as ViewportNative } from 'pixi-viewport'
import * as PIXI from 'pixi.js'
import * as V from 'colay/vector'
// import Cull from 'pixi-cull'
import React from 'react'
import { wrapComponent, useForwardRef } from 'colay-ui'
import {
  getBoundingBox,
  getPointerPositionOnViewport,
  isMultipleTouches,
} from '@utils'
import { Position, BoundingBox } from 'colay/type'
import { drawGraphics } from '@components/Graphics'
import { ViewportType } from '@type'
import { Simple } from 'pixi-cull'

const QUALITY_LEVEL = {
  HIGH: 2,
  MEDIUM: 1,
  LOW: 0,
} as const

type NativeViewportProps = {
  app: PIXI.Application;
  width: number;
  height: number;
  onCreate?: (v: ViewportNative) => void;
  onPress?: (c: {
    nativeEvent: PIXI.InteractionEvent;
    position: Position;
  }) => void|undefined;
  zoom?: number;
  transform?: {
    x?: number;
    y?: number;
    scaleX?: number;
    scaleY?: number;
    rotation?: number;
    skewX?: number;
    skewY?: number;
    pivotX?: number;
    pivotY?: number;
  };
  onBoxSelectionStart: (c: {
    event: PIXI.InteractionEvent;
    startPosition: Position;
  }) => void;
  onBoxSelection: (c: {
    event: PIXI.InteractionEvent;
    startPosition: Position;
    endPosition: Position;
    boundingBox: BoundingBox;
  }) => void;
  onBoxSelectionEnd: (c: {
    event: PIXI.InteractionEvent;
    startPosition: Position;
    endPosition: Position;
    boundingBox: BoundingBox;
  }) => void;

}

const DEFAULT_EVENT_HANDLER = () => {}
const ReactViewportComp = PixiComponent('Viewport', {
  create: (props: NativeViewportProps) => {
    const {
      app: {
        renderer,
        ticker,
        stage,
      },
      height,
      width,
      onCreate,
      onBoxSelectionStart = DEFAULT_EVENT_HANDLER,
      onBoxSelection = DEFAULT_EVENT_HANDLER,
      onBoxSelectionEnd = DEFAULT_EVENT_HANDLER,
    } = props
    const viewport: ViewportType = new ViewportNative({
      screenWidth: width,
      screenHeight: height,
      worldWidth: width,
      worldHeight: height,
      ticker,
      interaction: renderer.plugins.interaction,
      passiveWheel: false,
      divWheel: renderer.view,
    }) as ViewportType
    onCreate?.(viewport)
    viewport.sortableChildren = true
    viewport
      .drag({ pressDrag: false })
      .pinch()
      .wheel({
        trackpadPinch: true,
        wheelZoom: false,
      })
    const localDataRef = {
      current: {
        boxSelection: {
          enabled: false,
          startPosition: null as Position | null,
          currentPosition: null as Position | null,
          boxElement: null as PIXI.Graphics | null,
        },
      },
    }
    // to avoid dragging when onClick child
    viewport.on(
      'pointerdown',
      (e) => {
        // const { metaKey } = e.data.originalEvent
        // BOX_SELECTION
        // @ts-ignore
        if (
          e.target === e.currentTarget
          && !isMultipleTouches(e)
        ) {
          // @ts-ignore
          const position = getPointerPositionOnViewport(viewport, e.data.originalEvent)
          localDataRef.current.boxSelection.startPosition = {
            x: position.x,
            y: position.y,
          }
          viewport.plugins.pause('drag')
        }
        // const { x, y } = viewport.toWorld(e.data.global)
        viewport.isClick = true
        setTimeout(() => {
          viewport.isClick = false
        }, 250)
      },
    )
    viewport.on('pointerup', (e) => {
      viewport.plugins.resume('drag')
      if (localDataRef.current.boxSelection.enabled) {
        const {
          boxElement,
          currentPosition,
          startPosition,
        } = localDataRef.current.boxSelection
        onBoxSelectionEnd({
          event: e,
          startPosition: startPosition!,
          endPosition: currentPosition!,
          boundingBox: getBoundingBox(startPosition!, currentPosition!),
        })
        viewport.removeChild(boxElement!)
        boxElement?.destroy()
      }
      localDataRef.current.boxSelection = {}
    })
    viewport.on('pointermove', (e) => {
      // const { metaKey } = e.data.originalEvent
      if (localDataRef.current.boxSelection.startPosition && !localDataRef.current.boxSelection.boxElement) {
        const position = getPointerPositionOnViewport(viewport, e.data.originalEvent)
        if (
          R.pipe(
            V.subtract(localDataRef.current.boxSelection.startPosition),
            V.length,
          )(position) > 20) {
          const boxElement = new PIXI.Graphics()
          viewport.addChild(boxElement!)
          localDataRef.current.boxSelection.boxElement = boxElement
          onBoxSelectionStart({
            event: e,
            startPosition: localDataRef.current.boxSelection.startPosition,
          })
          localDataRef.current.boxSelection.enabled = true
        }
      }
      if (localDataRef.current.boxSelection.enabled) {
        // @ts-ignore
        const position = getPointerPositionOnViewport(viewport, e.data.originalEvent)
        localDataRef.current.boxSelection.currentPosition = {
          x: position.x,
          y: position.y,
        }
        const {
          startPosition,
          currentPosition,
          boxElement: pBoxElement,
        } = localDataRef.current.boxSelection
        const boxElement = pBoxElement!
        const boundingBox = getBoundingBox(startPosition!, currentPosition!)
        onBoxSelection({
          event: e,
          endPosition: currentPosition!,
          startPosition: startPosition!,
          boundingBox,
        })
        boxElement.x = boundingBox.x
        boxElement.y = boundingBox.y
        drawGraphics(boxElement, {
          style: {
            width: boundingBox.width,
            height: boundingBox.height,
            backgroundColor: 'rgba(0,0,0,0)',
            borderColor: 'rgba(0,0,0,0.7)',
            borderWidth: 1 / viewport.scale.x,
          },
        })
      }
    })
    viewport.on('wheel', (data) => {
      // @ts-ignore
      data.event.preventDefault()
    })
    // viewport.on('drag', () => {
    //   console.log('DRAG')
    // })
    // viewport.on('drag-end', () => {
    //   console.log('DRAG_END')
    // })
    // viewport.on('pinch-end', () => {
    //   console.log('pinch_END')
    // })
    // viewport.on('snap-end', () => {
    //   console.log('snap_END')
    // })
    // viewport.on('zoom-end', () => {
    //   console.log('zoom_END')
    // })
    // viewport.on('snap-zoom-end', () => {
    //   console.log('snap-zoom_END')
    // })
    // viewport.on('wheel-end', () => {
    //   console.log('wheel_END')
    // })

    // PIXI CULL
    const cull = new Simple({
      dirtyTest: false,
    }) // new SpatialHash()
    cull.addList(viewport.children)
    cull.cull(viewport.getVisibleBounds())

    // cull whenever the viewport moves
    PIXI.Ticker.shared.add(() => {
      if (viewport.dirty) {
        cull.cull(viewport.getVisibleBounds())
        viewport.children.map((child) => {
          if (R.isFalse(child._visible)) {
            child.visible = child._visible
          }
        })
        viewport.dirty = false
      }
      // PERFORMANCE
      const visibleChildren = viewport.children.filter((child) => child.visible)
      const objectCount = visibleChildren.length
      const qualityLevel = objectCount < 150
        ? QUALITY_LEVEL.HIGH
        : (
          objectCount < 400
            ? QUALITY_LEVEL.MEDIUM
            : QUALITY_LEVEL.LOW
        )
      const traverse = (displayObject: PIXI.DisplayObject) => {
        if (displayObject instanceof PIXI.Sprite) {
          displayObject.forceToRender()
        }
        if (displayObject.children) {
          displayObject.children.forEach((child) => {
            traverse(child)
          })
        }
      }
      const update = () => {
        visibleChildren.forEach((child) => {
          traverse(child)
        })
      }
      if (viewport.qualityLevel !== qualityLevel) {
        viewport.oldQualityLevel = viewport.qualityLevel
        viewport.qualityLevel = qualityLevel
        viewport.qualityChanged = true
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
      if (viewport.qualityChanged && !viewport.moving) {
        viewport.qualityChanged = false
        if (viewport.oldQualityLevel < viewport.qualityLevel) {
          update()
        }
      }
    })
    // PIXI CULL
    return viewport
  },
  applyProps: (
    mutableViewport: ViewportType,
    oldProps,
    newProps,
  ) => {
    const {
      transform,
      onPress,
      zoom,
      width,
      height,
    } = newProps
    mutableViewport.resize(width, height)
    mutableViewport.removeListener('pointertap', mutableViewport.clickEvent)
    mutableViewport.clickEvent = (e: PIXI.InteractionEvent) => R.ifElse(
      R.equals(e.target),
      () => {
        const { x, y } = mutableViewport.toWorld(e.data.global)
        return R.when(
          R.equals(true),
          () => onPress?.({ nativeEvent: e, position: { x, y } }),
        )(mutableViewport.isClick)
      },
      R.identity,
    )(e.currentTarget)
    R.unless(
      R.equals(oldProps.zoom),
      () => mutableViewport.setZoom(zoom ?? 1, true),
    )(zoom)
    R.unless(
      R.equals(oldProps.transform),
      () => mutableViewport.setTransform(
        transform?.x,
        transform?.y,
        transform?.scaleX,
        transform?.scaleY,
        transform?.rotation,
        transform?.skewX,
        transform?.skewY,
        transform?.pivotX,
        transform?.pivotY,
      ),
    )(transform)
    mutableViewport.on('pointertap', mutableViewport.clickEvent)
    // return
  },
  didMount: () => {
  },
  willUnmount: () => {
  },
})

export type ViewportProps = {
  children?: React.ReactNode;
} & Omit<NativeViewportProps, 'app'>

function ViewportElement(props: ViewportProps, ref: React.ForwardedRef<ViewportType>) {
  const {
    children,
    ...rest
  } = props
  const app = useApp()
  const viewportRef = useForwardRef(ref, {})
  // Culling
  // const cull = React.useMemo(() => new Cull.Simple(), [])
  // React.useEffect(() => {
  //   cull.addList(viewportRef.current.children)
  //   cull.cull(viewportRef.current.getVisibleBounds())
  //   return () => {
  //     cull.removeList(viewportRef.current.children)
  //   }
  // }, [children])
  // React.useEffect(() => {
  //   /// Culling
  //   PIXI.Ticker.shared.add(() => {
  //     if (viewportRef.current.dirty) {
  //       cull.cull(viewportRef.current.getVisibleBounds())
  //       viewportRef.current.dirty = false
  //     }
  //   })
  // }, [])
  const keyboardRef = React.useRef({
    pressedKeys: {},
    intervalTimeout: null,
  })
  React.useEffect(() => {
    const keyDownListener = (e) => {
      if (document.body === e.target) {
        keyboardRef.current.pressedKeys[e.key] = true
        if (!keyboardRef.current.intervalTimeout) {
          const interval = setInterval(() => {
            const {
              current: {
                center,
              },
            } = viewportRef
            const {
              current: {
                pressedKeys,
              },
            } = keyboardRef
            const pointer = {
              x: 0,
              y: 0,
            }
            const MULTIPLIER = 30
            Object.keys(pressedKeys).map((key) => {
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
          keyboardRef.current.intervalTimeout = interval
        }
        // viewportRef.current.center =
      }
    }
    const keyUpListener = (e) => {
      clearInterval(keyboardRef.current.intervalTimeout)
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
    <ReactViewportComp
      ref={viewportRef}
      app={app}
      {...rest}
    >
      {children}
    </ReactViewportComp>
  )
}

export const Viewport = wrapComponent<ViewportProps>(
  ViewportElement, {
    isForwardRef: true,
  },
)
