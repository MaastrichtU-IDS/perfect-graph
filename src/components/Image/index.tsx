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

// @ts-ignore
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
    if (
      (isUriSource && source.uri !== oldProps.source?.uri)
        || source !== oldProps.source
    ) {
      mutableInstance.texture = getTextureFromProps('Sprite', props)
    }
    // R.when(
    //   R.anyPass([
    //     R.always(isUriSource && source.uri !== oldProps.source?.uri),
    //     R.always(source !== oldProps.source),
    //   ]),
    //   () => {
    //     mutableInstance.texture = getTextureFromProps('Sprite', props)
    //   },
    //   source,
    // )
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

export const Image = wrapComponent<ImageProps>(ImageElement)
