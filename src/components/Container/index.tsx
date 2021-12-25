import React from 'react'
import {
  PixiComponent,
  Container as PIXIReactContainer,
} from '@inlet/react-pixi'
import * as PIXI from 'pixi.js'
import { dragTrack } from '@core/utils/events'
import {
  applyDefaultProps,
  preprocessProps,
  getEventClientPosition,
} from '@utils'
import {
  PIXIFlexStyle,
  PIXIBasicStyle,
  PIXIDisplayObjectProps,
  PIXIBasicProps,
} from '@type'
import { Position, PropsWithRef } from 'colay-ui/type'
import { Enumerable } from 'colay/type'

export type ContainerProps = PIXIBasicProps & PIXIDisplayObjectProps
& Omit<React.ComponentProps<typeof PIXIReactContainer>, 'children'> & {
  style?: PIXIFlexStyle & PIXIBasicStyle;
  children: Enumerable<React.ReactNode>;
  draggable?: boolean;
  onDrag?: (param: Position) => void;
}

type ContainerPropsWithRef = PropsWithRef<
PIXI.Container,
ContainerProps
>

export type ContainerType = React.FC<ContainerPropsWithRef>
export type ContainerRef = PIXI.Container

// @ts-ignore
export const Container = PixiComponent<ContainerProps, PIXI.Container>(
  'PIXIContainer',
  {
    create: (props) => {
      const {
        onDrag,
        draggable = false,
        interactive = false,
      } = props
      const instance = new PIXI.Container()
      instance.interactive = interactive || draggable
      if (draggable) {
        const { onDown, onMove } = dragTrack((posDiff) => {
          const { parent: { scale } } = instance
          instance.x += posDiff.x / scale.x
          instance.y += posDiff.y / scale.y
          onDrag && onDrag({ x: instance.x, y: instance.y })
        })
        instance
          .on('pointerdown', (e: PIXI.InteractionEvent) => {
            const { originalEvent } = e.data
            const { x, y } = getEventClientPosition(originalEvent)// originalEvent as MouseEvent
            onDown({ x, y })
          })
          .on('pointermove', (e: PIXI.InteractionEvent) => {
            const { originalEvent } = e.data
            const { x, y } = getEventClientPosition(originalEvent)// originalEvent as MouseEvent
            onMove({ x, y })
          })
      }
      return instance
    },
    applyProps: (mutableInstance: PIXI.Container, oldProps, _props) => {
      const props = preprocessProps(_props)
      applyDefaultProps(
        mutableInstance,
        oldProps,
        props,
        {
          isFlex: false,
        },
      )
    },
  },
) as unknown as ContainerType
