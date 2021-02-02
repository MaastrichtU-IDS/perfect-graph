import React from 'react'
import {
  wrapComponent,
  useAnimation,
} from 'colay-ui'
import {
  Paper,
  Box,
  IconButton,
} from '@material-ui/core'
import { Icon } from '@components/Icon'
import { EVENT } from '@utils/constants'
import { Event, OnEvent } from '@type'
import Form from '@rjsf/material-ui'
import { FormProps } from '@rjsf/core'
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
  onEvent?: OnEvent;
  forms?: SettingsForm[];
}

const WIDTH_PROPORTION = 30
const SettingsBarElement = (props: SettingsBarProps) => {
  const {
    opened = false,
    onEvent,
    // schema = {},
    forms = [],
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
      <Box style={{
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingRight: 10,
        paddingLeft: 10,
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
            ) => createOnActionCallback(
              EVENT.SETTINGS_FORM_CHANGED,
              { form, value: e.formData },
            )()}
          />
        ))
      }
      </Box>
      <IconButton
        style={styles.icon}
        onClick={createOnActionCallback(EVENT.TOGGLE_FILTER_BAR)}
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
