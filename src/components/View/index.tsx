import React from 'react'
import { PixiComponent } from '@inlet/react-pixi'
import { Position, PropsWithRef } from 'colay-ui/type'
import { wrapComponent } from 'colay-ui'
import { useTheme } from '@core/theme'
import * as PIXI from 'pixi.js'
import * as C from 'colay/color'
import {
  applyDefaultProps, preprocessProps,
} from '@utils'
import { PIXIBasicStyle, PIXIShapeStyle, Theme } from '@type'

export type ViewProps = {
  style?: PIXIBasicStyle & PIXIShapeStyle;
  onDrag?: (pos: Position) => void;
  children?: React.ReactNode;
  theme?: Theme;
}

export type ViewType = React.FC<ViewProps>

const ViewPIXI = PixiComponent<ViewProps, PIXI.Graphics>('View', {
  create: () => {
    const instance = new PIXI.Graphics()
    // contextMenu
    // instance.contextMenu = createContextMenu({ items: contextMenu })
    // instance.on('rightclick', (e: PIXI.interaction.InteractionEvent) => {
    //   // @ts-ignore
    //   instance.contextMenu.onContextMenu(e.data.originalEvent)
    // })
    return instance
  },
  applyProps: (instance: PIXI.Graphics, oldProps, _props) => {
    const props = preprocessProps(_props)
    const {
      style: {
        width = 0,
        height = 0,
        backgroundColor = props.theme!.colors.primary,
        borderRadius = 0,
        borderWidth = 0,
        borderColor = 'black',
      } = {},
    } = props
    instance.clear()
    instance.beginFill(C.rgbNumber(backgroundColor), C.getAlpha(backgroundColor))
    instance.lineStyle(borderWidth, C.rgbNumber(borderColor))
    instance.drawRoundedRect(0, 0, width, height, borderRadius)
    instance.endFill()
    applyDefaultProps(instance, oldProps, props)
  },
})

const ViewElement = (
  props: ViewProps,
  forwardedRef: React.ForwardedRef<ViewType>,
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
 * ## Usage
 * To use View on Graph
 * Check example
 *
 * ```js live=true
 * <Graph
 *  style={{ width: '100%', height: 250 }}
 *  nodes={[
 *    {
 *      id: 1,
 *      position: { x: 10, y: 10 },
 *      data: { color: 'red' }
 *    },
 *    {
 *      id: 2,
 *      position: { x: 300, y: 10 },
 *      data: { color: 'blue' }
 *    },
 *  ]}
 *  edges={[
 *    { id: 51, source: 1, target: 2 }
 *  ]}
 *  renderNode={({ item: { data } }) => (
 *    <Graph.View
 *      style={{ width: 100, height: 100, backgroundColor: data.color }}
 *    />
 * )}
 * />
 * ```
 */
export const View = wrapComponent<
PropsWithRef<PIXI.Container, ViewProps>
>(ViewElement, { isForwardRef: true })
// >
//   <FlexContainer style={rest.style}>
//     {children}
//   </FlexContainer>
// </ViewPIXI>
