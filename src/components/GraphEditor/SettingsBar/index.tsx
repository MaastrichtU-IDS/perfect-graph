import { Icon } from '@components/Icon'
import {
  Accordion, AccordionDetails, AccordionSummary, Button, Dialog,
  DialogTitle, Divider,
  IconButton, Paper, TextField, Typography,
} from '@material-ui/core'
import { FormProps } from '@rjsf/core'
import Form from '@rjsf/material-ui'
import {
  Cluster, EditorMode, EventHistory, OnEventLite,
  Playlist,
} from '@type'
import { EVENT } from '@utils/constants'
import {
  useAnimation,
  View, wrapComponent,
} from 'colay-ui'
import * as R from 'colay/ramda'
import React from 'react'
import { useImmer } from 'colay-ui/hooks/useImmer'
import { ClusterTable } from './ClusterTable'
import { EventHistoryTable } from './EventHistoryTable'
import { PlaylistTable } from './PlaylistTable'

type SettingsForm = {
  schema: FormProps<any>['schema'];
} & Partial<
Pick<
FormProps<any>,
'onChange'|'onSubmit'|'formData'| 'uiSchema' | 'children'
>
>
export type SettingsBarProps = {
  opened?: boolean;
  onEvent: OnEventLite;
  forms?: SettingsForm[];
  eventHistory?: EventHistory;
  clusters?: Cluster[];
  playlists?: Playlist[];
  createClusterForm?: FormProps<any>;
  editorMode: EditorMode;
  graphEditorLocalDataRef: any;
}

const WIDTH_PROPORTION = 30
const SettingsBarElement = (props: SettingsBarProps) => {
  const {
    opened = false,
    onEvent,
    // schema = {},
    forms = [],
    eventHistory,
    clusters,
    createClusterForm,
    graphEditorLocalDataRef,
    editorMode,
    playlists,
    // children,
    // ...formProps
  } = props
  const {
    style: animationStyle,
    ref: animationRef,
  } = useAnimation({
    from: {
      left: `-${WIDTH_PROPORTION}%`,
    },
    to: {
      left: '0%',
    },
    autoPlay: false,
  })
  // const initialized = React.useRef(false)
  React.useEffect(() => {
    animationRef.current.play(opened)
  }, [animationRef, opened])
  const [state, updateState] = useImmer({
    createPlaylistDialog: {
      visible: false,
    },
    selectedEventIds: [] as string[]
  })
  return (
    <Paper
      style={{
        position: 'absolute',
        width: `${WIDTH_PROPORTION}%`,
        height: '100%',
        top: 0,
        ...animationStyle,
      }}
    >
      <View
        style={{
          overflowY: 'auto',
          overflowX: 'hidden',
          // paddingRight: 10,
          // paddingLeft: 10,
          height: '100%', // eventHistory ? '50%' : '100%',
        }}
      >
        {
        forms.map((form, index) => (
          <React.Fragment key={form.schema.title}>
            <Accordion>
              <AccordionSummary>
                <Typography
                  variant="h6"
                >
                  {form.schema.title}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Form
                  key={form.schema.title ?? `${index}`}
            // schema={schema}
            // {...formProps}
                  {...form}
                  schema={R.omit(['title'])(form.schema)}
                  onSubmit={(
                    e,
                  ) => onEvent({
                    type: EVENT.SETTINGS_FORM_CHANGED,
                    payload: { form, value: e.formData, index },
                  })}
                >
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                  >
                    Apply
                  </Button>
                </Form>
              </AccordionDetails>
            </Accordion>
            <View style={{ marginTop: 5, marginBottom: 5 }} />
          </React.Fragment>
        ))
      }
        <Divider />
        {
        eventHistory && (
        <>
          <View
            style={{
              // height: '50%',
              width: '100%',
            }}
          >
            <EventHistoryTable
              onEvent={onEvent}
              eventHistory={eventHistory}
              onCreatePlaylistClick={(selectedEventIds) => updateState((draft) => {
                draft.createPlaylistDialog.visible = true
                draft.selectedEventIds = selectedEventIds
              })}
            />
          </View>
          <Divider style={{ marginTop: 5, marginBottom: 5 }} />
        </>
        )
      }
        <Divider />
        {
          playlists && (
          <PlaylistTable
            createPlaylistDialog={{
              ...state.createPlaylistDialog,
              onClose: () => updateState((draft) => {
                draft.createPlaylistDialog.visible = false
              }),
            }}
            onEvent={onEvent}
            playlists={playlists}
            onCreatePlaylist={(playlistWithoutEvents) => {
              const playlistEvents = state.selectedEventIds.map(
                (eventId) => eventHistory.events.find((event) => event.id === eventId)!,
              ).sort((item, other) => (item.date > other.date ? 1 : -1))
              updateState((draft) => {
                draft.createPlaylistDialog.visible = false
              })
              onEvent({
                type: EVENT.CREATE_PLAYLIST,
                payload: {
                  items: [
                    {
                      ...playlistWithoutEvents,
                      events: playlistEvents,
                    },
                  ],
                },
              })
            }}
          />

          )
        }
        <Divider />
        {
        clusters && (
        <>
          <View
            style={{
              // height: '50%',
              width: '100%',
            }}
          >
            <ClusterTable
              clusters={clusters}
              onEvent={onEvent}
              createClusterForm={createClusterForm}
              graphEditorLocalDataRef={graphEditorLocalDataRef}
              editorMode={editorMode}
            />
          </View>
          <Divider style={{ marginTop: 5, marginBottom: 5 }} />
        </>
        )
      }
      </View>

      <IconButton
        style={styles.icon}
        onClick={() => {
          onEvent({
            type: EVENT.TOGGLE_FILTER_BAR,
            avoidHistoryRecording: true,
          })
        }}
      >
        <Icon
          name="settings"
        />
      </IconButton>
    </Paper>
  )
}

export const SettingsBar = wrapComponent<SettingsBarProps>(SettingsBarElement, {})

const styles = {
  icon: {
    position: 'absolute',
    right: -36,
    top: 2,
    fontSize: 24,
  },
} as const
