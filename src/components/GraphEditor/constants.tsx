import React from 'react'
import { Icon, IconButton, Typography } from '@material-ui/core'
import { DATA_TYPE } from '@utils/constants'

export const TYPE_ICONS = {
  [DATA_TYPE.number]: (props: any) => (
    <IconButton
      {...props}
    >
      <Icon>numeric</Icon>
    </IconButton>
  ),
  [DATA_TYPE.string]: (props: any) => (
    <IconButton
      {...props}
    >
      <Icon>alphabetical</Icon>
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
      <Icon>alpha-x</Icon>
    </IconButton>
  ),
} as const
