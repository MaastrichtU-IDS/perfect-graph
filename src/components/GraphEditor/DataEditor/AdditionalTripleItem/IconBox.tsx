import { Icon } from '@components/Icon'
import { Box, IconButton, Divider } from '@material-ui/core'
import { EVENT } from '@utils/constants'
import React from 'react'
import { ICON_SIZE, TripleItemProps, EventType } from './index'
import { TRIPLE_INPUT_HEIGHT } from '../TripleInput'

export type IconBoxProps = {
  isAdditional: boolean;
  onExtend: () => void;
  onEvent: (type: EventType) => void;
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
          onClick={() => onEvent(EVENT.DELETE_DATA)}
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
          onClick={() => onEvent(EVENT.ADD_DATA_VALUE)}
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
