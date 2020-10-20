import React from 'react'
import { PropsWithRef } from 'unitx-ui/type'
import useEvents from 'unitx-ui/hooks/useEvents'
import * as PIXI from 'pixi.js'
import * as R from 'unitx/ramda'
import { wrapComponent } from 'unitx-ui'
import { Events } from '../../utils'
import View from '../View'
import { PIXIBasicStyle, PIXIShapeStyle } from '../../type'

export type TouchableProps = {
  style?: PIXIBasicStyle & PIXIShapeStyle;
  children?: React.ReactNode;
  buttonMode?: boolean;
} & Events

// const TouchablePIXI = PixiComponent<TouchableProps, PIXI.Container>('TouchablePIXI', {
//   create: () => {
//     const mutableInstance = new PIXI.Container()
//     mutableInstance.interactive = true
//     mutableInstance.buttonMode = true
//     return mutableInstance
//   },
//   applyProps: (
//     instance: PIXI.Graphics,
//     oldProps,
//     _props,
//   ) => applyDefaultProps(instance, oldProps, preprocessProps(_props))
//   ,
// })

function Touchable(props: TouchableProps) {
  const {
    onLongPress,
    onPress,
    onDoublePress,
    onHoverEnd,
    onHoverStart,
    onPressChange,
    onPressEnd,
    onPressMove,
    onPressStart,
    buttonMode,
    ...rest
  } = props
  const events = useEvents(
    R.omitBy(R.isNil, {
      onLongPress,
      onPress,
      onDoublePress,
      onHoverEnd,
      onHoverStart,
      onPressChange,
      onPressEnd,
      onPressMove,
      onPressStart,
    }),
    {
      extraData: [
        onLongPress,
        onPress,
        onDoublePress,
        onHoverEnd,
        onHoverStart,
        onPressChange,
        onPressEnd,
        onPressMove,
        onPressStart,
      ],
    },
  )
  const viewRef = React.useRef<PIXI.Container>(null)
  React.useEffect(() => {
    R.when(
      R.isNotNil,
      () => {
        const mutableContainer = viewRef.current as PIXI.Container
        mutableContainer.buttonMode = !!buttonMode
        mutableContainer.interactive = true
      },
    )(viewRef.current)
  }, [viewRef, buttonMode])
  return (
    <View
      ref={viewRef}
      {...rest}
      {...events}
    />
  )
}

/**
 * ## Usage
 * To use Text on Graph
 * Check example
 *
 * ```js live=true
 * <Graph
 *  style={{ width: '100%', height: 250 }}
 *  nodes={[
 *    {
 *      id: 1,
 *      position: { x: 10, y: 10 },
 *      data: { city: 'Amsterdam' }
 *    },
 *    {
 *      id: 2,
 *      position: { x: 300, y: 10 },
 *      data: { city: 'Maastricht' }
 *    },
 *  ]}
 *  edges={[
 *    { id: 51, source: 1, target: 2 }
 *  ]}
 *  renderNode={({ item: { data } }) => (
 *    <Graph.Touchable
 *      onPress={() => alert('Pressed!!')}
 *      onLongPress={() => alert('LongPressed!!')}
 *    >
*       <Graph.View
 *         style={{ width: 100, height: 100,  }}
 *       >
 *         <Graph.Text
 *            style={{ fontSize: 18 }}
 *          >
 *           {data.city}
 *          </Graph.Text>
 *       </Graph.View>
 *    </Graph.Touchable>
 * )}
 * />
 * ```
 */
export default wrapComponent<
PropsWithRef<{}, TouchableProps>
>(
  Touchable,
  {},
)
