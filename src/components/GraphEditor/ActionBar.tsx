import {
  EditorMode,
  Event,
  GraphConfig,
  GraphEditorRef,
  OnEvent,
} from '@type'
// import { readTextFile } from '@utils'
import { EDITOR_MODE, EVENT, LAYOUT_NAMES } from '@utils/constants'
import React from 'react'
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  useTheme,
  Popover,
  FormControl,
  InputLabel,
  Select,
} from '@material-ui/core'
import {
  Icon,
} from '@components/Icon'
import { useAnimation, wrapComponent, useDisclosure } from 'colay-ui'
import Form from '@rjsf/material-ui'
// import Form from 'unitx-ui/components/Form'
import * as R from 'colay/ramda'
// import { DocumentPicker } from 'unitx-ui/@/DocumentPicker'
import { Recorder } from 'colay-ui/components/Recorder'

// export const ACTION = {
//   EXPORT_DATA: 'EXPORT_DATA',
// }
type ActionOption = {
  visible?: boolean;
}

export type ActionBarProps = {
  renderMoreAction?: () => React.ReactElement;
  opened?: boolean;
  onEvent?: OnEvent;
  mode?: EditorMode;
  layoutName?: string;
  recording?: boolean;
  eventRecording?: boolean;
  graphEditorRef: React.MutableRefObject<GraphEditorRef>;
  // layout?: LayoutOptionsValue;
  graphConfig?: GraphConfig;
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

type CreateActionCallback = (
  type: Event,
  extraData?: any,
) => () => void

const ActionBarElement = (props: ActionBarProps) => {
  const {
    onEvent,
    renderMoreAction,
    mode,
    opened = false,
    recording = false,
    eventRecording = false,
    // recordingActions = false,
    graphEditorRef,
    graphConfig,
    onAction,
  } = props
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
    animationRef.current.play(opened)
  }, [animationRef.current, opened])
  const createOnActionCallback = React.useCallback(
    (
      type: Event,
      extraData?: any,
      // @ts-ignore
    ) => () => onEvent?.({ type, extraData }),
    [onEvent],
  )
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
        // @ts-ignore
        backgroundColor: theme.palette.background.paper,
        ...animationStyle,
      }}
    >
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
            onClick={createOnActionCallback(EVENT.MODE_CHANGED, {
              value: [
                EDITOR_MODE.ADD,
                EDITOR_MODE.CONTINUES_ADD,
                // @ts-ignore
              ].includes(mode)
                ? EDITOR_MODE.DEFAULT
                : EDITOR_MODE.ADD,
            })}
            variant={EDITOR_MODE.CONTINUES_ADD === mode ? 'contained' : 'outlined'}
            color={[
              EDITOR_MODE.ADD,
              EDITOR_MODE.CONTINUES_ADD,
              // @ts-ignore
            ].includes(mode) ? 'secondary' : 'primary'}
            onDoubleClick={createOnActionCallback(
              EVENT.MODE_CHANGED,
              { value: EDITOR_MODE.CONTINUES_ADD },
            )}
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
            onClick={createOnActionCallback(EVENT.MODE_CHANGED, {
              value: [
                EDITOR_MODE.DELETE,
                EDITOR_MODE.CONTINUES_DELETE,
                // @ts-ignore
              ].includes(mode)
                ? EDITOR_MODE.DEFAULT
                : EDITOR_MODE.DELETE,
            })}
            onDoubleClick={createOnActionCallback(
              EVENT.MODE_CHANGED,
              { value: EDITOR_MODE.CONTINUES_DELETE },
            )}
          >
            Delete
          </Button>
          )
        }
        {
          actions.layout.visible && (
          <LayoutOptions
            layout={graphConfig?.layout}
            createOnActionCallback={createOnActionCallback}
          />
          )
        }
        {
          actions.recordEvents.visible && (
          <IconButton
            onClick={createOnActionCallback(EVENT.TOGGLE_RECORD_EVENTS)}
          >
            <Icon
              name="addjust"
              color={!eventRecording ? 'inherit' : 'error'}
            />
          </IconButton>
          )
        }
        {/* <Icon
          name="playlist-play"
          color={recordingActions ? 'red' : 'black'}
          onPress={createOnActionCallback(EVENT.TOGGLE_RECORD_ACTIONS)}
        /> */}
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
                onClick={createOnActionCallback(EVENT.TOGGLE_RECORD)}
              >
                <Icon
                  name="videocam"
                  color={status !== 'recording' ? 'inherit' : 'error'}
                />
              </IconButton>
            )
          }}
          onStop={(_, blob) => {
            createOnActionCallback(
              EVENT.RECORD_FINISHED,
              { value: blob },
            )()
          }}
        />
        <MoreOptions
          renderMoreAction={renderMoreAction}
          createOnActionCallback={createOnActionCallback}
          onAction={onAction}
        />
      </Box>
      <IconButton
        onClick={createOnActionCallback(EVENT.TOGGLE_ACTION_BAR)}
        style={styles.icon}
      >
        <Icon
          name="build_circle_outlined"
        />
      </IconButton>

    </Box>
  )
}
type MoreOptionsProps = {
  createOnActionCallback: (
    type: Event,
    extraData?: any,
  ) => () => void;
} & Pick<ActionBarProps, 'renderMoreAction' | 'onAction'>

