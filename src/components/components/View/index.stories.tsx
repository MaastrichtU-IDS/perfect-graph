import React from 'react'
import { StageDecorator, createTemplate } from '@root/storybook'
import Component from './index'
import { Graph } from '@components'

export default {
  title: 'View',
  component: Component,
  decorators: [StageDecorator],
}


const Template = createTemplate(Component)

export const Default = Template.bind({})
Default.args = {
  style: { width: 100, height: 100 },
}

export const WithChild = Template.bind({})
WithChild.args = {
  style: { 
    width: 200, 
    height: 200,
    alignItems: 'center',
    justifyContent: 'center'
  },
  children: (
    <Graph.Text>Hello World!</Graph.Text>
  )
}
