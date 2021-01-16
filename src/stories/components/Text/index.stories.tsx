import { StageDecorator, createTemplate } from '@root/story'
import Component from '../../../src/components/Text/index'

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
