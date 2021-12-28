import { drawGraphics } from '@components/Graphics'
import { ThemeProps, useTheme } from '@core/theme'
import { Graphics as InletGraphics, PixiComponent } from '@inlet/react-pixi'
import {
  applyDefaultProps, preprocessProps,
} from '@utils'
import { wrapComponent } from 'colay-ui'
import { PropsWithRef } from '@type'
import * as R from 'colay/ramda'
import * as PIXI from 'pixi.js'
import React from 'react'

export type ViewProps = React.ComponentProps<typeof InletGraphics> & {
  children?: React.ReactNode;
  /**
   * Background color
   */
  fill?: number
  /**
   * Rectangle radius value
   */
  radius?: number
}

export type ViewType = React.FC<ViewProps>

export type ViewRef = PIXI.Graphics

// @ts-ignore
const ViewPIXI = PixiComponent<ViewProps & ThemeProps, PIXI.Graphics>('View', {
  create: () => {
    const instance = new PIXI.Graphics()
    // contextMenu
    // instance.contextMenu = createContextMenu({ items: contextMenu })
    // instance.on('rightclick', (e: PIXI.interaction.InteractionEvent) => {
    //   instance.contextMenu.onContextMenu(e.data.originalEvent)
    // })
    return instance
  },
  applyProps: (instance: PIXI.Graphics, oldProps, _props) => {
    const props = preprocessProps(_props)
    // @ts-ignore
    drawGraphics(instance, props)
    const EXCLUDE_KEYS = ['fill', 'width', 'height']
    applyDefaultProps(
      instance, 
      R.omit(EXCLUDE_KEYS, oldProps),
      R.omit(EXCLUDE_KEYS, props),
    )
  },
})

const ViewElement = (
  props: ViewProps,
  forwardedRef: React.ForwardedRef<ViewRef>,
) => {
  const theme = useTheme()
  return (
    <ViewPIXI
      ref={forwardedRef}
      theme={theme}
      {...props}
    />

  )
}

/**
 * The rectangle creator for PIXI.
 */
export const View = wrapComponent<
PropsWithRef<PIXI.Container, ViewProps>
// @ts-ignore
>(ViewElement, { isForwardRef: true })
