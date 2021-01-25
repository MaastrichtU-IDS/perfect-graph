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
    onExtend,
    extended,
    onEvent,
    isGlobalLabel,
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
          onClick={() => onEvent(EVENT.MAKE_DATA_LABEL)}
          onDoubleClick={() => onEvent(EVENT.MAKE_DATA_LABEL_FIRST)}
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
          onClick={() => onEvent(EVENT.MAKE_GLOBAL_DATA_LABEL)}
          onDoubleClick={() => onEvent(EVENT.MAKE_GLOBAL_DATA_LABEL_FIRST)}
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
      </Box>
    </Box>
  )
}