const OPTIONS = {
  Import: 'Import',
  Export: 'Export',
} as const
const MoreOptions = (props: MoreOptionsProps) => {
  const {
    renderMoreAction = () => <Box />,
    createOnActionCallback,
    onAction,
  } = props
  const {
    anchorEl,
    isOpen,
    onClose,
    onOpen,
  } = useDisclosure({})
  const handleMenuItemClick = (event: Event, index: number) => {
    onClose()
    const action = Object.values(OPTIONS)[index]
    switch (action) {
      case OPTIONS.Import: {
        // const result = await DocumentPicker.getDocumentAsync({ type: 'application/json' })
        // if (result.type === 'success') {
        //   const fileText = await readTextFile(result.file!)
        //   createOnActionCallback(
        //     EVENT.IMPORT_DATA,
        //     { value: JSON.parse(fileText) },
        //   )()
        // }
        break
      }
      case OPTIONS.Export:
        onAction({ type: EVENT.EXPORT_DATA })
        // createOnActionCallback(EVENT.EXPORT_DATA)()
        break

      default:
        break
    }
  }

  const handleThemeChange = (e: Event) => {
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
          <InputLabel id="demo-simple-select-label">Default</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            // value={age}
            onChange={handleThemeChange}
          >
            <MenuItem value="Default">Default</MenuItem>
            <MenuItem value="Dark">Dark</MenuItem>
            {/* <MenuItem value={30}>Thirty</MenuItem> */}
          </Select>
        </FormControl>
        {renderMoreAction()}
      </Menu>
    </>
  )
}

type LayoutOptionsValue = {
  name?: string;
  animationDuration?: number;
}
type LayoutOptionsProps = {
  createOnActionCallback: CreateActionCallback;
  layout?: LayoutOptionsValue;
}

const LayoutOptions = (props: LayoutOptionsProps) => {
  const {
    layout = {},
    createOnActionCallback,
  } = props
  // const [anchorEl, setAnchorEl] = React.useState(null)

  // const handleClick = (event) => {
  //   setAnchorEl(event.currentTarget)
  // }

  // const handleClose = () => {
  //   setAnchorEl(null)
  // }
  const {
    anchorEl,
    isOpen,
    onClose,
    onOpen,
  } = useDisclosure({})
  const onSubmitCallback = React.useCallback((e) => {
    createOnActionCallback(
      EVENT.LAYOUT_CHANGED,
      {
        form: e,
        value: e.formData,
      },
    )()
    onClose()
  }, [createOnActionCallback])
  // const onItemSelect = React.useCallback((layoutName: string) => {
  //   handleClose()
  //   createOnActionCallback(
  //     EVENT.LAYOUT_SELECTED,
  //     {
  //       value: layoutName,
  //     },
  //   )()
  // }, [setAnchorEl, createOnActionCallback])
  // const animationDuration = layout.animationDuration ?? 5000
  return (
    <Box>
      <Button
        onClick={onOpen}
        sx={{
          color: (theme) => theme.palette.text.secondary,
        }}
        // variant="text"
      >
        {layout.name ?? 'Select Layout'}
      </Button>
      <Popover
        // id={id}
        open={isOpen}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        PaperProps={{
          sx: {
            width: { sx: '10vw', md: '50vw' },
          },
        }}
      >
        <Box
          sx={{
            width: { sx: '10vw', md: '50vw' },
          }}
        >
          <Form
            schema={{
              title: 'Layout',
              properties: {
                name: {
                  type: 'string',
                  enum: LAYOUT_NAMES,
                },
                animationDuration: {
                  type: 'number',
                  minimum: 0,
                  maximum: 10000,
                },
                refresh: {
                  type: 'number',
                  minimum: 0,
                  maximum: 100,
                },
                maxIterations: {
                  type: 'number',
                  minimum: 0,
                  maximum: 1000,
                },
                maxSimulationTime: {
                  type: 'number',
                  minimum: 0,
                  maximum: 1000,
                },
              },
            }}
            extraData={[layout]}
            formData={{
              name: layout.name,
              animationDuration: layout.animationDuration,
              refresh: layout.refresh,
              maxIterations: layout.maxIterations,
              maxSimulationTime: layout.maxSimulationTime,
            }}
            onSubmit={onSubmitCallback}
          />
        </Box>
      </Popover>
    </Box>
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
}
