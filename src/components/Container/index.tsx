import React from 'react'
import { PixiComponent } from '@inlet/react-pixi'
import * as PIXI from 'pixi.js'
import * as R from 'unitx/ramda'
import { dragTrack } from '@core/utils/events'
import {
  applyDefaultProps, preprocessProps,
} from '@utils'
import {
  PIXIFlexStyle, PIXIBasicStyle,
} from '@type'
import { Position } from 'unitx-ui/type'

export type ContainerProps = {
  style: PIXIFlexStyle & PIXIBasicStyle;
  children: React.ReactNode;
  draggable?: boolean;
  onDrag?: (param: Position) => void;
}

// export type Container = PIXI.Container & {
//   flex: boolean;
//   yoga: YogaLayout;
// }

const Container = PixiComponent<ContainerProps, PIXI.Container>('PIXIContainer', {
  create: ({
    onDrag, draggable = false,
  }) => {
    const instance = new PIXI.Container()
    instance.interactive = draggable
    R.when(
      R.isTrue,
      () => {
        const { onDown, onMove } = dragTrack((posDiff) => {
          const { parent: { scale } } = instance
          instance.x += posDiff.x / scale.x
          instance.y += posDiff.y / scale.y
          onDrag && onDrag({ x: instance.x, y: instance.y })
        })
        instance.on('pointerdown', (e: PIXI.InteractionEvent) => {
          // @ts-ignore
          const { x, y } = e.data.originalEvent
          onDown({ x, y })
        })
          .on('pointermove', (e: PIXI.InteractionEvent) => {
            // @ts-ignore
            const { x, y } = e.data.originalEvent
            onMove({ x, y })
          })
          // .on('pointertap', (e: PIXI.InteractionEvent) => {
          //   e.data.originalEvent.stopPropagation()
          //   e.data.originalEvent.preventDefault()
          // })
      },
    )(draggable)

    return instance
  },
  applyProps: (mutableInstance: PIXI.Container, oldProps, _props) => {
    const props = preprocessProps(_props)
    const {
      left = 0,
      top = 0,
      width,
      height,
    } = props.style ?? {}
    applyDefaultProps(
      mutableInstance,
      oldProps,
      props,
      {
        isFlex: false,
      },
    )
    mutableInstance.x = left
    mutableInstance.y = top
    width && (mutableInstance.width = width)
    height && (mutableInstance.height = height)
  },
})

export default Container

// wrapComponent<FlexContainerProps>(
//   FlexContainer,
// )
