import React from 'react'
import {
  Grid,
  Collapse,
  IconButton,
  Box,
  Divider,
} from '@material-ui/core'
import {
  Icon,
} from '@components/Icon'
import * as R from 'colay/ramda'
import { DataItem } from '@type'
import { DATA_TYPE, EVENT } from '@utils/constants'
import { TripleInput } from './TripleInput'
import { NewTripleItem } from './NewTripleItem'

export type EventType = keyof typeof EVENT

export type TripleItemProps = {
  isAdditional?: boolean;
  onEvent: (type: EventType, extraData: any) => void;
  isLocalLabel?: boolean;
  isGlobalLabel?: boolean;
  isGlobalLabelFirst?: boolean;
} & DataItem

const ICON_SIZE = 15

export const MockTripleItemProps: TripleItemProps = {
  name: 'foaf:name',
  value: ['Holland', 'Netherlands'],
  type: DATA_TYPE.string,
  additional: [{ name: '@lang', value: ['en'], type: DATA_TYPE.string }],
  onEvent: (type, extraData) => {
    console.log('onEvent', type, extraData)
  },
}

export const TripleItem = (props: TripleItemProps) => {
  const {
    name,
    type,
    additional = [],
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
  }, [setState])
  return (
    <Grid
      container
      // xs={12}
    >
      <Grid item>
        <Grid
          item
          xs={5}
        >
          <TripleInput
            placeholder="Enter Type"
            value={name}
            onValueChange={(value) => onEvent(EVENT.CHANGE_DATA_NAME, { value })}
            // type={DATA_TYPE.string}
          />
        </Grid>
        <Grid
          item
          xs={5}
        >
          {
            R.ensureArray(value).map((valueItem, valueIndex) => (
              <Grid
                style={{
                  marginBottom: 5,
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
                    >
                      <Icon
                        name="arrow_drop_up_rounded"
                        style={{ fontSize: ICON_SIZE }}
                      />
                    </IconButton>
                    <IconButton
                      onClick={() => onEvent(EVENT.DATA_VALUE_DOWN, { valueIndex, valueItem })}
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
              </Grid>
            ))
          }
          {
            state.extended && (
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
        </Grid>
        <IconBox
          isAdditional={isAdditional}
          extended={state.extended}
          onExtend={onExtend}
          onEvent={onEvent}
          type={type}
          isLocalLabel={isLocalLabel}
          isGlobalLabel={isGlobalLabel}
          isGlobalLabelFirst={isGlobalLabelFirst}
        />
      </Grid>
      <AdditionalInfo
        extended={state.extended}
        additional={additional}
        onEvent={onEvent}
      />
    </Grid>
  )
}

type AdditionalInfoProps= {
  extended: boolean;
  additional: DataItem['additional'];
  onEvent: (type: EventType, extraData: any) => void;
}
const AdditionalInfo = (props: AdditionalInfoProps) => {
  const {
    extended,
    additional = [],
    onEvent,
  } = props
  return (
    <Collapse
      in={!extended}
      style={{ width: '95%', marginLeft: '5%' }}
    >
      <Box
        style={{ width: '100%' }}
        // level="2"
      >
        <Divider />
        {
          additional.map((item, index) => (
            <TripleItem
              {...item}
              isAdditional
              onEvent={(type, extraData) => {
                switch (type) {
                  case EVENT.CHANGE_DATA_NAME:
                    onEvent(EVENT.CHANGE_DATA_NAME_ADDITIONAL, { ...(extraData ?? {}), index })
                    break
                  case EVENT.CHANGE_DATA_VALUE: {
                    onEvent(EVENT.CHANGE_DATA_VALUE_ADDITIONAL, { ...(extraData ?? {}), index })
                    break
                  }
                  case EVENT.ADD_DATA:
                    onEvent(EVENT.ADD_DATA_ADDITIONAL, { ...(extraData ?? {}), index })
                    break
                  case EVENT.ADD_DATA_VALUE: {
                    onEvent(EVENT.ADD_DATA_VALUE_ADDITIONAL, { ...(extraData ?? {}), index })
                    break
                  }
                  case EVENT.DELETE_DATA_VALUE:
                    onEvent(EVENT.DELETE_DATA_VALUE_ADDITIONAL, { ...(extraData ?? {}), index })
                    break
                  case EVENT.DELETE_DATA:
                    onEvent(EVENT.DELETE_DATA_ADDITIONAL, { ...(extraData ?? {}), index })
                    break
                  default:
                    onEvent(type, { ...(extraData ?? {}), index })
                    break
                }
              }}
            />
          ))
        }
        <Divider />
        <NewTripleItem
          style={{ marginBottom: 2 }}
          onAdd={(data) => onEvent(EVENT.ADD_DATA_ADDITIONAL, data)}
        />
      </Box>
    </Collapse>
  )
}

type IconBoxProps = {
  isAdditional: boolean;
  onExtend: () => void;
  onEvent: (type: EventType) => void;
  extended: boolean;
  type: string;
} & Pick<TripleItemProps, 'isLocalLabel' | 'isGlobalLabel' | 'isGlobalLabelFirst'>
const IconBox = (props: IconBoxProps) => {
  const {
    isAdditional,
    onExtend,
    extended,
    onEvent,
    isGlobalLabel,
    isLocalLabel,
    isGlobalLabelFirst,
  } = props
  return (
    <>
      {
          !isAdditional && (
          <Box
            style={{ alignItems: 'center' }}
          >
            <IconButton
              onClick={() => onEvent(EVENT.MAKE_DATA_LABEL)}
              onDoubleClick={() => onEvent(EVENT.MAKE_DATA_LABEL_FIRST)}
              // onLongPress={() => onEvent(EVENT.MAKE_DATA_LABEL_FIRST)}
            >
              <Icon
                name={isLocalLabel ? 'bookmark' : 'bookmark_border'}
                style={{
                  fontSize: ICON_SIZE,
                }}
              />
            </IconButton>
            {!isGlobalLabelFirst && (
            <Divider
              style={{
                backgroundColor: 'black',
                marginTop: 1,
                marginBottom: 1,
                width: ICON_SIZE - 2,
              }}
            />
            )}
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
            {/* <Icon
              name="plus-box"
              size={ICON_SIZE}
              onPress={() => onEvent(EVENT.ADD_DATA_VALUE)}
            /> */}
          </Box>
          )
        }
      <Box>
        {/* <Icon
          name="repeat"
          size={ICON_SIZE}
          onPress={() => onEvent(EVENT.CLEAR)}
        /> */}

        {
          !isAdditional && (
          <IconButton
            onClick={onExtend}
          >
            <Icon
              style={{ fontSize: ICON_SIZE }}
              name={extended ? 'arrow_drop_up_rounded' : 'arrow_drop_down_rounded'}
            />
          </IconButton>
          )
        }
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
        {
          isAdditional && (
            <IconButton
              onClick={() => onEvent(EVENT.ADD_DATA_VALUE)}
            >
              <Icon
                name="add_circle"
                style={{ fontSize: ICON_SIZE }}
              />
            </IconButton>
          )
        }
        {/* {
        TYPE_ICONS[type]({
          size: ICON_SIZE,
          onPress: () => onEvent(EVENT.CHANGE_TYPE),
        })
      } */}
      </Box>

    </>
  )
}
