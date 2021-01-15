import { createComponents } from 'unitx-docs-pack'
import { Stage } from '@inlet/react-pixi'
// @ts-ignore
import { Story as StoryType } from '@storybook/react/types-6-0'
import '@utils/addFlexLayout'
import React from 'react'
import { Div, useMeasure } from 'colay-ui'
import * as C from 'colay/color'
import * as Components from './components'

export const {
  components,
  MDX,
  // @ts-ignore
} = createComponents(Components)

export const StageDecorator = (Story: StoryType) => {
  const [ref, {width, height}] = useMeasure()
  return (
    <div
      ref={ref}
      style={{ width: '100%', height: '100%' }}
    >
      <Stage
        ref={ref}
        options={{
          width,
          height,
          resolution: 1,
          antialias: true,
          autoDensity: true,
          backgroundColor: C.rgbNumber('white'),
        }}
      >
        <ThemeProvider
          theme={DefaultTheme}
        >
          <Story />
        </ThemeProvider>
      </Stage>
    </div>
  )
}

export const createTemplate = <T>(
  Component: ComponentType<T>,
): StoryType<T> => (args: T) => (
  <Component
    {...args}
  />
  )
