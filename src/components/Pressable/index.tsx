import React from 'react'
import { PropsWithRef } from 'colay-ui/type'
import * as PIXI from 'pixi.js'
import * as R from 'colay/ramda'
import { wrapComponent } from 'colay-ui'
import { Events } from '@utils'
import { PIXIBasicStyle, PIXIShapeStyle } from '@type'
import View from '../View'

export type PressableProps = {
  style?: PIXIBasicStyle & PIXIShapeStyle;
  children?: React.ReactNode;
  buttonMode?: boolean;
} & Events

// const PressablePIXI = PixiComponent<PressableProps, PIXI.Container>('PressablePIXI', {
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

export const Pressable = (props: PressableProps) => {
  const {
    // onLongPress,
    // onPress,
    // onDoublePress,
    // onHoverEnd,
    // onHoverStart,
    // onPressChange,
    // onPressEnd,
    // onPressMove,
    // onPressStart,
    buttonMode,
    ...rest
  } = props
  // const events = useEvents(
  //   R.omitBy(R.isNil, {
  //     onLongPress,
  //     onPress,
  //     onDoublePress,
  //     onHoverEnd,
  //     onHoverStart,
  //     onPressChange,
  //     onPressEnd,
  //     onPressMove,
  //     onPressStart,
  //   }),
  //   {
  //     extraData: [
  //       onLongPress,
  //       onPress,
  //       onDoublePress,
  //       onHoverEnd,
  //       onHoverStart,
  //       onPressChange,
  //       onPressEnd,
  //       onPressMove,
  //       onPressStart,
  //     ],
  //   },
  // )
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
      // {...events}
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
 *    <Graph.Pressable
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
 *    </Graph.Pressable>
 * )}
 * />
 * ```
 */
