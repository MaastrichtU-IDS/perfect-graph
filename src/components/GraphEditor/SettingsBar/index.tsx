import { Collapsible, CollapsibleContainer, CollapsibleTitle } from '@components/Collapsible'
import { Form } from '@components/Form'
import { Icon } from '@components/Icon'
import { ResizeDivider } from '@components/ResizeDivider'
import { EVENT, SIDE_PANEL_DEFAULT_HEIGHT, SIDE_PANEL_DEFAULT_WIDTH } from '@constants'
import { useGraphEditor } from '@hooks'
import { useDrag } from '@hooks/useDrag'
import {
  Box, Divider,
  IconButton, Paper,
} from '@mui/material'
import { FormProps, CollapsibleSectionCommon } from '@type'
import {
  useAnimation,
  View, wrapComponent,
} from 'colay-ui'
import { useImmer } from 'colay-ui/hooks/useImmer'
import * as R from 'colay/ramda'
import React from 'react'
import { ClusterTable } from './ClusterTable'
import { EventHistoryTable } from './EventHistoryTable'
import { LayoutOptions } from './LayoutOptions'
import { PlaylistTable } from './PlaylistTable'

type DefaultsOption = {
  visible?: boolean;
}

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
  defaults?: {
    layout?: DefaultsOption;
  }
}

const SECTION_NAMES = {
  layout: 'layout',
  history: 'history',
  playlist: 'playlist',
  clusters: 'clusters'
}

const SECTIONS = [
  'layout',
  'history',
  'playlist',
  'clusters'
]

const SettingsBarElement = (props: SettingsBarProps) => {
  const {
    isOpen = false,
    // schema = {},
    forms = [],
    createClusterForm,
    defaults = {},
    // children,
    // ...formProps
  } = props
  const [
    {
      onEvent,
      eventHistory,
      clusters,
      playlists,
      layout,
    },
  ] = useGraphEditor(
    (editor) => ({
      onEvent: editor.onEvent,
      eventHistory: editor.eventHistory,
      playlists: editor.playlists,
      clusters: editor.graphConfig?.clusters,
      layout: editor.graphConfig?.layout,
      // editorMode: editor.mode,
      // graphEditorLocalDataRef: editor.localDataRef,
    }),
  )
  const localDataRef = React.useRef({
    width: SIDE_PANEL_DEFAULT_WIDTH,
    height: SIDE_PANEL_DEFAULT_HEIGHT
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
  }, [
    localDataRef.current.width,
  ])
  React.useEffect(
    () => {
      animationRef.current.play(isOpen)
    }, 
    [animationRef, isOpen]
  )

  const [_, updateState, stateSettings] = useImmer({
    createPlaylistDialog: {
      visible: false,
    },
    selectedEventIds: [] as string[],
    sections: {} as Record<string, CollapsibleSectionCommon>,
  })
  React.useMemo(() => {
    const closeAllOtherSections = (draft: any, sectionName: string) => {
      Object.keys(draft.sections).forEach(key => {
        draft.sections[key].isOpen = false
      })
    }
    updateState((draft) => {
      forms.forEach((section, index) => {
        const formName = `form${index}`
        draft.sections[formName] = {
          isOpen: false,
          onChange: (isOpen: boolean) => {
            updateState((draft) => {
              closeAllOtherSections(draft, formName)
              draft.sections[formName].isOpen = isOpen
            })
          }
        }
      })
      SECTIONS.forEach((sectionName) => {
        draft.sections[sectionName] = {
          isOpen: false,
          onChange: (isOpen: boolean) => {
            updateState((draft) => {
              closeAllOtherSections(draft, sectionName)
              draft.sections[sectionName].isOpen = isOpen
            })
          }
        }
      })
      return {
        silent: true
      }
    })
  }, [forms])
  const state = stateSettings.get()
  const containerRef = React.useRef<HTMLDivElement>()
  const onMouseDown = useDrag({
    ref: containerRef,
    onDrag: ({ x, y }, rect) => {
      localDataRef.current.width = rect.width - x
      localDataRef.current.height = rect.height - y
      const target = containerRef.current!
      target.style.width = `${localDataRef.current.width}px`
      target.style.height = `${localDataRef.current.height}px`
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
          // borderRadius: 5,
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
          const formSection = state.sections[`form${index}`]
          const {
            isOpen
          } = formSection
          return (
            <React.Fragment key={title}>
              <Collapsible
                isOpen={isOpen}
              >
                {
                  () => (
                    <>
                      <CollapsibleTitle
                          onClick={() => formSection.onChange(!isOpen)}
                        >
                          {title}
                        </CollapsibleTitle>
                      {
                        isOpen && (
                          <CollapsibleContainer
                          >
                            <Form
                            {...form}
                            schema={R.omit(['title'])(form.schema)}
                            onSubmit={(
                              e,
                            ) => onEvent({
                              type: EVENT.SETTINGS_FORM_CHANGED,
                              payload: { form, value: e.formData, index },
                            })}
                            onClear={(
                              e,
                            ) => onEvent({
                              type: EVENT.SETTINGS_FORM_CLEAR,
                              payload: { form, value: e.formData, index },
                            })}
                          />
                          </CollapsibleContainer>
                        )
                      }
                    </>
                  )
                }
              </Collapsible>
              <View style={{ marginTop: 5, marginBottom: 5 }} />
            </React.Fragment>
          )
        })
      }
      <LayoutOptions
        {...state.sections[SECTION_NAMES.layout]}
        layout={layout}
        onEvent={onEvent}
        {...(defaults.layout ?? {})}
      />
        {/* <Divider /> */}
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
              {...state.sections[SECTION_NAMES.history]}
              onCreatePlaylistClick={(selectedEventIds) => updateState((draft) => {
                draft.createPlaylistDialog.visible = true
                draft.selectedEventIds = selectedEventIds
              })}
            />
          </View>
          {/* <Divider style={{ marginTop: 5, marginBottom: 5 }} /> */}
        </>
        )
      }
        {/* <Divider /> */}
        {
          playlists && (
          <PlaylistTable
            {...state.sections[SECTION_NAMES.playlist]}
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
        {/* <Divider /> */}
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
              {...state.sections[SECTION_NAMES.clusters]}
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

      <View
        style={{
          flexDirection: 'row',
          position: 'absolute',
          right: -112,
          top: 2,
        }}
      >
        <IconButton
          style={{
            fontSize: 24,
          }}
          onClick={() => {
            onEvent({
              type: EVENT.TOGGLE_FILTER_BAR,
              avoidHistoryRecording: true,
            })
          }}
        >
          <Icon
            name="settings_outlined" //"build_circle_outlined"
          />
        </IconButton>
        <IconButton
          style={{
            fontSize: 24,
          }}
          onClick={() => {
            onEvent({
              type: EVENT.TOGGLE_DATA_BAR,
              avoidHistoryRecording: true,
            })
          }}
        >
          <Icon
            name="article_outlined"//"info_outlined"
          />
        </IconButton>
        <IconButton
            style={{
              fontSize: 24,
            }}
            onClick={() => {
              onEvent({
                type: EVENT.TOGGLE_ACTION_BAR,
                avoidHistoryRecording: true,
              })
            }}
          >
            <Icon
              name="app_registration_outlined" //"tune_outlined" // "settings"
            />
          </IconButton>
      </View>
    </Box>
  )
}

export const SettingsBar = wrapComponent<SettingsBarProps>(SettingsBarElement, {})
