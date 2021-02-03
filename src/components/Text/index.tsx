import React from 'react'
import * as PIXI from 'pixi.js'
import * as R from 'colay/ramda'
import { wrapComponent } from 'colay-ui'
import { PropsWithRef } from 'colay-ui/type'
import { PixiComponent } from '@inlet/react-pixi'
import { useTheme } from '@core/theme'
import * as C from 'colay/color'
import { applyDefaultProps } from '@utils'

type TextStyle = any

type TextPIXIProps = {
  text: string;
  style?: TextStyle;
  color?: string;
  isSprite?: boolean;
}
// dropShadow
// dropShadowAlpha
// dropShadowAngle
// dropShadowBlur
// dropShadowColor
// dropShadowDistance
const PositionStyleKeys = ['left', 'top', 'width', 'height']
const processTextProps = (props: TextPIXIProps) => {
  const { style = {} } = props
  return {
    ...props,
    style: R.pick(PositionStyleKeys)(style),
    textStyle: R.pipe(
      R.toPairs,
      R.map(
        ([key, value]: [string, any]) => R.cond([
          [R.equals('color'), () => (['fill', C.rgbNumber(value)])],
          [R.equals('textShadowColor'), () => (['dropShadowColor', C.rgbNumber(value)])],
          [R.equals('textShadowRadius'), () => (['dropShadowBlur', C.rgbNumber(value)])],
          [R.equals('textShadowOffset'), () => (['dropShadowDistance', R.values(value)?.[0]])],
          [R.T, R.always([key, value])],
        ])(key),
      ),
      R.fromPairs,
      R.cond([
        [
          R.anyPass([
            R.has('dropShadowColor'),
            R.has('dropShadowBlur'),
            R.has('dropShadowDistance'),
          ]),
          R.set(R.lensProp('dropShadow'), true),
        ],
        [
          R.T,
          R.identity,
        ],
      ]),
    )(R.omit([PositionStyleKeys])({ ...style })),
  }
}
const TextPIXI = PixiComponent<TextPIXIProps, PIXI.Text>('PIXIText', {
  create: (props) => {
    const {
      style = {},
    } = props
    const {
      text = '', textStyle = {}, isSprite,
    } = processTextProps({
      ...props,
      style: {
        color: props.theme.palette.text.primary,
        ...style,
      },
    })
    const pixiText = new PIXI.Text(text, textStyle)
    if (isSprite) {
      pixiText.updateText(false)
      const spriteText = new PIXI.Sprite(pixiText.texture)
      // spriteText.text = pixiText
      return spriteText
    }
    return pixiText
  },
  applyProps: (
    instance: PIXI.Text,
    oldProps,
    props,
  ) => {
    const {
      style = {},
    } = props
    const { text: _, textStyle: __, ...oldPropsRest } = processTextProps(oldProps)
    const {
      text = '', textStyle = {}, isSprite, ...propsRest
    } = processTextProps({
      ...props,
      style: {
        color: props.theme.palette.text.primary,
        ...style,
      },
    })
    applyDefaultProps(
      instance,
      oldPropsRest,
      propsRest,
    )
    if (isSprite) {
      const pixiText = new PIXI.Text(text, textStyle)
      pixiText.updateText(false)
      instance.texture = pixiText.texture
    } else {
      instance.text = text
      instance.style = textStyle
    }
  },
})

export type TextProps = {
  children: string;
  style?: TextStyle;
  isSprite?: boolean;
}

const TextElement = (
  props: TextProps,
  forwardedRef: React.ForwardedRef<PIXI.Text>,
) => {
  const { children, ...rest } = props
  const theme = useTheme()
  return (
    <TextPIXI
      ref={forwardedRef}
      text={children}
      theme={theme}
      {...rest}
    />
  )
}

export const Text = wrapComponent<
PropsWithRef<PIXI.Text, TextProps>
>(TextElement, { isForwardRef: true })

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
 *    <Graph.View
 *      style={{ width: 100, height: 100,}}
 *    >
 *      <Graph.Text
 *         style={{ fontSize: 20 }}
 *       >
 *        {data.city}
 *       </Graph.Text>
 *    </Graph.View>
 * )}
 * />
 * ```
 */
