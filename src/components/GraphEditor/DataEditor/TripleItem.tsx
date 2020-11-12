import React from 'react'
import {
  Grid, Flex,
  useData, Icon,
  Collapsible, Layout,
  Divider,
} from 'unitx-ui'
import * as R from 'unitx/ramda'
import { DataItem } from '@type'
import { DATA_TYPE, EVENT } from '@utils/constants'
import { TripleInput } from './TripleInput'
import { NewTripleItem } from './NewTripleItem'

export type EventType = keyof typeof EVENT

type TripleItemProps = {
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
  const [state, update] = useData({
    extended: false,
    settingsOpened: true,
    newDataValue: '',
  })
  const isMulti = value.length > 1
  const onExtend = React.useCallback(() => {
    update((draft) => {
      draft.extended = !draft.extended
    })
  }, [update])
  return (
    <Grid
      col
      style={{ size: 12 }}
    >
      <Grid>
        <Grid
          col
          style={{ size: 5.5 }}
        >
          <TripleInput
            placeholder="Enter Type"
            value={name}
            onValueChange={(value) => onEvent(EVENT.CHANGE_DATA_NAME, { value })}
            // type={DATA_TYPE.string}
          />
        </Grid>
        <Grid
          col
          style={{ size: 5.5 }}
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
                <Flex
                  col
                  style={{ width: ICON_SIZE }}
                >
                  {
                  isMulti && (
                  <Icon
                    name="close"
                    size={ICON_SIZE}
                    onPress={() => onEvent(EVENT.DELETE_DATA_VALUE, { valueIndex, valueItem })}
                  />
                  )
}
                  {
                  isMulti && !isAdditional && (
                  <>
                    <Icon
                      name="chevron-up"
                      size={ICON_SIZE}
                      onPress={() => onEvent(EVENT.DATA_VALUE_UP, { valueIndex, valueItem })}
                    />
                    <Icon
                      name="chevron-down"
                      size={ICON_SIZE}
                      onPress={() => onEvent(EVENT.DATA_VALUE_DOWN, { valueIndex, valueItem })}
                    />
                  </>
                  )
}
                </Flex>
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
              onValueChange={(value) => update((draft) => {
                draft.newDataValue = value
              })}
              onEnter={() => {
                onEvent(EVENT.ADD_DATA_VALUE, { value: state.newDataValue })
                update((draft) => {
                  draft.newDataValue = ''
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
    <Collapsible
      collapsed={!extended}
      style={{ width: '95%', marginLeft: '5%' }}
    >
      <Layout
        style={{ width: '100%' }}
        level="2"
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
      </Layout>
    </Collapsible>
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
          <Flex
            col
            style={{ alignItems: 'center' }}
          >
            <Icon
              name={isLocalLabel ? 'tag-remove' : 'tag'}
              size={ICON_SIZE}
              onPress={() => onEvent(EVENT.MAKE_DATA_LABEL)}
              onLongPress={() => onEvent(EVENT.MAKE_DATA_LABEL_FIRST)}
            />
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
            <Icon
              name={isGlobalLabel ? 'tag-remove' : 'tag-multiple'}
              size={ICON_SIZE}
              onPress={() => onEvent(EVENT.MAKE_GLOBAL_DATA_LABEL)}
              onLongPress={() => onEvent(EVENT.MAKE_GLOBAL_DATA_LABEL_FIRST)}
            />
            {isGlobalLabelFirst && (
            <Divider style={{ backgroundColor: 'black', width: ICON_SIZE - 2 }} />)}
            {/* <Icon
              name="plus-box"
              size={ICON_SIZE}
              onPress={() => onEvent(EVENT.ADD_DATA_VALUE)}
            /> */}
          </Flex>
          )
        }
      <Flex col>
        {/* <Icon
          name="repeat"
          size={ICON_SIZE}
          onPress={() => onEvent(EVENT.CLEAR)}
        /> */}

        {
          !isAdditional && (
          <Icon
            name={extended ? 'chevron-up-box' : 'chevron-down-box'}
            size={ICON_SIZE}
            onPress={onExtend}
          />
          )
        }
        {extended && (
        <Icon
          name="delete"
          size={ICON_SIZE}
          onPress={() => onEvent(EVENT.DELETE_DATA)}
        />
        )}
        {
          isAdditional && (
            <Icon
              name="plus-box-outline"
              size={ICON_SIZE}
              onPress={() => onEvent(EVENT.ADD_DATA_VALUE)}
            />
          )
        }
        {/* {
        TYPE_ICONS[type]({
          size: ICON_SIZE,
          onPress: () => onEvent(EVENT.CHANGE_TYPE),
        })
      } */}
      </Flex>

    </>
  )
}
