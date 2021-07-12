import React from 'react'
import { Box, IconButton } from '@material-ui/core'
import { Icon } from '@components/Icon'
import * as R from 'colay/ramda'
import { EVENT } from '@constants'
import { TripleItemProps, ICON_SIZE } from './index'
import { TripleInput } from '../TripleInput'

type ValueBoxProps = {
  extended?: boolean;
  state: any;
  setState: (s: any) => void;
  // @ts-ignore
} & Pick<TripleItemProps, 'value' | 'onEvent' | 'isMulti' | 'isAdditional'>

export const ValueBox = (props: ValueBoxProps) => {
  const {
    isMulti,
    onEvent,
    value,
    isAdditional,
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
                      payload: { value, valueIndex },
                    })}
                    // type={type}
                  />
                  <Box
                    style={{ width: ICON_SIZE }}
                  >
                    {
                    isMulti && (
                    <IconButton
                      onClick={() => onEvent({
                        type: EVENT.DELETE_DATA_VALUE,
                        payload: { valueIndex, valueItem },
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
                    {
                    isMulti && !isAdditional && (
                    <>
                      <IconButton
                        onClick={() => onEvent({
                          type: EVENT.DATA_VALUE_UP,
                          payload: { valueIndex, valueItem },
                        })}
                        sx={{ width: ICON_SIZE, height: ICON_SIZE }}
                      >
                        <Icon
                          name="arrow_drop_up_rounded"
                          style={{ fontSize: ICON_SIZE }}
                        />
                      </IconButton>
                      <IconButton
                        onClick={() => onEvent({
                          type: EVENT.DATA_VALUE_DOWN,
                          payload: { valueIndex, valueItem },
                        })}
                        sx={{ width: ICON_SIZE, height: ICON_SIZE }}
                      >
                        <Icon
                          name="arrow_drop_down_rounded"
                          style={{ fontSize: ICON_SIZE }}
                        />
                      </IconButton>

                    </>
                    )
  }
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
                  payload: { value: state.newDataValue },
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
