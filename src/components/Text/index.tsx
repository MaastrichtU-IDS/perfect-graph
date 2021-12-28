// import React from 'react'
// import * as PIXI from 'pixi.js'
// import { wrapComponent } from 'colay-ui'
// import { PropsWithRef } from 'colay-ui/type'
import { Text as ReactPIXIText } from '@inlet/react-pixi'
// import { PixiComponent,} from '@inlet/react-pixi'
// import { useTheme, ThemeProps } from '@core/theme'
// import * as C from 'colay/color'
// import { applyDefaultProps } from '@utils'

// type TextStyle = any

// type TextPIXIProps = {
//   text: string;
//   style?: TextStyle;
//   color?: string;
//   isSprite?: boolean;
// }
// dropShadow
// dropShadowAlpha
// dropShadowAngle
// dropShadowBlur
// dropShadowColor
// dropShadowDistance
// const PositionStyleKeys = ['left', 'top', 'width', 'height']
// const processTextProps = (props: TextPIXIProps) => {
//   const { style = {} } = props
//   return {
//     ...props,
//     style: R.pick(PositionStyleKeys)(style),
//     textStyle: R.pipe(
//       // @ts-ignore
//       R.toPairs,
//       R.map(
//         ([key, value]: [string, any]) => R.cond([
//           [R.equals('color'), () => (['fill', C.rgbNumber(value)])],
//           [R.equals('textShadowColor'), () => (['dropShadowColor', C.rgbNumber(value)])],
//           [R.equals('textShadowRadius'), () => (['dropShadowBlur', C.rgbNumber(value)])],
//           [R.equals('textShadowOffset'), () => (['dropShadowDistance', R.values(value)?.[0]])],
//           [R.T, R.always([key, value])],
//           // @ts-ignore
//         ])(key),
//       ),
//       R.fromPairs,
//       R.cond([
//         [
//           R.anyPass([
//             R.has('dropShadowColor'),
//             R.has('dropShadowBlur'),
//             R.has('dropShadowDistance'),
//           ]),
//           R.set(R.lensProp('dropShadow'), true),
//         ],
//         [
//           R.T,
//           R.identity,
//         ],
//       ]),
//       // @ts-ignore
//     )(R.omit([PositionStyleKeys])({ ...style })),
//   }
// }

// // @ts-ignore
// const TextPIXI = PixiComponent<TextPIXIProps & ThemeProps, PIXI.Text>('PIXIText', {
//   create: (props) => {
//     const {
//       style = {},
//       text = '', 
//       isSprite,
//     } = props
//     // processTextProps({
//     //   ...props,
//     //   style: {
//     //     color: props.theme.palette.text.primary,
//     //     ...style,
//     //   },
//     // })
//     const pixiText = new PIXI.Text(text, {
//       ...style,
//       fill: C.rgbNumber(style.fill ?? props.theme.palette.text.primary ),
//     })
//     if (isSprite) {
//       pixiText.updateText(false)
//       const spriteText = new PIXI.Sprite(pixiText.texture)
//       spriteText.pixiText = pixiText
//       // spriteText.text = pixiText
//       return spriteText
//     }
//     return pixiText
//   },
//   applyProps: (
//     instance: PIXI.Text,
//     oldProps,
//     props,
//   ) => {
//     const {
//       style = {},
//       text = '', 
//       isSprite,
//     } = props
//     instance.forceToRender = props.forceToRender
//     applyDefaultProps(
//       instance,
//       oldProps,
//       props,
//     )
//     const newStyle = {
//       ...style,
//       fill: C.rgbNumber(style.fill ?? props.theme.palette.text.primary ),
//     }
//     if (isSprite) {
//       // const pixiText = new PIXI.Text(text, {
//       //   ...style,
//       //   fill: C.rgbNumber(style.fill ?? props.theme.palette.text.primary ),
//       // })
//       // pixiText.updateText(false)
//       instance.pixiText.text = text
//       instance.style = newStyle
//       instance.texture = pixiText.texture
//     } else {
//       instance.text = text
//       instance.style = newStyle
//     }
//   },
// })

// export type TextProps = {
//   children: string;
//   style?: TextStyle;
//   isSprite?: boolean;
// }

// const TextElement = (
//   props: TextProps,
//   forwardedRef: React.ForwardedRef<PIXI.Text>,
// ) => {
//   const { children, ...rest } = props
//   const theme = useTheme()
//   const [count, setCount] = React.useState(0)
//   return (
//     <TextPIXI
//       ref={forwardedRef}
//       text={children}
//       theme={theme}
//       forceToRender={() => setCount((c) => c + 1)}
//       {...rest}
//     />
//   )
// }

/**
 * [PIXI.Text React Component]{@link https://reactpixi.org/components/text}
 */
export const Text = ReactPIXIText
// export const Text = wrapComponent<
// PropsWithRef<PIXI.Text, TextProps>
// >(TextElement, { isForwardRef: true })
