import {Collapsible, CollapsibleContainer, CollapsibleTitle} from '@components/Collapsible'
import {OnEventLite} from '@type'
import {View} from 'colay-ui/components/View'
import React from 'react'
import {JSONViewer} from './JSONViewer'

export type LocalNetworkStatisticsProps = {
  data?: any
  onEvent: OnEventLite
  sort?: any
}

export const LocalNetworkStatistics = (props: LocalNetworkStatisticsProps) => {
  const {data, sort = -1} = props
  return (
    <Collapsible defaultIsOpen>
      {({isOpen, onToggle}) => (
        <>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%'
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <CollapsibleTitle onClick={onToggle}>Local Network Statistics</CollapsibleTitle>
            </View>
            <View
              style={{
                // alignItems: 'space-between',
                flexDirection: 'row'
              }}
            >
              {/* <IconButton
              onClick={(e) => {
                e.stopPropagation()
                onEvent({
                  type: EVENT.CALCULATE_LOCAL_NETWORK_STATISTICS,
                })
              }}
            >
              <Icon
                name="assessment"
              />
            </IconButton> */}
            </View>
          </View>
          {isOpen && (
            <CollapsibleContainer>
              <JSONViewer data={data} sort={sort} />
            </CollapsibleContainer>
          )}
        </>
      )}
    </Collapsible>
  )
}
