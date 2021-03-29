import React from 'react'
import { Icon, IconProps } from '@components/Icon'
import { IconButton, SpeedDial, SpeedDialAction } from '@material-ui/core'
import {
  View,
} from 'colay-ui'

const ICON_SIZE = 24

type Action = {
  name: string;
  icon: IconProps;
  onClick: (e: MouseEvent) => void
}
export type SpeedDialCreatorProps = {
  actions: Action[];
}

export const SpeedDialCreator = (props: SpeedDialCreatorProps) => {
  const {
    actions,
  } = props

  return (
    <View
      style={{
        width: ICON_SIZE,
        height: ICON_SIZE,
      }}
    >
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        icon={(
          <Icon
            name="settings"
            style={{ fontSize: ICON_SIZE - 4 }}
          />
)}
        FabProps={{
          style: {
            width: ICON_SIZE,
            height: ICON_SIZE,
            minWidth: ICON_SIZE,
            minHeight: ICON_SIZE,

          },
          color: 'inherit',
        }}
        style={{
          width: ICON_SIZE,
          height: ICON_SIZE,
        }}
        direction="left"
      >
        {
         actions.map((action) => {
           const {
             icon,
             name,
             onClick,
           } = action
           return (
             <SpeedDialAction
               tooltipTitle={name}
               tooltipPlacement="bottom"
               icon={(
                 <IconButton
                   onClick={(e) => {
                     e.stopPropagation()
                     onClick?.(e)
                   }}
                   {...icon}
                 >
                   <Icon {...icon} />
                 </IconButton>
  )}
             />
           )
         })
                              }
      </SpeedDial>
    </View>
  )
}
