import {Menu, MenuItem, Portal} from '@mui/material'
import {GraphEditorRef} from '@type'
import {Position} from 'colay/type'
import React from 'react'

export type ContextMenuProps = {
  onSelect?: (value: string) => void
  children?: React.ReactNode
  items?: {
    label: string
    value: string
  }[]
  open?: boolean
  position?: Position
  graphEditorRef: React.MutableRefObject<GraphEditorRef>
}

export const ContextMenu = (props: ContextMenuProps) => {
  const {onSelect, items = [], open, position = {x: 0, y: 0}} = props
  return (
    <Portal container={document.body}>
      <Menu
        open={!!open}
        onClose={() => onSelect?.('')}
        anchorReference="anchorPosition"
        anchorPosition={{
          left: position.x,
          top: position.y
        }}
      >
        {items.map(({value, label}) => (
          <MenuItem
            key={value}
            onClick={() => {
              onSelect?.(value)
            }}
          >
            {label}
          </MenuItem>
        ))}
      </Menu>
    </Portal>
  )
}
