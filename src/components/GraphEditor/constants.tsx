import React from 'react'
import { IconButton, Typography } from '@material-ui/core'
import { Icon } from '@components/Icon'
import { DATA_TYPE } from '@utils/constants'

export const TYPE_ICONS = {
  [DATA_TYPE.number]: (props: any) => (
    <IconButton
      {...props}
    >
      <Icon name="repeat_one" />
    </IconButton>
  ),
  [DATA_TYPE.string]: (props: any) => (
    <IconButton
      {...props}
    >
      <Icon name="sort_by_alpha" />
    </IconButton>
  ),
  [DATA_TYPE.id]: (props: any) => (
    <IconButton
      {...props}
      style={{
        width: props.size,
        height: props.size,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 3,
        ...props.style,
      }}
    >
      <Typography
        variant="caption"
        style={{
          fontSize: props.size - 5,
          fontWeight: 'bold',
          letterSpacing: 1,
        }}
      >
        iri
      </Typography>
    </IconButton>
  ),
  [DATA_TYPE.unknown]: (props: any) => (
    <IconButton
      {...props}
    >
      <Icon name="close" />
    </IconButton>
  ),
} as const
