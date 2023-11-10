import {useControllableProp, useStateWithCallback} from 'colay-ui'
import React from 'react'
import {Typography} from '@mui/material'
import {View} from 'colay-ui'

export type CollapsibleProps = {
  children: (params: {
    isOpen: boolean
    onOpen: () => void
    onClose: () => void
    onToggle: () => void
  }) => React.ReactElement
  isOpen?: boolean
  defaultIsOpen?: boolean
}

export const Collapsible = (props: CollapsibleProps) => {
  const {children, isOpen: _isOpen, defaultIsOpen = false} = props
  const [state, setState] = useStateWithCallback({
    isOpen: defaultIsOpen
  })
  const [, isOpen] = useControllableProp(_isOpen, state.isOpen)
  return children({
    isOpen,
    onOpen: () => setState({isOpen: true}),
    onClose: () => setState({isOpen: false}),
    onToggle: () => setState({isOpen: !state.isOpen})
  })
}

export const CollapsibleTitle = (props: any) => {
  const {onClick, children, style = {}, ...rest} = props
  return (
    <Typography
      variant="h6"
      fontSize={16}
      onClick={onClick}
      style={{
        userSelect: 'none',
        cursor: 'pointer',
        ...style
      }}
      {...rest}
    >
      {children}
    </Typography>
  )
}
export const CollapsibleContainer = (props: any) => {
  const {children} = props
  return (
    <View
      style={{
        paddingLeft: 4,
        paddingRight: 4
      }}
    >
      {children}
    </View>
  )
}
