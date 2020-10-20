// import React from 'react'
import { Button } from 'unitx-ui'
// import { ComponentType } from 'unitx-ui/type'
// import { Story } from '@storybook/react/types-6-0'
import { createTemplate } from '../../../storybook'

export default {
  title: 'Submit2',
  component: Button,
  // decorators: [StageDecorator],
}

// const createTemplate = <T,>(
//   Component: ComponentType<T>,
// ): Story<T> => (args: T) => (
//   <Component
//     {...args}
//   />
//   )

const Template = createTemplate(Button)
// const Template = (args) => (
//   <Button
//     color="error"
//     {...args}
//   />
// )

export const disabled = Template.bind({})
disabled.args = {
  /* the args you need here will depend on your component */
  children: 'Heyy',
}
