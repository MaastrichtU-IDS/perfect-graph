import React from 'react'
import {Icon, IconProps} from '@components/Icon'
import {SpeedDial, SpeedDialAction} from '@mui/material'
import {View} from 'colay-ui'

const ICON_SIZE = 24

type Action = {
  name: string
  icon: Omit<IconProps, 'name'> & {name: string}
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}
export type SpeedDialCreatorProps = {
  actions: Action[]
}

export const SpeedDialCreator = (props: SpeedDialCreatorProps) => {
  const {actions} = props

  return (
    <View
      style={{
        width: ICON_SIZE,
        height: ICON_SIZE
      }}
    >
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        icon={<Icon name="settings" style={{fontSize: ICON_SIZE - 4}} />}
        FabProps={{
          style: {
            width: ICON_SIZE,
            height: ICON_SIZE,
            minWidth: ICON_SIZE,
            minHeight: ICON_SIZE
          },
          color: 'inherit'
        }}
        style={{
          width: ICON_SIZE,
          height: ICON_SIZE
        }}
        direction="left"
      >
        {actions.map(action => {
          const {icon, name, onClick} = action
          return (
            // @ts-ignore
            <SpeedDialAction
              key={name}
              tooltipTitle={name}
              tooltipPlacement="bottom"
              onClick={e => {
                e.stopPropagation()
                onClick?.(e)
              }}
              {...icon}
              icon={
                // @ts-ignore
                <Icon {...icon} />
              }
            />
          )
        })}
      </SpeedDial>
    </View>
  )
}
