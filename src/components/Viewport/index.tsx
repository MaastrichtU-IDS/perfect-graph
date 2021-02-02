import { PixiComponent, useApp } from '@inlet/react-pixi'
import * as R from 'colay/ramda'
import { Viewport as ViewportNative } from 'pixi-viewport'
import * as PIXI from 'pixi.js'
// import Cull from 'pixi-cull'
import React from 'react'
import { wrapComponent, useForwardRef } from 'colay-ui'
import { Position } from 'colay-ui/type'

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

}
type ViewportType = ViewportNative & {clickEvent: any; isClick: boolean}

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
      .drag()
      .pinch()
      .wheel()
    // to avoid dragging when onClick child
    viewport.on(
      'pointerdown',
      (e) => {
        if (e.target !== viewport) {
          viewport.plugins.pause('drag')
        }
        // const { x, y } = viewport.toWorld(e.data.global)
        viewport.isClick = true
        setTimeout(() => {
          viewport.isClick = false
        }, 250)
      },
    )
    viewport.on('pointerup', () => {
      viewport.plugins.resume('drag')
    })
    viewport.on('wheel', (data) => {
      // @ts-ignore
      data.event.preventDefault()
    })
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
    mutableViewport.removeListener('click', mutableViewport.clickEvent)
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
    mutableViewport.on('click', mutableViewport.clickEvent)
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
