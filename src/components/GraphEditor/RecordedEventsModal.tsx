import {
  Button,
  CircularProgress, Modal,
  Paper, Typography, CircularProgressProps,
} from '@material-ui/core'
import { TimeoutManager } from '@utils/TimeoutManager'
import { View } from 'colay-ui'
import React from 'react'

type EventsModalProps = {
  timeoutManager: TimeoutManager
  onClose: () => void
}
export const RecordedEventsModal = (props: EventsModalProps) => {
  const {
    timeoutManager,
    onClose,
  } = props
  const isOpen = !timeoutManager.finished
  const [state, setState] = React.useState({
    alert: {
      visible: false,
    },
  })
  const currentTimer = timeoutManager.timers?.[timeoutManager.currentIndex]
  const {
    duration,
    totalDuration,
    currentIndex,
    paused,
    timeoutInstances,
  } = timeoutManager
  return (
    <Modal
      open={isOpen}
    // onClose={onClose}
      style={{
        display: 'flex',
        flexDirection: 'column-reverse',
      }}
      BackdropProps={{
        style: {
          backgroundColor: 'rgba(0, 0, 0, 0)',
        },
        onClick: () => {
          setState({
            ...state,
            alert: {
              ...state.alert,
              visible: true,
            },
          })
          setTimeout(() => {
            setState({
              ...state,
              alert: {
                ...state.alert,
                visible: false,
              },
            })
          }, 1500)
        },
      }}
    >
      <Paper style={{
        display: 'flex',
        flexDirection: 'column',
      }}
      >
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
        >
          <Typography variant="h6">Play Events</Typography>
          {state.alert.visible && (
          <Typography
            variant="h6"
            color="error"
          >
            You cannot take action while the events are playing
          </Typography>
          )}
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            <Button
              color={paused ? 'primary' : 'secondary'}
              onClick={() => {
                paused
                  ? timeoutManager.start()
                  : timeoutManager.pause()
              }}
            >
              {paused ? 'Play' : 'Pause'}
            </Button>
            <Button
              color="secondary"
              onClick={() => {
                onClose()
              }}
            >
              Close
            </Button>
          </View>
          <Typography variant="subtitle1">
            {`Current Event: ${currentTimer?.type}`}
          </Typography>
          <View
            style={{
              flexDirection: 'row',
              height: '100%',
              alignItems: 'center',
            }}
          >
            <Typography variant="subtitle2">{`Events: ${currentIndex} / ${timeoutInstances.length}`}</Typography>
            <CircularProgressWithLabel
              value={
            (duration / totalDuration) * 100
          }
            />
          </View>

        </View>
      </Paper>
    </Modal>
  )
}

function CircularProgressWithLabel(props: CircularProgressProps) {
  return (
    <View>
      <CircularProgress
        variant="determinate"
        {...props}
      />
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="caption"
          component="div"
          color="textSecondary"
        >
          {`${Math.round(
            props.value!,
          )}%`}

        </Typography>
      </View>
    </View>
  )
}

// <View
//   style={{
//     width: 200,
//   }}
// >
//   <Typography
//     style={{
//       left: '-100%',
//       width: '200%',
//       whiteSpace: 'nowrap',
//       position: 'relative',
//       overflow: 'hidden', /* Required to make ellipsis work */
//       textOverflow: 'ellipsis',
//       '-webkit-transition': 'left 3s, width 3s',
//       '-moz-transition': 'left 3s, width 3s',
//       transition: 'left 3s, width 3s',
//     }}
//   >
//     {JSON.stringify(currentTimer?.data)}
//   </Typography>
// </View>
