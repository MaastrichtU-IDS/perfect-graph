import React from 'react'
import {
  wrapComponent,
  Icon,
  JSONViewer,
  useTheme,
  View,
} from 'unitx-ui'
import Form, {
  FormProps,
} from 'unitx-ui/components/Form'
import useAnimation, { animated } from 'unitx-ui/hooks/useAnimation'

export type DataBarProps = Partial<
Pick<
FormProps<any>,
'schema' | 'onChange'|'onSubmit'| 'uiSchema'
>
> & {
  data?: any;
}
const WIDTH_PROPORTION = 30
const AnimatedSurface = animated(View)
const DataBar = (props: DataBarProps) => {
  const {
    schema,
    data,
    ...formProps
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
      {
        schema
          ? (
            <Form
              schema={schema}
              formData={data}
              {...formProps}
            />
          )
          : (
            <JSONViewer data={data} />
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

export default wrapComponent<DataBarProps>(DataBar, {})
