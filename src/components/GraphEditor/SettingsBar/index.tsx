import { Icon } from '@components/Icon'
import { EVENT } from '@constants'
import { useGraphEditor } from '@hooks'
import {
  Accordion, AccordionDetails, AccordionSummary, Button, Divider,
  IconButton, Paper, Typography,
} from '@material-ui/core'
import { FormProps } from '@rjsf/core'
import Form from '@rjsf/material-ui'
import {
  useAnimation,
  View, wrapComponent,
} from 'colay-ui'
import { useImmer } from 'colay-ui/hooks/useImmer'
import * as R from 'colay/ramda'
import React from 'react'
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
  isOpen?: boolean;
  forms?: SettingsForm[];
  createClusterForm?: FormProps<any>;
}

const WIDTH_PROPORTION = 30
const SettingsBarElement = (props: SettingsBarProps) => {
  const {
    isOpen = false,
    // schema = {},
    forms = [],
    createClusterForm,
    // children,
    // ...formProps
  } = props
  const [
    {
      onEvent,
      eventHistory,
      clusters,
      playlists,
    },
  ] = useGraphEditor(
    (editor) => ({
      onEvent: editor.onEvent,
      eventHistory: editor.eventHistory,
      playlists: editor.playlists,
      clusters: editor.graphConfig?.clusters,
      // editorMode: editor.mode,
      // graphEditorLocalDataRef: editor.localDataRef,
    }),
  )
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
    animationRef.current.play(isOpen)
  }, [animationRef, isOpen])
  const [state, updateState] = useImmer({
    createPlaylistDialog: {
      visible: false,
    },
    selectedEventIds: [] as string[],
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
          // @ts-ignore
          overflowY: 'auto',
          overflowX: 'hidden',
          // paddingRight: 10,
          // paddingLeft: 10,
          height: '100%', // eventHistory ? '50%' : '100%',
        }}
      >
        {
        forms.map((form, index) => {
          const title = form.schema?.title ?? `Form-${index}`
          return (
            <React.Fragment key={title}>
              <Accordion>
                <AccordionSummary>
                  <Typography
                    variant="h6"
                  >
                    {title}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Form
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
                    {
                      form.children ?? (
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                      >
                        Apply
                      </Button>
                      )
}
                  </Form>
                </AccordionDetails>
              </Accordion>
              <View style={{ marginTop: 5, marginBottom: 5 }} />
            </React.Fragment>
          )
        })
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
            onCreatePlaylist={(playlistWithoutEvents) => {
              const playlistEvents = state.selectedEventIds.map(
                (eventId) => eventHistory!.events.find((event) => event.id === eventId)!,
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
              createClusterForm={createClusterForm}
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
