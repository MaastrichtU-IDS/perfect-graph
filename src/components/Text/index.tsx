import React from 'react'
import * as PIXI from 'pixi.js'
import * as R from 'colay/ramda'
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
      text = '', textStyle = {}, isSprite,
    } = processTextProps(props)
    const mutableInstance = new PIXI.Text(text, textStyle)
    return R.ifElse(
      R.isTrue,
      () => {
        mutableInstance.updateText(false)
        return new PIXI.Sprite(mutableInstance.texture)
      },
      R.always(mutableInstance),
    )(isSprite)
  },
  applyProps: (
    mutableInstance: PIXI.Text,
    oldProps,
    props,
  ) => {
    const { text: _, textStyle: __, ...oldPropsRest } = processTextProps(oldProps)
    const {
      text = '', textStyle = {}, isSprite, ...propsRest
    } = processTextProps(props)
    applyDefaultProps(
      mutableInstance,
      oldPropsRest,
      propsRest,
    )
    R.unless(
      R.isTrue,
      () => {
        mutableInstance.text = text
        mutableInstance.style = textStyle
      },
    )(isSprite)
  },
})

export type TextProps = {
  children: string;
  style?: TextStyle;
  isSprite?: boolean;
}

export const Text = (props: TextProps) => {
  const { children, ...rest } = props
  const theme = useTheme()
  return (
    <TextPIXI
      text={children}
      theme={theme}
      {...rest}
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
