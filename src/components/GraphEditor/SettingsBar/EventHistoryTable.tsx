import { Icon } from '@components/Icon'
import { SortableList } from '@components/SortableList'
import { SpeedDialCreator } from '@components/SpeedDialCreator'
import {
  Card, Checkbox, IconButton, List,
  ListItem, ListItemAvatar, ListItemText, Typography,
} from '@material-ui/core'
import Accordion from '@material-ui/core/Accordion'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import {
  EventHistory,
  OnEventLite,
} from '@type'
import { EVENT } from '@constants'
import { useGraphEditor } from '@hooks'
import {
  View,
  wrapComponent,
} from 'colay-ui'
import { useImmer } from 'colay-ui/hooks/useImmer'
import * as R from 'colay/ramda'
import React from 'react'

export type EventHistoryTableProps = {
  onCreatePlaylistClick: (selectedEventIds: string[]) => void;
}

const EventHistoryTableElement = (props: EventHistoryTableProps) => {
  const {
    onCreatePlaylistClick,
  } = props
  const [state, updateState] = useImmer({
    expanded: false,
    selectedEventIds: [] as string[],
  })
  const hasSelected = state.selectedEventIds.length > 0
  const [
    {
      onEvent,
      eventHistory,
    },
  ] = useGraphEditor(
    (editor) => ({
      onEvent: editor.onEvent,
      eventHistory: editor.eventHistory,
    }),
  )
  return (
    <View
      style={{
        overflowY: 'auto',
        overflowX: 'hidden',
        // paddingRight: 10,
        // paddingLeft: 10,
        height: '100%',
        width: '100%',
      }}
    >
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
                  History
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
                  onClick={(e) => {
                    e.stopPropagation()
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
                      checked={!R.isEmpty(state.selectedEventIds)
             && state.selectedEventIds.length === eventHistory.events.length}
                      onChange={(_, checked) => updateState((draft) => {
                        if (checked) {
                          draft.selectedEventIds = eventHistory.events.map((event) => event.id)
                        } else {
                          draft.selectedEventIds = []
                        }
                      })}
                      onClick={(e) => e.stopPropagation()}
                      inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation()
                        onCreatePlaylistClick(state.selectedEventIds)
                        updateState((draft) => {
                          draft.selectedEventIds = []
                        })
                      }}
                    >
                      <Icon
                        name="playlist_add"
                      />
                    </IconButton>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation()
                        onEvent({
                          type: EVENT.DELETE_HISTORY_ITEM,
                          payload: {
                            itemIds: state.selectedEventIds,
                          },
                        })
                        updateState((draft) => {
                          draft.selectedEventIds = []
                        })
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
          eventHistory.events.length === 0 && (
            <Typography>
              Let's do a few things.
            </Typography>
          )
        }
          <List dense>
            <SortableList
              onReorder={(result) => {
                const { length } = eventHistory.events
                onEvent({
                  type: EVENT.REORDER_HISTORY_ITEM,
                  payload: {
                    fromIndex: length - result.source.index - 1,
                    toIndex: length - result.destination?.index - 1,
                  },
                })
              }}
              data={R.reverse(eventHistory.events)}
              renderItem={({
                provided,
                item: event,
                index,
              }) => {
                const { length } = eventHistory.events
                return (
                  <ListItem
                    key={event.id}
                    selected={eventHistory.currentIndex === (length - 1) - index}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
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
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',

                      }}
                    >
                      <SpeedDialCreator
                        actions={[
                          {
                            name: 'Redo',
                            icon: {
                              name: 'navigate_next',
                            },
                            onClick: (e) => onEvent({
                              type: EVENT.APPLY_EVENTS,
                              payload: {
                                events: [{
                                  ...event,
                                  avoidEventRecording: true,
                                  avoidHistoryRecording: true,
                                }],
                              },
                            }),
                          },
                          {
                            name: 'Undo',
                            icon: {
                              name: 'navigate_before',
                            },
                            onClick: (e) => onEvent({
                              type: EVENT.APPLY_EVENTS,
                              payload: {
                                events: [{
                                  ...eventHistory.undoEvents[index],
                                  avoidEventRecording: true,
                                  avoidHistoryRecording: true,
                                }],
                              },
                            }),
                          },
                          {
                            name: 'Delete',
                            icon: {
                              name: 'delete_rounded',
                            },
                            onClick: () => onEvent({
                              type: EVENT.DELETE_HISTORY_ITEM,
                              payload: {
                                itemIds: [event.id],
                              },
                              avoidEventRecording: true,
                              avoidHistoryRecording: true,
                            }),
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
                  </ListItem>
                )
              }}
            />
          </List>
        </AccordionDetails>
      </Accordion>
    </View>
  )
}

export const EventHistoryTable = wrapComponent<EventHistoryTableProps>(EventHistoryTableElement, {})
