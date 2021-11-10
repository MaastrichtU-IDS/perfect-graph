import { Icon } from '@components/Icon'
import { EVENT } from '@constants'
import { Box, Divider, IconButton } from '@mui/material'
import { OnEventLite } from '@type'
import React from 'react'
import { TRIPLE_INPUT_HEIGHT } from '../TripleInput'
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
    onExtend,
    extended,
    onEvent,
    isLocalLabel,
    isGlobalLabelFirst,
  } = props
  return (
    <Box
      style={{
        alignItems: 'center',
        height: TRIPLE_INPUT_HEIGHT,
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <Box
        style={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          height: TRIPLE_INPUT_HEIGHT,
        }}
      >
        <IconButton
          onClick={() => onEvent({ type: EVENT.MAKE_DATA_LABEL })}
          onDoubleClick={() => onEvent({ type: EVENT.MAKE_DATA_LABEL_FIRST })}
        >
          <Icon
            name={isLocalLabel ? 'bookmark' : 'bookmark_border'}
            style={{
              fontSize: ICON_SIZE,
            }}
          />
        </IconButton>
        {/* {!isGlobalLabelFirst && (
        <Divider
          style={{
            backgroundColor: 'black',
            marginTop: 1,
            marginBottom: 1,
            width: ICON_SIZE - 2,
          }}
        />
        )} */}
        <IconButton
          onClick={() => onEvent({ type: EVENT.MAKE_GLOBAL_DATA_LABEL })}
          onDoubleClick={() => onEvent({ type: EVENT.MAKE_GLOBAL_DATA_LABEL_FIRST })}
        >
          <Icon
            name={isLocalLabel ? 'bookmarks' : 'bookmark_border'}
            style={{ fontSize: ICON_SIZE }}
          />
        </IconButton>
        {isGlobalLabelFirst && (
        <Divider style={{ backgroundColor: 'black', width: ICON_SIZE - 2 }} />)}
      </Box>
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          height: TRIPLE_INPUT_HEIGHT,
        }}
      >
        <IconButton
          onClick={onExtend}
        >
          <Icon
            style={{ fontSize: ICON_SIZE }}
            name={extended ? 'arrow_drop_up_rounded' : 'arrow_drop_down_rounded'}
          />
        </IconButton>
        {extended && (
        <IconButton
          onClick={() => onEvent({ type: EVENT.DELETE_DATA })}
        >
          <Icon
            name="delete_rounded"
            style={{
              fontSize: ICON_SIZE,
            }}
          />
        </IconButton>
        )}
      </Box>
    </Box>
  )
}
