import React from 'react'
import { Box, IconButton } from '@material-ui/core'
import { Icon } from '@components/Icon'
import * as R from 'colay/ramda'
import { EVENT } from '@utils/constants'
import { TripleItemProps, ICON_SIZE } from './index'
import { TripleInput } from '../TripleInput'

type ValueBoxProps = {
  extended: boolean;
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
                    onValueChange={(value) => onEvent(EVENT.CHANGE_DATA_VALUE, { value, valueIndex })}
                    // type={type}
                  />
                  <Box
                    style={{ width: ICON_SIZE }}
                  >
                    {
                    isMulti && (
                    <IconButton
                      onClick={() => onEvent(EVENT.DELETE_DATA_VALUE, { valueIndex, valueItem })}
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
                        onClick={() => onEvent(EVENT.DATA_VALUE_UP, { valueIndex, valueItem })}
                        sx={{ width: ICON_SIZE, height: ICON_SIZE }}
                      >
                        <Icon
                          name="arrow_drop_up_rounded"
                          style={{ fontSize: ICON_SIZE }}
                        />
                      </IconButton>
                      <IconButton
                        onClick={() => onEvent(EVENT.DATA_VALUE_DOWN, { valueIndex, valueItem })}
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
                onEvent(EVENT.ADD_DATA_VALUE, { value: state.newDataValue })
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
