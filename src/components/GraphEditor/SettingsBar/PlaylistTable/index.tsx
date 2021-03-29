import {
  IconButton, Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemAvatar,
  Checkbox,
  Card,
} from '@material-ui/core'
import {
  Playlist,
  OnEventLite,
} from '@type'
import {
  View,
} from 'colay-ui'
import { useImmer } from 'colay-ui/hooks/useImmer'
import React from 'react'
import * as R from 'colay/ramda'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import { SortableList } from '@components/SortableList'
import { SpeedDialCreator } from '@components/SpeedDialCreator'
import { Icon } from '../../../Icon'

export type EventHistoryTableProps = {
  opened?: boolean;
  onEvent: OnEventLite;
  selectedPlaylistIds: string[]
  playlists: Playlist[];
  onSelectAllPlaylist: (checked: boolean) => void
  onSelectPlaylist: (playlist: Playlist, checked: boolean) => void
  onPlay: (playlist: Playlist) => void
}

export const PlaylistTable = (props: EventHistoryTableProps) => {
  const {
    onSelectAllPlaylist,
    onSelectPlaylist,
    playlists,
    selectedPlaylistIds,
    onPlay,
    onReorder,
    onEvent,
  } = props
  const hasSelected = selectedPlaylistIds.length > 0
  const [state, updateState] = useImmer({
    expanded: false,
  })
  return (
    <Accordion
      expanded={state.expanded}
      onChange={(e, expanded) => updateState((draft) => {
        draft.expanded = expanded
      })}
    >
      <AccordionSummary
        aria-controls="panel1a-content"
      >
        <View
          style={{
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
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Typography
                variant="h6"
              >
                Playlists
              </Typography>
            </View>
          </View>
          {
            state.expanded && hasSelected && (
              <Card
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  height: 32,
                  width: '100%',
                }}
              >
                <ListItem>
                  <Checkbox
                    onClick={(e) => e.stopPropagation()}
                    checked={!R.isEmpty(selectedPlaylistIds)
               && selectedPlaylistIds.length === playlists.length}
                    onChange={(_, checked) => onSelectAllPlaylist(checked)}
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                  />
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                  >
                    <Icon
                      name="delete_rounded"
                    />
                  </IconButton>
                </ListItem>
              </Card>
            )
              }
        </View>

      </AccordionSummary>
      <AccordionDetails>
        {
          playlists.length === 0 && (
            <Typography>
              Let's create a playlist.
            </Typography>
          )
        }
        <List dense>
          <SortableList
            onReorder={onReorder}
            data={playlists}
            renderItem={({
              provided,
              item: playlist,
            }) => {
              const { events, id, name } = playlist
              return (
                <Accordion
                  key={id}
                  ref={provided.innerRef}
                  {...provided.draggableProps}
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
                        <Checkbox
                          onClick={(e) => e.stopPropagation()}
                          checked={hasSelected
                          && selectedPlaylistIds.includes(playlist.id)}
                          onChange={(_, checked) => onSelectPlaylist(playlist, checked)}
                          inputProps={{ 'aria-label': 'primary checkbox' }}
                        />
                        <Typography
                          variant="h6"
                        >
                          {name}
                        </Typography>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}
                      >
                        <SpeedDialCreator
                          actions={[
                            {
                              name: 'Delete',
                              icon: {
                                name: 'delete_rounded',
                              },
                              onClick: (e) => {
                                e.stopPropagation()
                              },
                            },
                            {
                              name: 'Play',
                              icon: {
                                name: 'play_arrow',
                              },
                              onClick: (e) => {
                                e.stopPropagation()
                                onPlay(playlist)
                              },
                            },
                          ]}
                        />
                        <IconButton
                          edge="end"
                          disableFocusRipple
                          disableRipple
                          disableTouchRipple
                          {...provided.dragHandleProps}
                        >
                          <Icon name="drag_handle" />
                        </IconButton>
                      </View>
                    </View>
                  </AccordionSummary>
                  <AccordionDetails>
                    {
                        events.map((event) => (
                          <ListItem
                            key={event.id}
                          >
                            <ListItemAvatar>
                              <Checkbox
                                // checked={selectedPlaylistIds.includes(id)}
                                // onChange={(_, checked) => {
                                //   onSelectPlaylist(playlist, checked)
                                // }}
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </ListItemAvatar>
                            <ListItemText
                              primary={event.type}
                            />
                            <ListItemSecondaryAction>
                              <IconButton
                                edge="end"
                                aria-label="delete"
                                onClick={(e) => {
                                  e.stopPropagation()
                                }}
                              >
                                <Icon name="delete_rounded" />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))
                      }
                  </AccordionDetails>
                </Accordion>
              )
            }}
          />
        </List>
      </AccordionDetails>
    </Accordion>
  )
}
