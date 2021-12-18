import { Icon } from '@components/Icon'
import {
  IconButton,
  Typography,
} from '@mui/material'
import { EVENT } from '@constants'
import {
  JSONViewer,
} from './JSONViewer'
import { View } from 'colay-ui/components/View'
import React from 'react'
import { OnEventLite } from '@type'
import { 
  Collapsible,
  CollapsibleContainer,
  CollapsibleTitle,
} from '@components/Collapsible'
export type GlobalNetworkStatisticsProps = {
  data?: any;
  onEvent: OnEventLite;
}

export const GlobalNetworkStatistics = (props: GlobalNetworkStatisticsProps) => {
  const {
    data,
    onEvent,
    sort = -1,
  } = props
  return (
    <Collapsible
      defaultIsOpen
    >
      {
        ({ isOpen, onToggle }) => (
          <>
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
            <CollapsibleTitle
              onClick={onToggle}
            >
              Global Network Statistics
            </CollapsibleTitle>
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
        {
          isOpen && (
            <CollapsibleContainer>
          <JSONViewer
            data={data}
            sort={sort}
            />
        </CollapsibleContainer>
          )
        }
          </>
        )
      }

    </Collapsible>
  )
}


{/* <JSONViewer
          data={data}
          sort={sort}
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
        /> */}