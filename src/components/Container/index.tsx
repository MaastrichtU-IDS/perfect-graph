import { dragTrack } from '@core/utils/events'
import {
  Container as PIXIReactContainer, PixiComponent
} from '@inlet/react-pixi'
import {
  PIXIBasicProps, PIXIDisplayObjectProps
} from '@type'
import {
  applyDefaultProps, getEventClientPosition, preprocessProps
} from '@utils'
import { Position, PropsWithRef } from 'colay-ui/type'
import { Enumerable } from 'colay/type'
import * as PIXI from 'pixi.js'
import React from 'react'

export type ContainerProps = PIXIBasicProps & PIXIDisplayObjectProps
& Omit<React.ComponentProps<typeof PIXIReactContainer>, 'children'> & {
  children: Enumerable<React.ReactNode>;
  /**
   * Gives drag functionality to the container.
   */
  draggable?: boolean;
  /**
   * Track drag events.
   */
  onDrag?: (param: Position) => void;
}

type ContainerPropsWithRef = PropsWithRef<
PIXI.Container,
ContainerProps
>

export type ContainerType = React.FC<ContainerPropsWithRef>
export type ContainerRef = PIXI.Container

/**
 * The container for PIXI objects. It facilitates drag operations.
 */
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
