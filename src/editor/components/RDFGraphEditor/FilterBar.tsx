import React from 'react'
import {
  View,
  wrapComponent,
  useTheme,
  Icon,
} from 'unitx-ui'
import Form, {
  FormProps,
} from 'unitx-ui/components/Form'
import useAnimation, { animated } from 'unitx-ui/hooks/useAnimation'

export type FilterBarProps = Partial<
Pick<
FormProps<any>,
'schema' | 'onChange'|'onSubmit'|'formData'| 'uiSchema'
>
> & {

}

const WIDTH_PROPORTION = 30
const AnimatedSurface = animated(View)
const FilterBar = (props: FilterBarProps) => {
  const {
    schema = {},
    ...formProps
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
  const theme = useTheme()
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
      <Form
        schema={schema}
        {...formProps}
      >
        <View />
      </Form>
      <Icon
        style={{
          position: 'absolute',
          right: -24,
          top: 0,
        }}
        name="filter"
        size={24}
        // circle
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

export default wrapComponent<FilterBarProps>(FilterBar, {})
