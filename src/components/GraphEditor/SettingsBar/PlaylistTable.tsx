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
  Playlist,
} from '@type'
import {
  View,
  wrapComponent,
} from 'colay-ui'
import React from 'react'
import * as R from 'colay/ramda'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'

export type EventHistoryTableProps = {
  opened?: boolean;
  // onEvent: OnEventLite;
  selectedPlaylistIds: string[]
  playlists: Playlist[];
  onSelectAllPlaylist: () => void
  onSelectPlaylist: (playlist: Playlist) => void
  onPlay: (playlist: Playlist) => void
}
export const PlaylistTable = (props: EventHistoryTableProps) => {
  const {
    onSelectAllPlaylist,
    onSelectPlaylist,
    playlists,
    selectedPlaylistIds,
    onPlay,
  } = props
  return (
    <Accordion>
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
          <Checkbox
            checked={!R.isEmpty(state.selectedPlaylistIds)
               && state.selectedPlaylistIds.length === state.playlists.length}
            onChange={(_, checked) => updateState((draft) => {
              if (checked) {
                draft.selectedPlaylistIds = state.playlists.map((playlist) => playlist.id)
              } else {
                draft.selectedPlaylistIds = []
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

            }}
          >
            <Icon
              name="delete_rounded"
            />
          </IconButton>
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
                      aria-label="delete"
                    >
                      <Icon name="delete_rounded" />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                    >
                      <Icon name="pla" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              )
            })
          }
        </List>
      </AccordionDetails>
    </Accordion>
  )
}
