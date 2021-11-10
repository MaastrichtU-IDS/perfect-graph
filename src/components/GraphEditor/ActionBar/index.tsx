import {
  Icon,
} from '@components/Icon'
import { EDITOR_MODE, EVENT } from '@constants'
import { useGraphEditor } from '@hooks'
import {
  Box, Button, FormControl, IconButton, InputLabel, Menu,
  MenuItem, Select, useTheme, SelectProps,
} from '@mui/material'
import {
  EditorMode, OnEventLite,
} from '@type'
import { readTextFile } from '@utils'
import DocumentPicker from '@utils/DocumentPicker'
import { useAnimation, useDisclosure, wrapComponent } from 'colay-ui'
import { Recorder } from 'colay-ui/components/Recorder'
// import Form from 'unitx-ui/components/Form'
import * as R from 'colay/ramda'
import React from 'react'
import { LayoutOptions } from './LayoutOptions'
// export const ACTION = {
//   EXPORT_DATA: 'EXPORT_DATA',
// }
type ActionOption = {
  visible?: boolean;
}

export type ActionBarProps = {
  renderMoreAction?: () => React.ReactElement;
  left?: React.FC;
  right?: React.FC;
  isOpen?: boolean;
  autoOpen?: boolean;
  mode?: EditorMode;
  layoutName?: string;
  theming?: {
    options?: {
      name: string;
      value: string;
    }[];
    value?: string;
  }
  recording?: boolean;
  eventRecording?: boolean;
  actions?: {
    add: ActionOption;
    recordEvents: ActionOption;
    delete: ActionOption;
    // record: { visible: boolean; };
    options: {
      actions: { import: ActionOption };
    };
    layout: ActionOption;
  };
  onAction: (action: { type: string; value?: any }) => void;
}

const DEFAULT_ACTIONS = {
  add: { visible: true },
  delete: { visible: true },
  recordEvents: { visible: true },
  options: {
    actions: { import: { visible: true } },
  },
  layout: { visible: true },
}
const RECORDING_STATUS_MAP = {
  START: 'START',
  STOP: 'STOP',
  RECORDING: 'RECORDING',
  IDLE: 'IDLE',
}

const HEIGHT = 40
// const AnimatedSurface = animated(Box)

