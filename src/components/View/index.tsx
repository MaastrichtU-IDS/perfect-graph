import { ThemeProps, useTheme } from '@core/theme'
import { PixiComponent } from '@inlet/react-pixi'
import { PIXIBasicProps, PIXIBasicStyle, PIXIShapeStyle } from '@type'
import {
  applyDefaultProps, preprocessProps,
} from '@utils'
import { wrapComponent } from 'colay-ui'
import { PropsWithRef } from 'colay-ui/type'
import * as PIXI from 'pixi.js'
import React from 'react'
import * as R from 'colay/ramda'
import { drawGraphics } from '@components/Graphics'

export type ViewProps = PIXIBasicProps & {
  style?: PIXIBasicStyle & PIXIShapeStyle;
  children?: React.ReactNode;
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

export const View = wrapComponent<
PropsWithRef<PIXI.Container, ViewProps>
>(ViewElement, { isForwardRef: true })
