import React from 'react'
import {
  wrapComponent,
  useAnimation,
} from 'colay-ui'
import {
  Icon,
  Paper,
  Box,
  IconButton,
} from '@material-ui/core'
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
        overflow: 'auto',
      }}
      >
        {
        forms.map((form) => (
          <Form
            // schema={schema}
            // {...formProps}
            {...form}
            onSubmit={(
              formValue,
            ) => createOnActionCallback(
              EVENT.SETTINGS_FORM_CHANGED,
              { form, value: formValue },
            )()}
          />
        ))
      }
      </Box>
      <IconButton
        onClick={createOnActionCallback(EVENT.TOGGLE_FILTER_BAR)}
      >
        <Icon
          style={{
            position: 'absolute',
            right: -24,
            top: 0,
            fontSize: 24,
          }}
        >
          filter
        </Icon>
      </IconButton>
    </Paper>
  )
}

export const SettingsBar = wrapComponent<SettingsBarProps>(SettingsBarElement, {})
