import React from 'react'
import { EVENT } from '@utils/constants'
import { Event, OnEvent, ElementData } from '@type'
import {
  JSONViewer,
  useAnimation,
} from 'colay-ui'
import { View } from 'colay-ui/components/View'
import {
  IconButton,
  Typography,
  Paper,
  Box,
} from '@material-ui/core'
import { Icon } from '@components/Icon'
import { DataEditor, DataEditorProps } from './DataEditor'

export type DataBarProps = {
  editable?: boolean;
  item?: ElementData|null;
  opened?: boolean;
  onEvent?: OnEvent;
} & Omit<DataEditorProps, 'data'>

const WIDTH_PROPORTION = 40

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
      <View style={{ width: '100%', height: '100%', overflowY: 'scroll' }}>
        {item && (
        <Typography
          variant="h6"
          sx={{ ml: 2 }}
        >
          {` id: ${item?.id}`}
        </Typography>
        )}
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
            <JSONViewer
              data={item?.data}
              left={({ collapsed, onCollapse, noChild }) => (
                <IconButton
                  size="small"
                  sx={{ height: 24 }}
                  disabled={noChild}
                  onClick={() => onCollapse(!collapsed)}
                >
                  <Icon
                    style={{
                      fontSize: noChild ? 12 : 24,
                    }}
                    name={
                      noChild
                        ? 'fiber_manual_record'
                        : collapsed
                          ? 'arrow_drop_down_rounded'
                          : 'arrow_drop_up_rounded'
}
                  />
                </IconButton>
              )}
              renderItem={({ item: { key, value } }) => (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    style={{ alignContent: 'center' }}
                  >
                    {`${key}${value ? ': ' : ''}`}
                  </Typography>
                  {value
                    ? (
                      <Typography
                        variant="subtitle1"
                        style={{ alignContent: 'center' }}
                      >
                        {value}
                      </Typography>
                    )
                    : null}
                </Box>
              )}
            />
          )
      }
      </View>
      <IconButton
        style={{
          position: 'absolute',
          left: -34,
          top: 0,
          fontSize: 24,
        }}
        onClick={createOnActionCallback(EVENT.TOGGLE_DATA_BAR)}
      >
        <Icon
          name="info_outlined"
        />
      </IconButton>
    </Paper>
  )
}
