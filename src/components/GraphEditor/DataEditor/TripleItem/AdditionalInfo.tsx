import React from 'react'
import { Box, Collapse, Divider } from '@material-ui/core'
import { DataItem, EventInfo } from '@type'
import { EVENT } from '@utils/constants'
import { AdditionalTripleItem, EventType } from '../AdditionalTripleItem'
import { NewTripleItem } from '../NewTripleItem'

type AdditionalInfoProps= {
  extended: boolean;
  additional: DataItem['additional'];
  onEvent: (event: EventInfo) => void;
}
export const AdditionalInfo = (props: AdditionalInfoProps) => {
  const {
    extended,
    additional = [],
    onEvent,
  } = props
  return (
    <Collapse
      in={extended}
      style={{ width: '95%', marginLeft: '5%' }}
    >
      <Box
        style={{ width: '100%' }}
        // level="2"
      >
        <Divider />
        {
          additional.map((item, index) => (
            <AdditionalTripleItem
              {...item}
              onEvent={({ type, payload }) => {
                switch (type) {
                  case EVENT.CHANGE_DATA_NAME:
                    onEvent({
                      type: EVENT.CHANGE_DATA_NAME_ADDITIONAL,
                      payload: { ...(payload ?? {}), index },
                    })
                    break
                  case EVENT.CHANGE_DATA_VALUE: {
                    onEvent({
                      type: EVENT.CHANGE_DATA_VALUE_ADDITIONAL,
                      payload: { ...(payload ?? {}), index },
                    })
                    break
                  }
                  case EVENT.ADD_DATA:
                    onEvent({
                      type: EVENT.ADD_DATA_ADDITIONAL,
                      payload: { ...(payload ?? {}), index },
                    })
                    break
                  case EVENT.ADD_DATA_VALUE: {
                    onEvent({
                      type: EVENT.ADD_DATA_VALUE_ADDITIONAL,
                      payload: { ...(payload ?? {}), index },
                    })
                    break
                  }
                  case EVENT.DELETE_DATA_VALUE:
                    onEvent({
                      type: EVENT.DELETE_DATA_VALUE_ADDITIONAL,
                      payload: { ...(payload ?? {}), index },
                    })
                    break
                  case EVENT.DELETE_DATA:
                    onEvent({
                      type: EVENT.DELETE_DATA_ADDITIONAL,
                      payload: { ...(payload ?? {}), index },
                    })
                    break
                  default:
                    onEvent({ type, payload: { ...(payload ?? {}), index } })
                    break
                }
              }}
            />
          ))
        }
        <Divider />
        <NewTripleItem
          style={{ marginBottom: 2 }}
          onAdd={(data) => onEvent({
            type: EVENT.ADD_DATA_ADDITIONAL,
            payload: data,
          })}
        />
      </Box>
    </Collapse>
  )
}
