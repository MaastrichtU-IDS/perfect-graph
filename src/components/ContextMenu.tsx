import React from 'react'
import { Position } from 'unitx/type'
import { GraphEditorRef } from '@type'
import { useTheme } from '@core/theme'
import { View } from './View'
import { Text } from './Text'

export type ContextMenuProps = {
  onSelect?: (value: string) => void;
  children?: React.ReactNode;
  items?: {
    label: string; value: string;
  }[]
  open?: boolean;
  position?: Position;
  graphEditorRef: React.MutableRefObject<GraphEditorRef>
}

const DEFAULT_FONT_SIZE = 20
const WIDTH = 540
export const ContextMenu = (props: ContextMenuProps) => {
  const {
    children,
    onSelect,
    items = [],
    open,
    position,
    graphEditorRef,
  } = props
  const theme = useTheme()
  return open && (
    <View
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        backgroundColor: 'white', // theme.palette.text.primary,
        height: 420,
        width: WIDTH,
      }}
    >
      {
        items.map(({ value, label }) => (
          <View
            key={value}
            interactive
            buttonMode
            click={() => onSelect?.(value)}
          >
            <Text
              style={{
                fontSize: DEFAULT_FONT_SIZE * (1 / graphEditorRef.current.viewport.scale.x),
              }}
            >
              {label}
            </Text>
            <View
              style={{
                width: WIDTH,
                height: 2,
                backgroundColor: theme.palette.text.primary,
                marginBottom: 5
              }}
            />
          </View>
        ))
      }
      {children}
    </View>
  )
}
