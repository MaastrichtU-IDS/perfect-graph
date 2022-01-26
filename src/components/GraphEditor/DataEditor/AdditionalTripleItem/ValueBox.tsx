import React from 'react'
import { Box, IconButton } from '@mui/material'
import { Icon } from '@components/Icon'
import * as R from 'colay/ramda'
import { EVENT } from '@constants'
import { TripleItemProps, ICON_SIZE } from './index'
import { TripleInput } from '../TripleInput'

type ValueBoxProps = {
  extended?: boolean;
  state: any;
  setState: (s: any) => void;
  isMulti?: boolean;
} & Pick<TripleItemProps, 'value' | 'onEvent'  | 'isAdditional'>

export const ValueBox = (props: ValueBoxProps) => {
  const {
    isMulti,
    onEvent,
    value,
    extended,
    state,
    setState,
  } = props
  return (
    <>
      {
              R.ensureArray(value).map((valueItem, valueIndex) => (
                <Box
                  sx={{
                    marginBottom: 5,
                    display: 'flex',
                    flexDirection: 'row',
                  }}
                >
                  <TripleInput
                    placeholder="Enter Value"
                    value={valueItem}
                    onValueChange={(value) => onEvent({
                      type: EVENT.CHANGE_DATA_VALUE,
                      payload: {
                        value,
                        valueIndex,
                      },
                    })}
                    // type={type}
                  />
                  <Box
                    style={{ width: ICON_SIZE }}
                  >
                    <>
                      {
                    isMulti && (
                    <IconButton
                      onClick={() => onEvent({
                        type: EVENT.DELETE_DATA_VALUE,
                        payload: {
                          valueIndex,
                          valueItem,
                        },
                      })}
                      sx={{ width: ICON_SIZE, height: ICON_SIZE, p: 0 }}
                    >
                      <Icon
                        name="close"
                        style={{ fontSize: ICON_SIZE }}
                      />
                    </IconButton>
                    )
  }
                    </>
                  </Box>
                </Box>
              ))
            }
      {
            // Enter New Value
            extended && (
            <TripleInput
              textStyle={{
                borderBottomWidth: 1,
                marginBottom: 5,
                fontStyle: 'italic',
              }}
              placeholder="Enter Value"
              value={state.newDataValue}
              onValueChange={(value) => setState({
                ...state,
                newDataValue: value,
              })}
              onEnter={() => {
                onEvent({
                  type: EVENT.ADD_DATA_VALUE,
                  payload: {
                    value: state.newDataValue,
                  },
                })
                setState({
                  ...state,
                  newDataValue: '',
                })
              }}
            />
            )
          }
    </>
  )
}
