import {
  Accordion,
  AccordionDetails,
  AccordionSummary, Typography
} from '@mui/material'
import { OnEventLite } from '@type'
import { View } from 'colay-ui/components/View'
import React from 'react'
import {
  JSONViewer
} from './JSONViewer'

export type LocalNetworkStatisticsProps = {
  data?: any;
  onEvent: OnEventLite;
}

export const LocalNetworkStatistics = (props: LocalNetworkStatisticsProps) => {
  const {
    data,
    sort =-1
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
              Local Network Statistics
            </Typography>
          </View>
          <View
            style={{
              // alignItems: 'space-between',
              flexDirection: 'row',
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
      </AccordionSummary>
      <AccordionDetails>
      <JSONViewer
          data={data}
          sort={sort}
          />
      </AccordionDetails>
    </Accordion>
  )
}


// <JSONViewer
//           data={data}
//           sort={sort}
//           left={({ collapsed, onCollapse, noChild }) => (
//             <IconButton
//               size="small"
//               sx={{ height: 24 }}
//               disabled={noChild}
//               onClick={() => onCollapse(!collapsed)}
//             >
//               <Icon
//                 style={{
//                   fontSize: noChild ? 12 : 24,
//                 }}
//                 name={
//                         noChild
//                           ? 'fiber_manual_record'
//                           : collapsed
//                             ? 'arrow_drop_down_rounded'
//                             : 'arrow_drop_up_rounded'
//   }
//               />
//             </IconButton>
//           )}
//           renderItem={({ item: { key, value } }) => (
//             <View
//               style={{
//                 flexDirection: 'row',
//                 justifyContent: 'space-between',
//               }}
//             >
//               <Typography
//                 variant="subtitle1"
//                 style={{ alignContent: 'center' }}
//               >
//                 {`${key}${value ? ': ' : ''}`}
//               </Typography>
//               {!R.isNil(value)
//                 ? (
//                   <Typography
//                     variant="subtitle1"
//                     style={{ alignContent: 'center' }}
//                   >
//                     {value}
//                   </Typography>
//                 )
//                 : null}
//             </View>
//           )}
//         />