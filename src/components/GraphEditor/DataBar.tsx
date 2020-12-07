import React from 'react'
import { EVENT } from '@utils/constants'
import { Event, OnEvent, ElementData } from '@type'
import {
  Icon,
  JSONViewer,
  Text, useTheme,
  View,
} from 'unitx-ui'
import useAnimation, { animated } from 'unitx-ui/hooks/useAnimation'
import { DataEditor, DataEditorProps } from './DataEditor'

export type DataBarProps = {
  editable?: boolean;
  item?: ElementData|null;
  opened?: boolean;
  onEvent?: OnEvent;
} & Omit<DataEditorProps, 'data'>

const WIDTH_PROPORTION = 30

const AnimatedSurface = animated(View)

const DataBar = (props: DataBarProps) => {
  const {
    editable = true,
    item,
    onEvent,
    opened = false,
    ...rest
  } = props
  const {
    props: animatedProps,
    ref: animationRef,
  } = useAnimation({
    from: {
      right: `-${WIDTH_PROPORTION}%`,
    },
    to: {
      right: '0%',
    },
    autoStart: false,
  })
  const theme = useTheme()
  // const initialized = React.useRef(false)
  React.useEffect(() => {
    animationRef.current?.reverse?.({
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
  // React.useEffect(() => {
  //   animationRef?.current?.start()
  // }, [])
  return (
    <AnimatedSurface
      style={{
        position: 'absolute',
        width: `${WIDTH_PROPORTION}%`,
        height: '100%',
        top: 0,
        // @ts-ignore
        backgroundColor: theme.colors.surface,
        ...animatedProps,
      }}
    >
      {item && (<Text category="label">{` id: ${item?.id}`}</Text>)}
      {
        editable && item?.data
          ? (
            <DataEditor
              data={item.data}
              onEvent={onEvent}
              {...rest}
            />
          )
          : (
            <JSONViewer data={item?.data} />
          )
      }
      <Icon
        style={{
          position: 'absolute',
          left: -24,
          top: 0,
        }}
        name="information-outline"
        size={24}
        circle
        onPress={createOnActionCallback(EVENT.TOGGLE_DATA_BAR)}
      />
    </AnimatedSurface>
  )
}

export default DataBar// wrapComponent<DataBarProps>(DataBar, {})
