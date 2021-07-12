import { Icon } from '@components/Icon'
import { EVENT } from '@constants'
import { Box, IconButton } from '@material-ui/core'
import { OnEventLite } from '@type'
import React from 'react'
import { ICON_SIZE, TripleItemProps } from './index'

export type IconBoxProps = {
  isAdditional: boolean;
  onExtend: () => void;
  onEvent: OnEventLite;
  extended: boolean;
  type: string;
} & Pick<TripleItemProps, 'isLocalLabel' | 'isGlobalLabel' | 'isGlobalLabelFirst'>

export const IconBox = (props: IconBoxProps) => {
  const {
    extended,
    onEvent,
  } = props
  return (
    <>
      <Box>
        {extended && (
        <IconButton
          onClick={() => onEvent({
            type: EVENT.DELETE_DATA,
          })}
        >
          <Icon
            name="delete_rounded"
            style={{
              fontSize: ICON_SIZE,
            }}
          />
        </IconButton>
        )}
        <IconButton
          onClick={() => onEvent({
            type: EVENT.ADD_DATA_VALUE,
          })}
        >
          <Icon
            name="add_circle"
            style={{ fontSize: ICON_SIZE }}
          />
        </IconButton>
      </Box>
    </>
  )
}
