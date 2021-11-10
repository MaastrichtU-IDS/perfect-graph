import { Icon } from '@components/Icon'
import {
  IconButton,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '@mui/material'
import { EVENT } from '@constants'
import {
  JSONViewer,
} from 'colay-ui'
import { View } from 'colay-ui/components/View'
import React from 'react'
import { OnEventLite } from '@type'
import * as R from 'colay/ramda'

export type GlobalNetworkStatisticsProps = {
  data?: any;
  onEvent: OnEventLite;
}

export const GlobalNetworkStatistics = (props: GlobalNetworkStatisticsProps) => {
  const {
    data,
    onEvent,
  } = props
  return (
    <Accordion
      defaultExpanded
    >
      <AccordionSummary
        aria-controls="panel1a-content"
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Typography
              variant="h6"
            >
              Global Network Statistics
            </Typography>
          </View>
          <View
            style={{
              // alignItems: 'space-between',
              flexDirection: 'row',
            }}
          >
            <IconButton
              onClick={(e) => {
                e.stopPropagation()
                onEvent({
                  type: EVENT.CALCULATE_GLOBAL_NETWORK_STATISTICS,
                })
              }}
            >
              <Icon
                name="assessment"
              />
            </IconButton>
          </View>
        </View>
      </AccordionSummary>
      <AccordionDetails>
        <JSONViewer
          data={data}
          sort={-1}
          left={({ collapsed, onCollapse, noChild }) => (
            <IconButton
              size="small"
              sx={{ height: 24 }}
              disabled={noChild}
              onClick={() => onCollapse(!collapsed)}
            >
              <Icon
                style={{
                  fontSize: noChild ? 12 : 24,
                }}
                name={
                        noChild
                          ? 'fiber_manual_record'
                          : collapsed
                            ? 'arrow_drop_down_rounded'
                            : 'arrow_drop_up_rounded'
  }
              />
            </IconButton>
          )}
          renderItem={({ item: { key, value } }) => (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Typography
                variant="subtitle1"
                style={{ alignContent: 'center' }}
              >
                {`${key}${value ? ': ' : ''}`}
              </Typography>
              {!R.isNil(value)
                ? (
                  <Typography
                    variant="subtitle1"
                    style={{ alignContent: 'center' }}
                  >
                    {value}
                  </Typography>
                )
                : null}
            </View>
          )}
        />
      </AccordionDetails>
    </Accordion>
  )
}
