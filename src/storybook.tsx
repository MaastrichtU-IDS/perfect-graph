import { Stage } from '@inlet/react-pixi'
import { Story as StoryType } from '@storybook/react/types-6-0'
import '@utils/addFlexLayout'
import React from 'react'
import { View } from 'react-native'
import { ThemeProvider, useLayout } from 'unitx-ui'
import { DefaultTheme } from 'unitx-ui/theme'
import { ComponentType } from 'unitx-ui/type'
import * as C from 'unitx/color'

export const StageDecorator = (Story: StoryType) => {
  const {
    onLayout, width, height,
  } = useLayout()
  return (
    <View
      onLayout={onLayout}
      style={{ width: '100%', height: '100%' }}
    >
      <Stage
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
    </View>
  )
}

export const createTemplate = <T,>(
  Component: ComponentType<T>,
): StoryType<T> => (args: T) => (
  <Component
    {...args}
  />
  )
