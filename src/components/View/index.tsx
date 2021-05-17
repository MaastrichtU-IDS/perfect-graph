import React from 'react'
import { PixiComponent } from '@inlet/react-pixi'
import {  PropsWithRef } from 'colay-ui/type'
import { wrapComponent } from 'colay-ui'
import { useTheme } from '@core/theme'
import * as PIXI from 'pixi.js'
import * as C from 'colay/color'
import {
  applyDefaultProps, preprocessProps,
} from '@utils'
import {
  PIXIBasicStyle, PIXIShapeStyle, PIXIBasicProps,
} from '@type'

export type ViewProps = PIXIBasicProps & {
  style?: PIXIBasicStyle & PIXIShapeStyle;
  children?: React.ReactNode;
}

export type ViewType = React.FC<ViewProps>

export type ViewRef = PIXI.Graphics

const ViewPIXI = PixiComponent<ViewProps, PIXI.Graphics>('View', {
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
    const {
      style: {
        width = instance.width,
        height = instance.height,
        backgroundColor, //= props.theme!.palette.background.paper,
        borderRadius = 0,
        borderWidth = 0,
        borderColor = 'black',
      } = {},
    } = props
    instance.clear()
    if (backgroundColor) {
      instance.beginFill(C.rgbNumber(backgroundColor), C.getAlpha(backgroundColor))
      instance.lineStyle(borderWidth, C.rgbNumber(borderColor))
      const radius = width / 2
      if ((width === height) && (borderRadius >= radius)) {
        instance.drawCircle(radius, radius, radius)
      } else {
        instance.drawRoundedRect(0, 0, width, height, borderRadius)
      }
    }
    instance.endFill()
    applyDefaultProps(instance, oldProps, props)
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
// >
//   <FlexContainer style={rest.style}>
//     {children}
//   </FlexContainer>
// </ViewPIXI>
