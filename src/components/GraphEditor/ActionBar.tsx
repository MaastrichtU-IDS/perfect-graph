import { Event, OnEvent, EditorMode } from '@type'
import { EDITOR_MODE, EVENT } from '@utils/constants'
import React from 'react'
import { StyleSheet } from 'react-native'
import {
  Button,
  Icon,
  OverflowMenu,
  useData, useTheme, View,
  wrapComponent,
} from 'unitx-ui'
import useAnimation, { animated } from 'unitx-ui/hooks/useAnimation'

export type ActionBarProps = {
  renderMoreAction?: () => React.ReactElement;
  opened?: boolean;
  onEvent?: OnEvent;
  mode?: EditorMode;
}

const HEIGHT = 40
const AnimatedSurface = animated(View)
const ActionBar = (props: ActionBarProps) => {
  const {
    onEvent,
    renderMoreAction,
    mode,
    opened,
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
  const [, updateState] = useData({
    morePopupVisible: false,
  })
  const createOnActionCallback = React.useCallback(
    (
      type: Event,
      extraData?: any,
      // @ts-ignore
    ) => () => onEvent?.({ type, extraData }),
    [onEvent],
  )
  const theme = useTheme()
  // React.useEffect(() => {
  //   animationRef?.current?.start()
  // }, [])
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
        <OverflowMenu
          anchor={(anchorProps) => (
            <Icon
              {...anchorProps}
              name="dots-vertical"
              onPress={() => updateState((draft) => {
                draft.morePopupVisible = !draft.morePopupVisible
              })}
            />
          )}
          // visible={visible}
          // selectedIndex={selectedIndex}
          // onSelect={onItemSelect}
          // onBackdropPress={() => setVisible(false)}
        >
          {renderMoreAction?.()}
        </OverflowMenu>
        {/* <Menu
          visible={state.morePopupVisible}
          anchor={(
            <Icon
              name="dots-horizontal"
              onPress={() => updateState((draft) => {
                draft.morePopupVisible = !draft.morePopupVisible
              })}
            />
          )}
          onDismiss={() => updateState((draft) => {
            draft.morePopupVisible = !draft.morePopupVisible
          })}
        >
          {renderMoreAction?.()}
        </Menu> */}
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
