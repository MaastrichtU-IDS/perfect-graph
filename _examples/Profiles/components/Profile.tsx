import React from 'react'
import { wrapComponent } from 'colay-ui'
import { Position } from 'colay-ui/type'
import { Pressable } from '../../../src/components/Pressable'
import { Image } from '../../../src/components/Image'
import { Text } from '../../../src/components/Text'
import { View, ViewProps } from '../../../src/components/View'

export type ProfileProps = {
  name: string;
  story: string;
  image: string;
  link?: string;
  style?: ViewProps['style'];
  onClick?: () => void;
}

export type ProfileType = React.FC<ProfileProps>

const ProfileElement = (
  props: ProfileProps,
  __: React.ForwardedRef<ProfileType>,
) => {
  const {
    name,
    image,
    story,
    link,
    onClick,
  } = props
  return (
    <>
      <View style={{
        width: 300,
        height: 150,
        flexDirection: 'row',
        borderRadius: 30,
        backgroundColor: '#304e57',
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
          <View
            style={{
              left: 10,
            }}
            interactive
            buttonMode
            pointertap={() => {
              if (link) {
                window.open(link, '_blank')
              }
              onClick?.()
            }}
          >
            <Text
              style={style.title}
            >
              {name}
            </Text>
          </View>
          <Text
          // @ts-ignore
            style={style.paragraph}
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
    color: 'white',
    left: 30,
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
    color: 'white',
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
