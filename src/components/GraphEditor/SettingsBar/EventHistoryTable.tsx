import { Icon } from '@components/Icon'
import { 
  Collapsible,
  CollapsibleContainer,
  CollapsibleTitle,
 } from '@components/Collapsible'
import { SortableList } from '@components/SortableList'
import { SpeedDialCreator } from '@components/SpeedDialCreator'
import { EVENT } from '@constants'
import { useGraphEditor } from '@hooks'
import {
  Card, Checkbox, IconButton, List,
  ListItem, ListItemAvatar, ListItemText, Typography,
} from '@mui/material'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
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
    isOpen: false,
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
        // @ts-ignore
        overflowY: 'auto',
        overflowX: 'hidden',
        // paddingRight: 10,
        // paddingLeft: 10,
        height: '100%',
        width: '100%',
      }}
    >
      <Collapsible>
        {
          () => (
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
                  onClick={() => updateState((draft) => {
                    draft.isOpen = !draft.isOpen
                  })}
                >
                  History
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
              state.isOpen && hasSelected && (
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
             && state.selectedEventIds.length === eventHistory!.events.length}
                      onChange={(e) => {
                        const { checked } = e.target
                        updateState((draft) => {
                          if (checked) {
                            draft.selectedEventIds = eventHistory!.events.map((event) => event.id)
                          } else {
                            draft.selectedEventIds = []
                          }
                        })
                      }}
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
            {
              state.isOpen && (
                <CollapsibleContainer>
                      {
                      eventHistory!.events.length === 0 && (
                        <Typography>
                          Let's do a few things.
                        </Typography>
                      )
                    }
                      <List dense>
                        <SortableList
                          onReorder={(result) => {
                            const { length } = eventHistory!.events
                            onEvent({
                              type: EVENT.REORDER_HISTORY_ITEM,
                              payload: {
                                fromIndex: length - result.source.index - 1,
                                toIndex: length - result.destination!.index! - 1,
                              },
                            })
                          }}
                          data={R.reverse(eventHistory!.events)}
                          renderItem={({
                            provided,
                            item: event,
                            index,
                          }) => {
                            const { length } = eventHistory!.events
                            return (
                              <ListItem
                                key={event.id}
                                selected={eventHistory!.currentIndex === (length - 1) - index}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                              >
                                <ListItemAvatar>
                                  <Checkbox
                                    checked={state.selectedEventIds.includes(event.id)}
                                    onChange={(e) => {
                                      const { checked } = e.target
                                      updateState((draft) => {
                                        if (checked) {
                                          draft.selectedEventIds.push(event.id)
                                        } else {
                                          draft.selectedEventIds = draft.selectedEventIds.filter((id) => id !== event.id)
                                        }
                                      })
                                    }}
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
                                        onClick: () => onEvent({
                                          type: EVENT.APPLY_EVENTS,
                                          payload: {
                                            events: [{
                                              ...eventHistory!.undoEvents[index],
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
                    </CollapsibleContainer>
              )
            }
            </>
          )
        }
      </Collapsible>
    </View>
  )
}

export const EventHistoryTable = wrapComponent<EventHistoryTableProps>(EventHistoryTableElement, {})
