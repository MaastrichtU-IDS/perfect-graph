import {
  Event, OnEvent, EditorMode, GraphEditorRef,
} from '@type'
import { EDITOR_MODE, EVENT, LAYOUT_NAMES } from '@utils/constants'
import React from 'react'
import { StyleSheet } from 'react-native'
import {
  Button,
  Icon,
  OverflowMenu,
  useTheme,
  View,
  wrapComponent,
  Select,
  SelectItem,
  IndexPath,
  MenuItem,
} from 'unitx-ui'
import useAnimation, { animated } from 'unitx-ui/hooks/useAnimation'
import Recorder from 'unitx-ui/components/Recorder'
import { DocumentPicker } from 'unitx-ui/@/DocumentPicker'
import { readTextFile } from '@utils'

export type ActionBarProps = {
  renderMoreAction?: () => React.ReactElement;
  opened?: boolean;
  onEvent?: OnEvent;
  mode?: EditorMode;
  layoutName?: string;
  recording?: boolean;
  graphEditorRef: React.MutableRefObject<GraphEditorRef>;
}
const RECORDING_STATUS_MAP = {
  START: 'START',
  STOP: 'STOP',
  RECORDING: 'RECORDING',
  IDLE: 'IDLE',
}

const HEIGHT = 40
const AnimatedSurface = animated(View)
const ActionBar = (props: ActionBarProps) => {
  const {
    onEvent,
    renderMoreAction,
    mode,
    opened,
    layoutName,
    recording = false,
    graphEditorRef,
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
  const initialized = React.useRef(false)
  React.useEffect(() => {
    if (initialized.current) {
      animationRef?.current?.start()
      animationRef?.current?.update({
        reverse: true,
      })
    }
    initialized.current = true
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

  const selectedLayoutIndex = LAYOUT_NAMES.indexOf(layoutName)
  const recordingRef = React.useRef(
    RECORDING_STATUS_MAP.IDLE,
  )
  React.useMemo(() => {
    switch (recordingRef.current) {
      case RECORDING_STATUS_MAP.IDLE:
        recordingRef.current = recording ? RECORDING_STATUS_MAP.START : RECORDING_STATUS_MAP.IDLE
        break
      case RECORDING_STATUS_MAP.START:
        recordingRef.current = recording ? RECORDING_STATUS_MAP.RECORDING : RECORDING_STATUS_MAP.STOP
        break
      case RECORDING_STATUS_MAP.RECORDING:
        recordingRef.current = recording ? RECORDING_STATUS_MAP.RECORDING : RECORDING_STATUS_MAP.STOP
        break
      case RECORDING_STATUS_MAP.STOP:
        recordingRef.current = recording ? RECORDING_STATUS_MAP.START : RECORDING_STATUS_MAP.IDLE
        break

      default:
        break
    }
  }, [recording])
  React.useEffect(() => {
    animationRef?.current?.start()
  }, [])
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
          onLongPress={createOnActionCallback(EVENT.MODE_CHANGED, { value: EDITOR_MODE.CONTINUES_DELETE })}
        >
          Delete
        </Button>
        <Select
          selectedIndex={new IndexPath(selectedLayoutIndex)}
          onSelect={(index) => createOnActionCallback(EVENT.LAYOUT_SELECTED, { value: LAYOUT_NAMES[index.row] })()}
          value={selectedLayoutIndex < 0 ? 'Select Layout' : LAYOUT_NAMES[selectedLayoutIndex]}
        >
          {LAYOUT_NAMES.map((name) => (
            <SelectItem title={name} />
          ))}
        </Select>
        <Recorder
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
} & Pick<ActionBarProps, 'renderMoreAction'>

const OPTIONS = {
  Import: 'Import',
  Export: 'Export',
} as const
const MoreOptions = (props: MoreOptionsProps) => {
  const {
    renderMoreAction,
    createOnActionCallback,
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
              const fileText = await readTextFile(result.file)
              createOnActionCallback(
                EVENT.IMPORT_DATA,
                { value: JSON.parse(fileText) },
              )()
            }
            break
          }
          case OPTIONS.Export:
            createOnActionCallback(EVENT.EXPORT_DATA)()
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
      {Object.values(OPTIONS).map((title) => (
        <MenuItem title={title} />
      ))}
      {renderMoreAction?.()}
    </OverflowMenu>
  )
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