const ActionBarElement = (props: ActionBarProps) => {
  const {
    renderMoreAction,
    isOpen = false,
    autoOpen = false,
    recording = false,
    eventRecording = false,
    // recordingActions = false,
    onAction,
    left: LeftComponent,
    right: RightComponent,
    theming = {
      options: [
        { name: 'Default', value: 'Default' },
        { name: 'Dark', value: 'Dark' },
      ],
      value: 'Default',
    },
  } = props
  const [
    {
      onEvent,
      graphEditorRef,
      mode,
      graphConfig,
    },
  ] = useGraphEditor(
    (editor) => ({
      onEvent: editor.onEvent,
      graphEditorRef: editor.graphEditorRef,
      mode: editor.mode,
      graphConfig: editor.graphConfig,
    }),
  )
  const {
    style: animationStyle,
    ref: animationRef,
  } = useAnimation({
    from: {
      bottom: -HEIGHT,
    },
    to: {
      bottom: 0,
    },
    autoPlay: false,
  })
  // const initialized = React.useRef(false)
  React.useEffect(() => {
    animationRef.current.play(isOpen)
  }, [animationRef.current, isOpen])
  const theme = useTheme()
  const recordingRef = React.useRef(
    RECORDING_STATUS_MAP.IDLE,
  )
  React.useMemo(() => {
    switch (recordingRef.current) {
      case RECORDING_STATUS_MAP.IDLE:
        recordingRef.current = recording ? RECORDING_STATUS_MAP.START : RECORDING_STATUS_MAP.IDLE
        break
      case RECORDING_STATUS_MAP.START:
        recordingRef.current = recording
          ? RECORDING_STATUS_MAP.RECORDING
          : RECORDING_STATUS_MAP.STOP
        break
      case RECORDING_STATUS_MAP.RECORDING:
        recordingRef.current = recording
          ? RECORDING_STATUS_MAP.RECORDING
          : RECORDING_STATUS_MAP.STOP
        break
      case RECORDING_STATUS_MAP.STOP:
        recordingRef.current = recording ? RECORDING_STATUS_MAP.START : RECORDING_STATUS_MAP.IDLE
        break

      default:
        break
    }
  }, [recording])
  // React.useEffect(() => {
  //   animationRef?.current?.start()
  // }, [])
  const actions = R.mergeDeepRight(DEFAULT_ACTIONS, props.actions ?? {})
  return (
    <Box
      style={{
        position: 'absolute',
        width: '100%',
        height: HEIGHT,
        left: 0,
        flexDirection: 'row',
        display: 'flex',
        justifyContent: 'space-between',
        // @ts-ignore
        backgroundColor: theme.palette.background.paper,
        ...animationStyle,
      }}
    >
      {LeftComponent && <LeftComponent />}
      <Box
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          display: 'flex',
          height: HEIGHT,
          // width: '100%',
        }}
      >
        {
          actions.add.visible && (
          <Button
            style={styles.button}
            startIcon={(
              <Icon name="add_circle" />
)}
            onClick={() => onEvent({
              type: EVENT.MODE_CHANGED,
              payload: {
                value: [
                  EDITOR_MODE.ADD,
                  EDITOR_MODE.CONTINUES_ADD,
                  // @ts-ignore
                ].includes(mode)
                  ? EDITOR_MODE.DEFAULT
                  : EDITOR_MODE.ADD,
              },
            })}
            variant={EDITOR_MODE.CONTINUES_ADD === mode ? 'contained' : 'outlined'}
            color={[
              EDITOR_MODE.ADD,
              EDITOR_MODE.CONTINUES_ADD,
              // @ts-ignore
            ].includes(mode) ? 'secondary' : 'primary'}
            onDoubleClick={() => onEvent({
              type: EVENT.MODE_CHANGED,
              payload: { value: EDITOR_MODE.CONTINUES_ADD },
            })}
          >
            Add
          </Button>
          )
        }
        {
          actions.delete.visible && (
          <Button
            style={styles.button}
            startIcon={(
              <Icon name="delete_rounded" />
            )}
            color={[
              EDITOR_MODE.DELETE,
              EDITOR_MODE.CONTINUES_DELETE,
              // @ts-ignore
            ].includes(mode)
              ? 'primary'
              : 'secondary'}
            variant={EDITOR_MODE.CONTINUES_DELETE === mode ? 'contained' : 'outlined'}
            onClick={() => onEvent({
              type: EVENT.MODE_CHANGED,
              payload: {
                value: [
                  EDITOR_MODE.DELETE,
                  EDITOR_MODE.CONTINUES_DELETE,
                // @ts-ignore
                ].includes(mode)
                  ? EDITOR_MODE.DEFAULT
                  : EDITOR_MODE.DELETE,
              },
            })}
            onDoubleClick={() => onEvent({
              type: EVENT.MODE_CHANGED,
              payload: { value: EDITOR_MODE.CONTINUES_DELETE },
            })}
          >
            Delete
          </Button>
          )
        }
        {
          actions.layout.visible && (
          <LayoutOptions
            layout={graphConfig?.layout}
            onEvent={onEvent}
            {...actions.layout}
          />
          )
        }
        {
          actions.recordEvents.visible && (
          <IconButton
            onClick={() => onEvent({ type: EVENT.TOGGLE_RECORD_EVENTS })}
          >
            <Icon
              name="addjust"
              color={!eventRecording ? 'inherit' : 'error'}
            />
          </IconButton>
          )
        }
        <Recorder
          // @ts-ignore
          getStream={() => graphEditorRef.current.app.renderer.view.captureStream(25)}
          render={({
            startRecording,
            stopRecording,
            status,
          }) => {
            if (recordingRef.current === RECORDING_STATUS_MAP.START) {
              recordingRef.current = RECORDING_STATUS_MAP.RECORDING
              startRecording()
            }
            if (recordingRef.current === RECORDING_STATUS_MAP.STOP) {
              recordingRef.current = RECORDING_STATUS_MAP.IDLE
              stopRecording()
            }
            return (
              <IconButton
                onClick={() => onEvent({ type: EVENT.TOGGLE_RECORD })}
              >
                <Icon
                  name="videocam"
                  color={status !== 'recording' ? 'inherit' : 'error'}
                />
              </IconButton>
            )
          }}
          onStop={(_, blob) => {
            onEvent({
              type: EVENT.RECORD_FINISHED,
              payload: { value: blob },
            })
          }}
        />
        <MoreOptions
          renderMoreAction={renderMoreAction}
          theming={theming}
          onEvent={onEvent}
          onAction={onAction}
        />
      </Box>
      {RightComponent && <RightComponent />}
      {
        !autoOpen && (
          <IconButton
            style={styles.icon}
            onClick={() => {
              onEvent({
                type: EVENT.TOGGLE_ACTION_BAR,
                avoidHistoryRecording: true,
              })
            }}
          >
            <Icon
              name="build_circle_outlined"
            />
          </IconButton>
        )
      }

    </Box>
  )
}
type MoreOptionsProps = {
  onEvent: OnEventLite;
} & Pick<ActionBarProps, 'renderMoreAction' | 'onAction' | 'theming'>

