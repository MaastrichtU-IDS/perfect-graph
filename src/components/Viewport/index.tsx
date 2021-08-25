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
      .wheel({ trackpadPinch: true, wheelZoom: false })
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
            borderWidth: 1,
          },
        })
      }
    })
    viewport.on('wheel', (data) => {
      // @ts-ignore
      data.event.preventDefault()
    })

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
        viewport.dirty = false
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
