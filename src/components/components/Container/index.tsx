// @ts-nocheck
import React from 'react'
import { PixiComponent } from '@inlet/react-pixi'
// import { wrapComponent } from 'unitx-ui'
import * as PIXI from 'pixi.js'
import * as R from 'unitx/ramda'
// import { YogaLayout } from '@utils/addFlexLayout/flex-layout/YogaLayout'
import { dragTrack } from '@core/utils/events'
import { PIXIFlexStyle, PIXIBasicStyle } from '../../type'
import { applyDefaultProps, preprocessProps } from '../../utils'

export type ContainerProps = {
  style: PIXIFlexStyle & PIXIBasicStyle;
  children: React.ReactNode;
}

// export type Container = PIXI.Container & {
//   flex: boolean;
//   yoga: YogaLayout;
// }

const Container = PixiComponent<ContainerProps, PIXI.Container>('PIXIContainer', {
  create: ({
    onDrag, draggable,
  }) => {
    const instance = new PIXI.Container()
    /* eslint-disable functional/immutable-data, functional/no-expression-statement */
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
    /* eslint-enable functional/immutable-data, functional/no-expression-statement */

    return instance
  },
  applyProps: (mutableInstance: Container, oldProps, _props) => {
    const props = preprocessProps(_props)
    const {
      left,
      top,
      width,
      height,
    } = props.style ?? {}
    /* eslint-disable functional/immutable-data, functional/no-expression-statement */
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
    /* eslint-enable functional/immutable-data, functional/no-expression-statement */
  },
})

export default Container

// wrapComponent<FlexContainerProps>(
//   FlexContainer,
// )
