import React from 'react'
import { TextStyle, StyleSheet } from 'react-native'
import * as PIXI from 'pixi.js'
import * as R from 'unitx/ramda'
import { PixiComponent } from '@inlet/react-pixi'
import { wrapComponent } from 'unitx-ui'
import * as C from 'unitx/color'
import { applyDefaultProps } from '@utils'

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
  const { style: defaultStyle = {}, color } = props
  const style = StyleSheet.flatten(defaultStyle)
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
    )(R.omit([PositionStyleKeys])({ ...style, color })),
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
    /* eslint-disable functional/immutable-data, functional/no-expression-statement */
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
    /* eslint-enable functional/immutable-data, functional/no-expression-statement */
  },
})

export type TextProps = {
  children: string;
  style?: TextStyle;
  isSprite?: boolean;
}

const Text = (props: TextProps) => {
  const { children, ...rest } = props
  return (
    <TextPIXI
      text={children}
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
export default wrapComponent<TextProps>(
  Text,
  {
    withTheme: true,
  },
)
