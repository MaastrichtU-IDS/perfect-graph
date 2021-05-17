import React from 'react'
import { wrapComponent } from 'colay-ui'
import {
  DataItem,
} from '@type'
import { Position } from 'colay-ui/type'
import { Pressable } from '@components/Pressable'
import { Image } from '@components/Image'
import { Text } from '@components/Text'
import { View, ViewProps } from '@components/View'

export type NodeData = {
  id: string;
  position?: Position;
  data?: DataItem[];
}

export type ProfileProps = {
  name: string;
  story: string;
  image: string;
  style?: ViewProps['style'];
  onPress?: (p: { node: Node; data: NodeData }) => void;
}
// const SWITCH_COLLAPSE = 'SWITCH_COLLAPSE'

export type ProfileType = React.FC<ProfileProps>

const ProfileElement = (
  props: ProfileProps,
  __: React.ForwardedRef<ProfileType>,
) => {
  const {
    name,
    image,
    story,
  } = props
  return (
    <>
      <View style={{
        width: 300,
        height: 150,
        flexDirection: 'row',
        paddingLeft: 10,
        paddingTop: 10,
      }}
      >
        <Image
          source={{ uri: image }}
          style={{
            width: 100,
            height: 100,
          }}
        />
        <View
          style={{ flexDirection: 'column', width: 200 }}
        >
          <Pressable
            style={{
              left: 10,
            }}
          >
            <Text
              style={style.title}
            >
              {name}
            </Text>
          </Pressable>
          <Text
          // @ts-ignore
            style={[style.paragraph, {
              left: 10,
            }]}
          >
            {story}
          </Text>

        </View>
      </View>

    </>
  )
}


export const ProfileTemplate = wrapComponent<ProfileProps>(
  ProfileElement,
  {
    isForwardRef: true,
  },
)

const style = {
  paragraph: {
    // align: 'center',
    fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
    fontSize: 10,
    // fontWeight: 300,
    // fill: ['#ffffff', '#00ff99'], // gradient
    // stroke: '#01d27e',
    // strokeThickness: 5,
    // letterSpacing: 20,
    // dropShadow: false,
    // dropShadowColor: '#ccced2',
    // dropShadowBlur: 4,
    // dropShadowAngle: Math.PI / 6,
    // dropShadowDistance: 6,
    width: 150,
    wordWrap: true,
    wordWrapWidth: 150,
  },
  title: {
    // align: 'center',
    fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
    fontSize: 16,
    // fontWeight: 400,
    // fill: ['#ffffff', '#00ff99'], // gradient
    // stroke: '#01d27e',
    // strokeThickness: 5,
    // letterSpacing: 20,
    // dropShadow: false,
    // dropShadowColor: '#ccced2',
    // dropShadowBlur: 4,
    // dropShadowAngle: Math.PI / 6,
    // dropShadowDistance: 6,
    width: 150,
    wordWrap: true,
    wordWrapWidth: 150,
  },
}

// const createLayout = layoutCreator({
//   graphID,
//   predicate: (element) => element.id() === id || _.find(cluster, { id: element.id() }),
//   options: {
//     name: 'grid',
//     boundingBox: {
//       x1: 0, y1: 0, w: window.innerWidth, h: window.innerHeight,
//     },
//     transform: (node, position) => {
//       // const anim = new Animation({
//       //   autoplay: false,
//       //   from: {
//       //     ...node.position(),
//       //   },
//       //   to: position,
//       //   update: (s) => {
//       //     node.position(s)
//       //     getContext(node).render()
//       //   },
//       //   // duration: 10,
//       // })
//       // anim.play()
//       return position
//     },
//   },
// })
