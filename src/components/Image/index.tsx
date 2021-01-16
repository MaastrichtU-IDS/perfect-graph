import React from 'react'
import { PixiComponent } from '@inlet/react-pixi'
import * as R from 'colay/ramda'
import { wrapComponent } from 'colay-ui'
import * as PIXI from 'pixi.js'
import {
  applyDefaultProps, getTextureFromProps, preprocessProps,
} from '@utils'
import { PIXIBasicStyle, PIXIShapeStyle } from '@type'

type ImageURISource = { uri: string}

export type ImageProps = {
  style: PIXIBasicStyle & PIXIShapeStyle;
  source: ImageURISource;
}

const ImagePIXI = PixiComponent<ImageProps, PIXI.Sprite>('Image', {
  create: (props: ImageProps) => {
    const instance = new PIXI.Sprite(getTextureFromProps('Sprite', props))
    return instance
  },
  applyProps: (mutableInstance: PIXI.Sprite, oldProps, _props) => {
    const props = preprocessProps(_props)
    const {
      // image,
      // texture,
      source,
      ...restProps
    } = props
    const isUriSource = R.has('uri')(source)
    R.when(
      R.anyPass([
        R.always(isUriSource && source.uri !== oldProps.source?.uri),
        R.always(source !== oldProps.source),
      ]),
      () => {
        mutableInstance.texture = getTextureFromProps('Sprite', props)
      },
      source,
    )
    applyDefaultProps(mutableInstance, oldProps, restProps, { rescaleToYoga: true })
  },
})

function ImageElement(props: ImageProps) {
  return (
    <ImagePIXI
      {...props}
    />
  )
}

/**
 * ## Usage
 * To use Image on Graph
 * Check example
 *
 * ```js live=true
 * <Graph
 *  style={{ width: '100%', height: 250 }}
 *  nodes={[
 *    {
 *      id: 1,
 *      position: { x: 10, y: 10 },
 *      data: {
 *        image: 'https://www.biography.com/.image/t_share/MTE4MDAzNDEwNTEzMDA0MDQ2/thomas-edison-9284349-1-402.jpg'
 *       }
 *    },
 *    {
 *      id: 2,
 *      position: { x: 300, y: 10 },
 *      data: {
 *        image: 'https://images.unsplash.com/photo-1552529232-9e6cb081de19?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60'
 *      }
 *    },
 *  ]}
 *  edges={[
 *    { id: 51, source: 1, target: 2 }
 *  ]}
 *  renderNode={({ item: { data } }) => (
 *    <Graph.Image
 *      style={{ width: 100, height: 100 }}
 *      source={{ uri: data.image }}
 *    />
 * )}
 * />
 * ```
 */
export const Image = wrapComponent<ImageProps>(ImageElement)
