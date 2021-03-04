import React from 'react'
import {
  wrapComponent,
  useAnimation,
  View,
} from 'colay-ui'
import {
  Paper,
  Divider,
  IconButton,
  Button,
} from '@material-ui/core'
import { Icon } from '@components/Icon'
import { EVENT } from '@utils/constants'
import { OnEventLite, EventHistory } from '@type'
import Form from '@rjsf/material-ui'
import { FormProps } from '@rjsf/core'
import { EventHistoryTable } from './EventHistoryTable'
// import Form, {
//   FormProps,
// } from 'unitx-ui/components/Form'

type SettingsForm = {
  schema: FormProps<any>['schema'];
} & Partial<
Pick<
FormProps<any>,
'onChange'|'onSubmit'|'formData'| 'uiSchema' | 'children'
>
>
export type SettingsBarProps = {
  opened?: boolean;
  onEvent: OnEventLite;
  forms?: SettingsForm[];
  eventHistory?: EventHistory;
}

const WIDTH_PROPORTION = 30
const SettingsBarElement = (props: SettingsBarProps) => {
  const {
    opened = false,
    onEvent,
    // schema = {},
    forms = [],
    eventHistory,
    // children,
    // ...formProps
  } = props
  const {
    style: animationStyle,
    ref: animationRef,
  } = useAnimation({
    from: {
      left: `-${WIDTH_PROPORTION}%`,
    },
    to: {
      left: '0%',
    },
    autoPlay: false,
  })
  // const initialized = React.useRef(false)
  React.useEffect(() => {
    animationRef.current.play(opened)
  }, [animationRef, opened])
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
      <View
        style={{
          overflowY: 'auto',
          overflowX: 'hidden',
          paddingRight: 10,
          paddingLeft: 10,
          height: eventHistory ? '60%' : '100%',
        }}
      >
        {
        forms.map((form, index) => (
          <Form
            key={form.schema.title ?? `${index}`}
            // schema={schema}
            // {...formProps}
            {...form}
            onSubmit={(
              e,
            ) => onEvent({
              type: EVENT.SETTINGS_FORM_CHANGED,
              payload: { form, value: e.formData, index },
            })}
          >
            <Button
              type="submit"
              fullWidth
              variant="contained"
            >
              Apply
            </Button>
          </Form>
        ))
      }
      </View>
      {
        eventHistory && (
        <>
          <Divider style={{ marginTop: 5, marginBottom: 5 }} />
          <View
            style={{
              height: '40%',
              width: '100%',
            }}
          >
            <EventHistoryTable
              onEvent={onEvent}
              eventHistory={eventHistory}
            />
          </View>
        </>
        )
      }
      <IconButton
        style={styles.icon}
        onClick={() => {
          onEvent({
            type: EVENT.TOGGLE_FILTER_BAR,
            avoidHistoryRecording: true,
          })
        }}
      >
        <Icon
          name="settings"
        />
      </IconButton>
    </Paper>
  )
}

export const SettingsBar = wrapComponent<SettingsBarProps>(SettingsBarElement, {})

const styles = {
  icon: {
    position: 'absolute',
    right: -36,
    top: 2,
    fontSize: 24,
  },
} as const
