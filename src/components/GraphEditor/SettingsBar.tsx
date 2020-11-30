import React from 'react'
import {
  View,
  wrapComponent,
  useTheme,
  Icon,
  ScrollView,
} from 'unitx-ui'
import { EVENT } from '@utils/constants'
import { Event, OnEvent } from '@type'
import Form, {
  FormProps,
} from 'unitx-ui/components/Form'
import useAnimation, { animated } from 'unitx-ui/hooks/useAnimation'

type SettingsForm = Partial<
Pick<
FormProps<any>,
'schema' | 'onChange'|'onSubmit'|'formData'| 'uiSchema' | 'children'
>
>
export type SettingsBarProps = {
  opened?: boolean;
  onEvent?: OnEvent;
  forms?: SettingsForm[];
}

const WIDTH_PROPORTION = 30
const AnimatedSurface = animated(View)
const SettingsBar = (props: SettingsBarProps) => {
  const {
    opened = false,
    onEvent,
    // schema = {},
    forms = [],
    // children,
    // ...formProps
  } = props
  const {
    props: animatedProps,
    ref: animationRef,
  } = useAnimation({
    from: {
      left: `-${WIDTH_PROPORTION}%`,
    },
    to: {
      left: '0%',
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
      <ScrollView>
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
          //   {children === undefined ? <View /> : children}
          // </Form>
        ))
      }
      </ScrollView>
      <Icon
        style={{
          position: 'absolute',
          right: -24,
          top: 0,
        }}
        name="filter"
        size={24}
        // circle
        onPress={createOnActionCallback(EVENT.TOGGLE_FILTER_BAR)}
      />
    </AnimatedSurface>
  )
}

export default wrapComponent<SettingsBarProps>(SettingsBar, {})
