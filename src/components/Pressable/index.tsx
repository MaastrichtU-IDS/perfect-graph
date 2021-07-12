import React from 'react'
import * as PIXI from 'pixi.js'
import * as R from 'colay/ramda'
import { PIXIBasicStyle, PIXIShapeStyle } from '@type'
import { View, ViewProps } from '../View'

export type PressableProps = {
  style?: PIXIBasicStyle & PIXIShapeStyle;
  children?: React.ReactNode;
  buttonMode?: boolean;
} & ViewProps

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


