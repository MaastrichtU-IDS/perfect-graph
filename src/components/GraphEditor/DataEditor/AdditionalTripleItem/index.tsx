import {
  Box,
} from '@material-ui/core'
import { DataItem, EventInfo } from '@type'
import { DATA_TYPE, EVENT } from '@constants'
import * as R from 'colay/ramda'
import React from 'react'
import { TripleInput } from '../TripleInput'
import { ValueBox } from './ValueBox'
import { IconBox } from './IconBox'

export type EventType = keyof typeof EVENT

export type TripleItemProps = {
  isAdditional?: boolean;
  onEvent: (event: EventInfo) => void;
  isLocalLabel?: boolean;
  isGlobalLabel?: boolean;
  isGlobalLabelFirst?: boolean;
} & DataItem

export const ICON_SIZE = 15

export const MockTripleItemProps: TripleItemProps = {
  name: 'foaf:name',
  value: ['Holland', 'Netherlands'],
  type: DATA_TYPE.string,
  additional: [{ name: '@lang', value: ['en'], type: DATA_TYPE.string }],
  onEvent: () => {
  },
}

export const AdditionalTripleItem = (props: TripleItemProps) => {
  const {
    name,
    type,
    // additional = [],
    isAdditional = false,
    onEvent = R.identity,
    isGlobalLabel,
    isLocalLabel,
    isGlobalLabelFirst,
  } = props
  const value = R.ensureArray(props.value)
  const [state, setState] = React.useState({
    extended: false,
    settingsOpened: true,
    newDataValue: '',
  })
  const isMulti = value.length > 1
  const onExtend = React.useCallback(() => {
    setState({
      ...state,
      extended: !state.extended,
    })
  }, [])
  return (
    <>
      <Box
        sx={{
          width: '100%',
          height: 300,
          display: 'grid',
          gridTemplateRows: 'repeat(3, 1fr)',
          gridTemplateAreas: `"type type value value icons"
          `,
        }}
      >
        <Box
          sx={{ gridArea: 'type' }}
        >
          <TripleInput
            placeholder="Enter Type"
            value={name}
            onValueChange={(value) => onEvent({
              type: EVENT.CHANGE_DATA_NAME,
              payload: { value },
            })}
          />
        </Box>
        <Box
          sx={{ gridArea: 'value' }}
        >
          <ValueBox
            isMulti={isMulti}
            isAdditional={isAdditional}
            state={state}
            setState={setState}
            onEvent={onEvent}
            value={value}
          />
        </Box>
        <Box
          sx={{ gridArea: 'icons' }}
        >
          <IconBox
            isAdditional={isAdditional}
            extended={state.extended}
            onEvent={onEvent}
            onExtend={onExtend}
            type={type}
            isLocalLabel={isLocalLabel}
            isGlobalLabel={isGlobalLabel}
            isGlobalLabelFirst={isGlobalLabelFirst}
          />
        </Box>
      </Box>
    </>
  )
}
