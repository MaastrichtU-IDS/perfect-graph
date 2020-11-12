import { StageDecorator, createTemplate } from '@root/storybook'
import Component from './index'

export default {
  title: 'Text',
  component: Component,
  decorators: [StageDecorator],
}

const Template = createTemplate(Component)

export const Default = Template.bind({})
Default.args = {
  style: { width: 100, height: 100 },
  children: 'Hello from perfect-graph',
}
