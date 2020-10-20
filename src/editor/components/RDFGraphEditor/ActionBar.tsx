import React from 'react'
import { StyleSheet } from 'react-native'
import {
  View,
  wrapComponent,
  Icon,
  Button,
  Menu,
  useTheme,
  useData,
} from 'unitx-ui'
import useAnimation, { animated } from 'unitx-ui/hooks/useAnimation'
import { ActionType } from '@utils/constants'
import { ActionTypeName } from '@type'

export type ActionBarProps = {
  renderMoreAction?: () => React.ReactElement;
  onAction: (type: keyof typeof ActionType) => void;
  actionType: ActionTypeName | null;
}

const HEIGHT = 40
const AnimatedSurface = animated(View)
const ActionBar = (props: ActionBarProps) => {
  const {
    onAction,
    renderMoreAction,
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
  const [state, updateState] = useData({
    morePopupVisible: false,
  })
  const createOnActionCallback = React.useCallback(
    (
      type: string,
      // @ts-ignore
    ) => () => onAction?.(type),
    [onAction],
  )
  const theme = useTheme()
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
          icon="plus-circle"
          onPress={createOnActionCallback(ActionType.add)}
        >
          Add
        </Button>
        <Button
          style={styles.button}
          icon="delete-circle"
          color="error"
          onPress={createOnActionCallback(ActionType.delete)}
        >
          Delete
        </Button>
        <Menu
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
        </Menu>
      </View>
      <Icon
        style={{
          position: 'absolute',
          left: 0,
          top: -(24),
        }}
        name="file-document-edit-outline"
        size={24}
        onPress={async () => {
          animationRef?.current?.start()
          animationRef?.current?.update({
            reverse: true,
          })
        }}
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
