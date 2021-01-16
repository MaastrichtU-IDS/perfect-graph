import React from 'react'
import { StageDecorator } from '@root/stories'
import { Image } from '@components/Image'

export default {
  title: 'Image',
  component: Image,
  decorators: [StageDecorator],
}

export const Default = () => (
  <Image
    style={{ width: 100, height: 100 }}
    source={{ uri: 'https://www.biography.com/.image/t_share/MTE4MDAzNDEwNTEzMDA0MDQ2/thomas-edison-9284349-1-402.jpg' }}
  />
)
