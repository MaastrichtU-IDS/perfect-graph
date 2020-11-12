import React from 'react'
import { ViewProps } from '../View'
import Touchable from '../Touchable'

export type HoverContainerProps = {
  renderHoverElement: () => React.ReactChild;
} & ViewProps

const HoverContainer = (props: HoverContainerProps) => {
  const {
    children,
    renderHoverElement,
    ...rest
  } = props
  const [state, setState] = React.useState({ hovered: false })
  const onHoverStart = React.useCallback(() => {
    setState({ hovered: true })
  }, [])
  const onHoverEnd = React.useCallback(() => {
    setState({ hovered: false })
  }, [])
  return (
    <Touchable
      {...rest}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
    >
      {children}
      {state.hovered && renderHoverElement()}
    </Touchable>
  )
}

/**
 * ## Usage
 * To use Image on Graph
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
 *        title: 'Edison',
 *        image: 'https://www.biography.com/.image/t_share/MTE4MDAzNDEwNTEzMDA0MDQ2/thomas-edison-9284349-1-402.jpg'
 *       }
 *    },
 *    {
 *      id: 2,
 *      position: { x: 300, y: 10 },
 *      data: {
 *        title: 'lamp',
 *        image: 'https://images.unsplash.com/photo-1552529232-9e6cb081de19?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60'
 *      }
 *    },
 *  ]}
 *  edges={[
 *    { id: 51, source: 1, target: 2 }
 *  ]}
 *  renderNode={({ item: { data } }) => (
 *    <Graph.HoverContainer
 *      style={{
          width: 100,
          height: 100,
          backgroundColor: '#3291a8',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 25
        }}
        renderHoverElement={() => (
          <Graph.View
            style={{
              backgroundColor: 'white',
              width: NODE_SIZE.width * 2,
              height: 20,
              position: 'absolute',
              left: 0
            }}
          >
            <Graph.Text style={{fontSize: 20, textAlign: 'center'}}>
              {R.replace('ECLI:NL:', '')(data.ecli)}
            </Graph.Text>
          </Graph.View>
        )}
 *    >
 *      <Graph.Image
 *        style={{ width: 100, height: 100 }}
 *        source={{ uri: data.image }}
 *      />
 *    </Graph.HoverContainer>
 * )}
 * />
 * ```
 */
export default HoverContainer
