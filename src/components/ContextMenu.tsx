import React from 'react'
import { Position } from 'colay/type'
import { GraphEditorRef } from '@type'
import {
  Menu,
  MenuItem,
  Portal,
} from '@mui/material'

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
    position = { x: 0, y: 0 },
    graphEditorRef,
  } = props
  return (
    <Portal container={document.body}>
      <Menu
        open={open}
        onClose={() => onSelect?.()}
        anchorReference="anchorPosition"
        anchorPosition={{
          left: position.x,
          top: position.y,
        }}
      >
        {
          items.map(({ value, label }) => (
            <MenuItem
              key={value}
              onClick={() => {
                onSelect?.(value)
              }}
            >
              {label}
            </MenuItem>
          ))
        }
      </Menu>
    </Portal>

  )
}
