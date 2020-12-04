// @ts-nocheck
import React from 'react'
import { StyleProp, ViewStyle, StyleSheet } from 'react-native'
import { wrapComponent } from 'unitx-ui'
import {
  DataItem,
} from '@type'
import { ForwardRef, Position } from 'unitx-ui/type'
// import { dataListToObject } from '@core/utils'
import Pressable from '@components/Pressable'
import Image from '@components/Image'
import Text from '@components/Text'
import ViewPIXI from '@components/View'

export type NodeData = {
  id: string;
  position?: Position;
  data?: DataItem[];
}

export type ProfileProps = {
  name: string;
  story: string;
  image: string;
  style?: StyleProp<ViewStyle>;
  onPress?: (p: { node: Node; data: NodeData }) => void;
}
// const SWITCH_COLLAPSE = 'SWITCH_COLLAPSE'

function Profile(props: ProfileProps, __: ForwardRef<typeof Profile>) {
  const {
    name,
    image,
    story,
  } = props
  return (
    <>
      <ViewPIXI style={{
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
        <ViewPIXI
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

        </ViewPIXI>
      </ViewPIXI>

    </>
  )
}

/**
 * ## Usage
 * To create a Profile View easily, you can just pass data and Profile Template.
 * Check example
 *
 * ```js live=true
* <Graph
 *  style={{ width: '100%', height: 250 }}
 *  nodes={[
 *    {
 *      id: 1,
 *      position: { x: 10, y: 10 },
 *      data: {
 *        name: 'Maastricht',
 *        image: 'https://images.pexels.com/photos/105599/pexels-photo-105599.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
 *        story: `Maastricht, a university city on the southern tip of the Netherlands, is distinguished by its medieval-era architecture and vibrant cultural scene.`
 *      }
 *    },
 *    {
 *      id: 2,
 *      position: { x: 600, y: 10 },
 *      data: {
 *        name: 'Amsterdam',
 *        image: 'https://images.pexels.com/photos/2031706/pexels-photo-2031706.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
 *        story: `Amsterdam is the Netherlands’ capital, known for its artistic heritage, elaborate canal system and narrow houses with gabled facades.`
 *      }
 *    },
 *  ]}
 *  edges={[
 *    { id: 51, source: 1, target: 2 }
 *  ]}
 *  renderNode={({ item: { data } }) => (
 *   <Graph.ProfileTemplate
 *     name={data.name}
 *     image={data.image}
 *     story={data.story}
 *   />
 * )}
 * />
 * ```
 */
export default wrapComponent<ProfileProps>(
  Profile,
  {
    isForwardRef: true,
  },
)

const style = StyleSheet.create({
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
})

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