const OPTIONS = {
  Import: 'Import',
  Export: 'Export',
  ImportEvents: 'Import Events',
} as const
const MoreOptions = (props: MoreOptionsProps) => {
  const {
    renderMoreAction = () => <Box />,
    onEvent,
    onAction,
    theming,
  } = props
  const {
    anchorEl,
    isOpen,
    onClose,
    onOpen,
  } = useDisclosure({})
  const handleMenuItemClick = async (event: React.MouseEvent<HTMLLIElement>, index: number) => {
    onClose()
    const action = Object.values(OPTIONS)[index]
    switch (action) {
      case OPTIONS.Import: {
        const result = await DocumentPicker.getDocumentAsync({ type: 'application/json' })
        if (result.type === 'success') {
          const fileText = await readTextFile(result.file!)
          onEvent({
            type: EVENT.IMPORT_DATA,
            payload: { value: JSON.parse(fileText) },
          })
        }
        break
      }
      case OPTIONS.ImportEvents: {
        const result = await DocumentPicker.getDocumentAsync({ type: 'application/json' })
        if (result.type === 'success') {
          const fileText = await readTextFile(result.file!)
          onEvent({
            type: EVENT.IMPORT_EVENTS,
            payload: { value: JSON.parse(fileText) },
          })
        }
        break
      }
      case OPTIONS.Export:
        onAction({ type: EVENT.EXPORT_DATA })
        break

      default:
        break
    }
  }

  const handleThemeChange: SelectProps['onChange'] = (e) => {
    onAction({ type: EVENT.CHANGE_THEME, value: e.target.value })
    onClose()
  }

  return (
    <>
      <IconButton
        onClick={onOpen}
      >
        <Icon name="more_vert" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={onClose}
        style={{ width: 400 }}
      >
        {Object.values(OPTIONS).map((option, index) => (
          <MenuItem
            key={option}
            // selected={index === selectedIndex}
            onClick={(event) => handleMenuItemClick(event, index)}
          >
            {option}
          </MenuItem>
        ))}
        <FormControl fullWidth>
          <InputLabel id="theme-select-label">Theme</InputLabel>
          <Select
            labelId="theme-select-label"
            onChange={handleThemeChange}
            value={theming?.value}
          >
            {theming?.options?.map((themeOption) => (
              <MenuItem
                key={themeOption.value}
                value={themeOption.value}
              >
                {themeOption.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {renderMoreAction()}
      </Menu>
    </>
  )
}

export const ActionBar = wrapComponent<ActionBarProps>(ActionBarElement, {})

const styles = {
  icon: {
    width: 24,
    height: 24,
    position: 'absolute',
    left: 2,
    top: -26,
    fontSize: 24,
  },
  button: {
    marginRight: 10,
  },
} as const
