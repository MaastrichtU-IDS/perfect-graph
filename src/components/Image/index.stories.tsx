import { StageDecorator, createTemplate } from '@root/storybook'
import Component from './index'

export default {
  title: 'Image',
  component: Component,
  decorators: [StageDecorator],
}

const Template = createTemplate(Component)

export const Default = Template.bind({})
// Default.parameters = {
//   async puppeteerTest(page) {
//     const element = await page.$('<some-selector>')
//     await element.click()
//     // expect(something).toBe(something);
//   },
// }
Default.args = {
  style: { width: 100, height: 100 },
  source: { uri: 'https://www.biography.com/.image/t_share/MTE4MDAzNDEwNTEzMDA0MDQ2/thomas-edison-9284349-1-402.jpg' },
}
