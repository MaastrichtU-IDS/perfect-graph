import { Icon } from '@components/Icon'
import {
  IconButton, Typography,
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@material-ui/core'
import { EventHistory, OnEvent } from '@type'
import { EVENT } from '@utils/constants'
import {
  View, wrapComponent,
} from 'colay-ui'
import React from 'react'

export type EventHistoryTableProps = {
  opened?: boolean;
  onEvent: OnEvent;
  eventHistory?: EventHistory;
}

const EventHistoryTableElement = (props: EventHistoryTableProps) => {
  const {
    onEvent,
    eventHistory,
  } = props
  return (
    <View
      style={{
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingRight: 10,
        paddingLeft: 10,
        height: '50%',
        width: '100%',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'space-between',
          width: '70%',
        }}
      >
        <Typography
          variant="h6"
        >
          History
        </Typography>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'space-between',
          }}
        >
          <IconButton
            onClick={() => {
              onEvent({
                type: EVENT.UNDO_EVENT,
                avoidEventRecording: true,
                avoidHistoryRecording: true,
              })
            }}
          >
            <Icon
              name="undo"
            />
          </IconButton>
          <IconButton
            onClick={() => {
              onEvent({
                type: EVENT.REDO_EVENT,
                avoidEventRecording: true,
                avoidHistoryRecording: true,
              })
            }}
          >
            <Icon
              name="redo"
            />
          </IconButton>
        </View>
      </View>
      <List dense>
        {
          eventHistory?.events.reverse().map((event, index) => {
            const length = eventHistory?.events.length
            console.log(eventHistory, index, eventHistory.currentIndex === index)
            return (
              <ListItem
                selected={eventHistory.currentIndex === (length - 1) - index}
              >
                {/* <ListItemAvatar>
                        <Avatar>
                          <FolderIcon />
                        </Avatar>
                      </ListItemAvatar> */}
                <ListItemText
                  primary={event.type}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                  >
                    <Icon name="delete_rounded" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            )
          })
        }
      </List>
    </View>
  )
}

export const EventHistoryTable = wrapComponent<EventHistoryTableProps>(EventHistoryTableElement, {})
