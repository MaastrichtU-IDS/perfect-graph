import {
  EditorMode, Event,
  GraphConfig, GraphEditorRef, OnEvent,
} from '@type'
import { readTextFile } from '@utils'
import { EDITOR_MODE, EVENT, LAYOUT_NAMES } from '@utils/constants'
import React from 'react'
import { StyleSheet } from 'react-native'
import {
  Button,
  Icon,
  MenuItem,
  OverflowMenu,
  Popover,
  SelectItem,
  useTheme,
  View,
  wrapComponent,
} from 'unitx-ui'
import Form from 'unitx-ui/components/Form'
import * as R from 'unitx/ramda'
import { DocumentPicker } from 'unitx-ui/@/DocumentPicker'
import Recorder from 'unitx-ui/components/Recorder'
import useAnimation, { animated } from 'unitx-ui/hooks/useAnimation'

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
const AnimatedSurface = animated(View)

type CreateActionCallback = (
  type: Event,
  extraData?: any,
) => () => void

const ActionBar = (props: ActionBarProps) => {
  const {
    onEvent,
    renderMoreAction,
    mode,
    opened,
    recording = false,
    // recordingActions = false,
    graphEditorRef,
    graphConfig,
    onAction,
  } = props
  const {
    props: animatedProps,
    ref: animationRef,
  } = useAnimation({
    from: {
      bottom: -HEIGHT,
    },
    to: {
      bottom: 0,
    },
    autoStart: false,
  })
  // const initialized = React.useRef(false)
  React.useEffect(() => {
    animationRef.current.reverse({
      reversed: !opened,
    })
  }, [animationRef, opened])
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
    <AnimatedSurface
      style={{
        position: 'absolute',
        width: '100%',
        height: HEIGHT,
        left: 0,
        flexDirection: 'row',
        // @ts-ignore
        backgroundColor: theme.colors.surface,
        ...animatedProps,
      }}
    >
      <View
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
            accessoryLeft={(props) => (
              <Icon
                {...props}
                name="plus-circle"
              />
            )}
            onPress={createOnActionCallback(EVENT.MODE_CHANGED, {
              value: [
                EDITOR_MODE.ADD,
                EDITOR_MODE.CONTINUES_ADD,
                // @ts-ignore
              ].includes(mode)
                ? EDITOR_MODE.DEFAULT
                : EDITOR_MODE.ADD,
            })}
            appearance={EDITOR_MODE.CONTINUES_ADD === mode ? 'filled' : 'outline'}
            status={[
              EDITOR_MODE.ADD,
              EDITOR_MODE.CONTINUES_ADD,
              // @ts-ignore
            ].includes(mode) ? 'warning' : 'primary'}
            onLongPress={createOnActionCallback(
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
            accessoryLeft={(leftProps) => (
              <Icon
                {...leftProps}
                name="delete-circle"
              />
            )}
            status={[
              EDITOR_MODE.DELETE,
              EDITOR_MODE.CONTINUES_DELETE,
              // @ts-ignore
            ].includes(mode)
              ? 'warning'
              : 'danger'}
            appearance={EDITOR_MODE.CONTINUES_DELETE === mode ? 'filled' : 'outline'}
            onPress={createOnActionCallback(EVENT.MODE_CHANGED, {
              value: [
                EDITOR_MODE.DELETE,
                EDITOR_MODE.CONTINUES_DELETE,
                // @ts-ignore
              ].includes(mode)
                ? EDITOR_MODE.DEFAULT
                : EDITOR_MODE.DELETE,
            })}
            onLongPress={createOnActionCallback(
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
              <Icon
                name="record-rec"
                color={status !== 'recording' ? 'black' : 'red'}
                size={32}
                onPress={createOnActionCallback(EVENT.TOGGLE_RECORD)}
              />
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
      </View>
      <Icon
        style={{
          position: 'absolute',
          left: 0,
          top: -(24),
        }}
        name="file-document-edit-outline"
        size={24}
        onPress={createOnActionCallback(EVENT.TOGGLE_ACTION_BAR)}
      />

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
    renderMoreAction = () => <View />,
    createOnActionCallback,
    onAction,
  } = props
  const [state, setState] = React.useState({
    visible: false,
  })
  return (
    <OverflowMenu
      anchor={(anchorProps) => (
        <Icon
          {...anchorProps}
          name="dots-vertical"
          onPress={() => setState({ ...state, visible: !state.visible })}
        />
      )}
      visible={state.visible}
          // selectedIndex={selectedIndex}
      onSelect={async (indexPath) => {
        setState({
          ...state,
          visible: false,
        })
        const action = Object.values(OPTIONS)[indexPath.row]
        switch (action) {
          case OPTIONS.Import: {
            const result = await DocumentPicker.getDocumentAsync({ type: 'application/json' })
            if (result.type === 'success') {
              const fileText = await readTextFile(result.file!)
              createOnActionCallback(
                EVENT.IMPORT_DATA,
                { value: JSON.parse(fileText) },
              )()
            }
            break
          }
          case OPTIONS.Export:
            onAction({ type: ACTION.EXPORT_DATA })
            // createOnActionCallback(EVENT.EXPORT_DATA)()
            break

          default:
            break
        }
      }}
      onBackdropPress={() => {
        setState({
          ...state,
          visible: false,
        })
      }}
    >
      <>
        {Object.values(OPTIONS).map((title) => (
          <MenuItem title={title} />
        ))}
        {renderMoreAction()}
      </>
    </OverflowMenu>
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
    <Popover
      anchor={(anchorProps) => (
        <View {...anchorProps}>
          <SelectItem
            title={layout.name ?? 'Select Layout'}
            onPress={() => setState({ ...state, visible: !state.visible })}
          />
        </View>
      )}
      visible={state.visible}
      onBackdropPress={() => setState({ ...state, visible: false })}
    >
      <View>
        {/* <View>
          <Text>{Math.floor(animationDuration)}</Text>
          <Slider
            value={animationDuration}
            minimumValue={0}
            maximumValue={10000}
            onSlidingComplete={(animationDuration) => createOnActionCallback(
              EVENT.LAYOUT_ANIMATION_DURATION_CHANGED,
              {
                value: animationDuration,
              },
            )()}
          />
          <Divider />
        </View> */}
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
          onSubmit={(formData) => {
            createOnActionCallback(
              EVENT.LAYOUT_CHANGED,
              {
                value: formData,
              },
            )()
          }}
        />
        {/* {LAYOUT_NAMES.map((name) => (
          <SelectItem
            title={name}
            onPress={() => onItemSelect(name)}
            selected={layout.name === name}
          />
        ))} */}
      </View>
    </Popover>
  )
  // return (
  //   <Select
  //     selectedIndex={new IndexPath(selectedLayoutIndex)}
  //     onSelect={(index) => }
  // value={selectedLayoutIndex < 0
  //   ? 'Select Layout'
  //   : LAYOUT_NAMES[selectedLayoutIndex]}
  //   >
  //     <Card>
  //         <Text>{layout.animationDuration ?? 5000}</Text>
  //         <Slider
  //           value={layout.animationDuration}
  //           minimumValue={0}
  //           maximumValue={10000}
  //           onSlidingComplete={(animationDuration) => createOnActionCallback(
  //             EVENT.LAYOUT_ANIMATION_DURATION_CHANGED,
  //             {
  //               value: animationDuration,
  //             },
  //           )()}
  //         />
  //     </Card>
  //     {LAYOUT_NAMES.map((name) => (
  //       <SelectItem title={name} />
  //     ))}
  //   </Select>
  // )
}
export default wrapComponent<ActionBarProps>(ActionBar, {})

const styles = StyleSheet.create({
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
})
