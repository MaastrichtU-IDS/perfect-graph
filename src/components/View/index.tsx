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
    // const {
    //   width = instance.width,
    //   height = instance.height,
    //   fill = 0xffffff, 
    //   radius = 0,
    //   lineWidth = 0,
    //   lineFill = 0xffffff,
    //   alpha = 1,
    // } = props
    // instance.clear()
    // if (fill) {
    //   instance.beginFill(fill, alpha)
    //   instance.lineStyle(lineWidth, lineFill)
    //   const maxRadius = width / 2
    //   if ((width === height) && (radius >= maxRadius)) {
    //     instance.drawCircle(maxRadius, maxRadius, maxRadius)
    //   } else {
    //     instance.drawRoundedRect(0, 0, width, height, radius)
    //   }
    // }
    // instance.endFill()
    drawGraphics(instance, props)
    applyDefaultProps(instance, R.omit(['fill'], oldProps), R.omit(['fill'], props))
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
