import {
  EditorMode,
  Event,
  GraphConfig,
  GraphEditorRef,
  OnEvent,
} from '@type'
import { readTextFile } from '@utils'
import { EDITOR_MODE, EVENT, LAYOUT_NAMES } from '@utils/constants'
import React from 'react'
import {
  Button,
  Icon,
  IconButton,
  Select,
  Menu,
  MenuItem,
  Box,
  useTheme,
} from '@material-ui/core'
import { useAnimation, wrapComponent } from 'colay-ui'
// import Form from 'unitx-ui/components/Form'
import * as R from 'colay/ramda'
// import { DocumentPicker } from 'unitx-ui/@/DocumentPicker'
import Recorder from 'colay-ui/components/Recorder'

export const ACTION = {
  EXPORT_DATA: 'EXPORT_DATA',
}
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
  graphEditorRef: React.MutableRefObject<GraphEditorRef>;
  // layout?: LayoutOptionsValue;
  graphConfig?: GraphConfig;
  actions?: {
    add: ActionOption;
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

const ActionBar = (props: ActionBarProps) => {
  const {
    onEvent,
    renderMoreAction,
    mode,
    opened = false,
    recording = false,
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
        // @ts-ignore
        backgroundColor: theme.colors.surface,
        ...animationStyle,
      }}
    >
      <Box
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: HEIGHT,
          // width: '100%',
        }}
      >
        {
          actions.add.visible && (
          <Button
            style={styles.button}
            startIcon={<Icon
              >
                  plus-circle
                </Icon>}
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
              <Icon
              >
                delete-circle
              </Icon>
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
                color={status !== 'recording' ? 'primary' : 'error'}
                
              >
                record-re
              </Icon>
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
      >
      <Icon
        style={{
          position: 'absolute',
          left: 0,
          top: -(24),
          fontSize: 24
        }}
      >
        file-document-edit-outline
        </Icon>
      </IconButton>

    </AnimatedSurface>
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
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event: Event) => {
    setAnchorEl(event.currentTarget);
  }
  const handleMenuItemClick = (event: Event, index: number) => {
    setAnchorEl(event.currentTarget);
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
            onAction({ type: ACTION.EXPORT_DATA })
            // createOnActionCallback(EVENT.EXPORT_DATA)()
            break

          default:
            break
        }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
    <IconButton
      onClick={handleClick}
    >
      <Icon>
        dots-vertical
      </Icon>
    </IconButton>
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      <>
        {Object.values(OPTIONS).map((option, index) => (
          <MenuItem
            key={option}
            // selected={index === selectedIndex}
            onClick={(event) => handleMenuItemClick(event, index)}
          >
            {option}
          </MenuItem>
        ))}
        {renderMoreAction()}
      </>
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
  const [state, setState] = React.useState({
    visible: false,
  })
  const onItemSelect = React.useCallback((layoutName: string) => {
    setState({
      ...state,
      visible: false,
    })
    createOnActionCallback(
      EVENT.LAYOUT_SELECTED,
      {
        value: layoutName,
      },
    )()
  }, [setState, createOnActionCallback])
  const animationDuration = layout.animationDuration ?? 5000
  return (
    <Box />
    // <Popover
    //   anchor={(anchorProps) => (
    //     <Box {...anchorProps}>
    //       <SelectItem
    //         title={layout.name ?? 'Select Layout'}
    //         onPress={() => setState({ ...state, visible: !state.visible })}
    //       />
    //     </Box>
    //   )}
    //   visible={state.visible}
    //   onBackdropPress={() => setState({ ...state, visible: false })}
    // >
    //   <Box>
    //     {/* <Box>
    //       <Text>{Math.floor(animationDuration)}</Text>
    //       <Slider
    //         value={animationDuration}
    //         minimumValue={0}
    //         maximumValue={10000}
    //         onSlidingComplete={(animationDuration) => createOnActionCallback(
    //           EVENT.LAYOUT_ANIMATION_DURATION_CHANGED,
    //           {
    //             value: animationDuration,
    //           },
    //         )()}
    //       />
    //       <Divider />
    //     </Box> */}
    //     <Form
    //       schema={{
    //         title: 'Layout',
    //         properties: {
    //           name: {
    //             type: 'string',
    //             enum: LAYOUT_NAMES,
    //           },
    //           animationDuration: {
    //             type: 'number',
    //             minimum: 0,
    //             maximum: 10000,
    //           },
    //           refresh: {
    //             type: 'number',
    //             minimum: 0,
    //             maximum: 100,
    //           },
    //           maxIterations: {
    //             type: 'number',
    //             minimum: 0,
    //             maximum: 1000,
    //           },
    //           maxSimulationTime: {
    //             type: 'number',
    //             minimum: 0,
    //             maximum: 1000,
    //           },
    //         },
    //       }}
    //       extraData={[layout]}
    //       formData={{
    //         name: layout.name,
    //         animationDuration: layout.animationDuration,
    //         refresh: layout.refresh,
    //         maxIterations: layout.maxIterations,
    //         maxSimulationTime: layout.maxSimulationTime,
    //       }}
    //       onSubmit={(formData) => {
    //         createOnActionCallback(
    //           EVENT.LAYOUT_CHANGED,
    //           {
    //             value: formData,
    //           },
    //         )()
    //       }}
    //     />
    //     {/* {LAYOUT_NAMES.map((name) => (
    //       <SelectItem
    //         title={name}
    //         onPress={() => onItemSelect(name)}
    //         selected={layout.name === name}
    //       />
    //     ))} */}
    //   </Box>
    // </Popover>
  )
}
export default wrapComponent<ActionBarProps>(ActionBar, {})

const styles = {
  icon: {
    width: 24,
    height: 24,
    position: 'absolute',
    right: -24,
    top: 0,
  },
  button: {
    marginRight: 10,
  },
}
