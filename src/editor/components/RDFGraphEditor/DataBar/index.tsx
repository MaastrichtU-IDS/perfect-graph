import React from 'react'
import {
  wrapComponent,
  Icon,
  useTheme,
  View,
  FlatList
} from 'unitx-ui'
import useAnimation, { animated } from 'unitx-ui/hooks/useAnimation'

export type DataBarProps =  {
  data?: object;
  onChange: (newData: object) => void;
}

const WIDTH_PROPORTION = 30
const AnimatedSurface = animated(View)
const processDataItem = ([key, value]: [string, string|{}]) => {

}
const DataBar = (props: DataBarProps) => {
  const {
    data,
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
  const processedData = React.useMemo(() => R)
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
      <FlatList 

      />
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
