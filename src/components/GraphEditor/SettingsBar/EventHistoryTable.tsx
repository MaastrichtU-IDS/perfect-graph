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
import {
  EventHistory,
  OnEventLite,
  EventInfo,
} from '@type'
import { EVENT } from '@utils/constants'
import {
  View,
  wrapComponent,
} from 'colay-ui'
import { useImmer } from 'colay-ui/hooks/useImmer'
import React from 'react'
import * as R from 'colay/ramda'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import { PlaylistTable } from './PlaylistTable'

export type EventHistoryTableProps = {
  opened?: boolean;
  onEvent: OnEventLite;
  eventHistory: EventHistory;
}

type Playlist = {
  name: string;
  events: EventInfo[]
}

const EventHistoryTableElement = (props: EventHistoryTableProps) => {
  const {
    onEvent,
    eventHistory,
  } = props
  const [state, updateState] = useImmer({
    selectedEventIds: [] as string[],
    selectedPlaylistIds: [] as string[],
    playlists: [] as Playlist[],
  })
  return (
    <View
      style={{
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingRight: 10,
        paddingLeft: 10,
        height: '100%',
        width: '100%',
      }}
    >
      <Accordion>
        <AccordionSummary
          // expandIcon={<Icon name="expand_more" />}
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
            <Checkbox
              checked={!R.isEmpty(state.selectedEventIds)
             && state.selectedEventIds.length === eventHistory.events.length}
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
                name="playlist_add"
              />
            </IconButton>
            <View
              style={{
                // alignItems: 'space-between',
                flexDirection: 'row',
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
                  name="keyboard_arrow_down"
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
                  name="keyboard_arrow_up"
                />
              </IconButton>
            </View>
          </View>
        </AccordionSummary>
        <AccordionDetails>
          <List dense>
            {
          R.reverse(eventHistory.events).map((event, index) => {
            const { length } = eventHistory.events
            return (
              <ListItem
                selected={eventHistory.currentIndex === (length - 1) - index}
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
                    aria-label="play"
                  >
                    <Icon name="play_arrow" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            )
          })
        }
          </List>
        </AccordionDetails>
      </Accordion>
      <PlaylistTable 
        
      />
    </View>
  )
}

export const EventHistoryTable = wrapComponent<EventHistoryTableProps>(EventHistoryTableElement, {})
