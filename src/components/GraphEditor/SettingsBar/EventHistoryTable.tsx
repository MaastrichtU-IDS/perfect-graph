import { Icon } from '@components/Icon'
import {
  IconButton, Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemAvatar,
  Checkbox,
} from '@material-ui/core'
import { EventHistory, OnEventLite } from '@type'
import { EVENT } from '@utils/constants'
import {
  View,
  wrapComponent,
} from 'colay-ui'
import { useImmer } from 'colay-ui/hooks/useImmer'
import React from 'react'
import * as R from 'colay/ramda'

export type EventHistoryTableProps = {
  opened?: boolean;
  onEvent: OnEventLite;
  eventHistory: EventHistory;
}

const EventHistoryTableElement = (props: EventHistoryTableProps) => {
  const {
    onEvent,
    eventHistory,
  } = props
  const [state, updateState] = useImmer({
    selectedEventIds: [] as string[],
  })
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
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Checkbox
          checked={state.selectedEventIds.length === eventHistory.events.length}
          onChange={(_, checked) => updateState((draft) => {
            if (checked) {
              draft.selectedEventIds = eventHistory.events.map((event) => event.id)
            } else {
              draft.selectedEventIds = []
            }
          })}
          inputProps={{ 'aria-label': 'primary checkbox' }}
        />
        <Typography
          variant="h6"
        >
          History
        </Typography>
        <View
          style={{
            alignItems: 'space-between',
          }}
        >
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
              name="keyboard_arrow_up"
            />
          </IconButton>
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
              name="keyboard_arrow_down"
            />
          </IconButton>
        </View>
      </View>
      <List dense>
        {
          R.reverse(eventHistory.events).map((event, index) => {
            const { length } = eventHistory.events
            return (
              <ListItem
                selected={eventHistory.currentIndex === (length - 2) - index}
              >
                <ListItemAvatar>
                  <Checkbox
                    checked={state.selectedEventIds.includes(event.id)}
                    onChange={(_, checked) => updateState((draft) => {
                      if (checked) {
                        draft.selectedEventIds.push(event.id)
                      } else {
                        draft.selectedEventIds = draft.selectedEventIds.filter((id) => id !== event.id)
                      }
                    })}
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                  />
                </ListItemAvatar>
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
