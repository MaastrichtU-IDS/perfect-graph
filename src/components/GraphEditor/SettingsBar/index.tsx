import { Icon } from '@components/Icon'
import { EVENT, SIDE_PANEL_DEFAULT_WIDTH } from '@constants'
import { useGraphEditor } from '@hooks'
import {
  Accordion, AccordionDetails, AccordionSummary, Button, Divider,
  IconButton, Paper, Typography, Box,
} from '@mui/material'
import { FormProps } from '@rjsf/core'
import Form from '@rjsf/material-ui'
import {
  useAnimation,
  View, wrapComponent,
} from 'colay-ui'
import { useImmer } from 'colay-ui/hooks/useImmer'
import React from 'react'
import * as R from 'colay/ramda'
import { useDrag } from '@hooks/useDrag'
import { ResizeDivider } from '@components/ResizeDivider'
import { ClusterTable } from './ClusterTable'
import { EventHistoryTable } from './EventHistoryTable'
import { PlaylistTable } from './PlaylistTable'

type SettingsForm = {
  schema: FormProps<any>['schema'];
} & Partial<
Pick<
FormProps<any>,
'onChange' | 'onSubmit' | 'formData' | 'uiSchema' | 'children'
>
>
export type SettingsBarProps = {
  isOpen?: boolean;
  forms?: SettingsForm[];
  createClusterForm?: FormProps<any>;
}

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
  const localDataRef = React.useRef({
    width: SIDE_PANEL_DEFAULT_WIDTH,
  })
  const {
    style: animationStyle,
    ref: animationRef,
  } = useAnimation({
    from: {
      width: 0,
    },
    to: {
      width: localDataRef.current.width,
    },
    autoPlay: false,
  }, [localDataRef.current.width])
  React.useEffect(() => {
    animationRef.current.play(isOpen)
  }, [animationRef, isOpen])
  const [state, updateState] = useImmer({
    createPlaylistDialog: {
      visible: false,
    },
    selectedEventIds: [] as string[],
  })
  const containerRef = React.useRef()
  const onMouseDown = useDrag({
    ref: containerRef,
    onDrag: ({ x, y }, rect) => {
      localDataRef.current.width = rect.width - x
      const target = containerRef.current
      target.style.width = `${localDataRef.current.width}px`
    },
  })
  return (
    <Box
      ref={containerRef}
      style={{
        position: 'absolute',
        height: '60%',
        top: 0,
        left: 2,
        ...animationStyle,
      }}
    >
      <Paper
        sx={{ 
          boxShadow: 2,
          borderColor: 'grey.500',
          borderRadius: 5,
          borderWidth: 2,
          overflow: 'hidden',
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
        }}
      >
      <View
        style={{
          // @ts-ignore
          overflowY: 'auto',
          overflowX: 'hidden',
          height: '100%',
          flex: 1,
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
      <ResizeDivider
        onMouseDown={onMouseDown}
      />
      </Paper>
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
    </Box>
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
