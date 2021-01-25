import React from 'react'
import { Box, Collapse, Divider } from '@material-ui/core'
import { DataItem } from '@type'
import { EVENT } from '@utils/constants'
import { AdditionalTripleItem, EventType } from '../AdditionalTripleItem'
import { NewTripleItem } from '../NewTripleItem'

type AdditionalInfoProps= {
  extended: boolean;
  additional: DataItem['additional'];
  onEvent: (type: EventType, extraData: any) => void;
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
