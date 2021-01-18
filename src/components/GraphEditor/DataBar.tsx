import React from 'react'
import { EVENT } from '@utils/constants'
import { Event, OnEvent, ElementData } from '@type'
import {
  JSONViewer,
  useAnimation,
} from 'colay-ui'
import {
  Icon,
  IconButton, Typography,
  Paper,
} from '@material-ui/core'
import { DataEditor, DataEditorProps } from './DataEditor'

export type DataBarProps = {
  editable?: boolean;
  item?: ElementData|null;
  opened?: boolean;
  onEvent?: OnEvent;
} & Omit<DataEditorProps, 'data'>

const WIDTH_PROPORTION = 30

export const DataBar = (props: DataBarProps) => {
  const {
    editable = true,
    item,
    onEvent,
    opened = false,
    ...rest
  } = props
  const {
    style: animationStyle,
    ref: animationRef,
  } = useAnimation({
    from: {
      right: `-${WIDTH_PROPORTION}%`,
    },
    to: {
      right: '0%',
    },
    autoPlay: false,
  })
  // const theme = useTheme()
  // const initialized = React.useRef(false)
  React.useEffect(() => {
    animationRef.current?.play?.(opened)
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
  console.log('DataBar:', animationStyle)
  return (
    <Paper
      style={{
        position: 'absolute',
        width: `${WIDTH_PROPORTION}%`,
        height: '100%',
        top: 0,
        ...animationStyle,
      }}
    >
      {item && (<Typography variant="caption">{` id: ${item?.id}`}</Typography>)}
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
      <IconButton
        onClick={createOnActionCallback(EVENT.TOGGLE_DATA_BAR)}
      >
        <Icon
          style={{
            position: 'absolute',
            left: -24,
            top: 0,
            fontSize: 24,
          }}
        >
          information-outline
        </Icon>
      </IconButton>
    </Paper>
  )
}
