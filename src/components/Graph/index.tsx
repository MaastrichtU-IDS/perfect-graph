import { Stage } from '@inlet/react-pixi'
import * as R from 'colay/ramda'
import React from 'react'
import {
  wrapComponent,
  useForwardRef,
  useMeasure,
  Div,
  DivProps,
  DataRender,
} from 'colay-ui'
import * as C from 'colay/color'
import { useGraph } from '@hooks'
import {
  NodeData, EdgeData, RenderEdge, RenderNode,
  GraphConfig, Element, DrawLine, GraphRef, ViewportRef,
} from '@type'
import { PropsWithRef } from 'colay-ui/type'
import '@core/config'
import { useTheme, ThemeProvider, DefaultTheme } from '@core/theme'
import { Viewport, ViewportProps } from '../Viewport'
import { NodeContainer } from '../NodeContainer'
import { EdgeContainer } from '../EdgeContainer'
import { View } from '../View'
import { Text } from '../Text'

export type GraphProps = {
  extraData?: any;
  nodes: NodeData[];
  edges: EdgeData[];
  style?: DivProps['style'];
  renderNode?: RenderNode;
  renderEdge?: RenderEdge;
  onPress?: ViewportProps['onPress'];
  drawLine?: DrawLine;
  config?: GraphConfig;
  selectedElements?: Element[];
}

export const DefaultRenderNode: RenderNode = ({ item }) => (
  <View style={{
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    backgroundColor: 'blue', // DefaultTheme.palette.background.paper,
    borderRadius: 30, // 50
  }}
  >
    <Text
      style={{
        position: 'absolute',
        top: 0, // -40
        color: '#fff', // 'black'
        fontSize: 15
      }}
      isSprite
    >
      {item.id}

    </Text>
  </View>
)

// export const DefaultRenderNode: RenderNode = ({ item }) => (
//   <View style={{
//     width: 50,
//     height: 50,
//     justifyContent: 'center',
//     alignItems: 'center',
//     display: 'flex',
//     backgroundColor: DefaultTheme.palette.background.paper,
//     borderRadius: 50,
//   }}
//   >
//     <Text
//       style={{
//         position: 'absolute',
//         top: -40,
//         color: 'black',
//       }}
//       isSprite
//     >
//       {item.id}

//     </Text>
//   </View>
// )

// @ts-ignore
export const DefaultRenderEdge: RenderEdge = () => (
  null
)
// <View style={{ width: 100, height: 100, backgroundColor: 'blue' }} />

export type GraphType = React.FC<GraphProps>

const GraphElement = (props: GraphProps, ref: React.ForwardedRef<GraphType>) => {
  const {
    style,
    nodes = [],
    edges = [],
    onPress,
    renderNode = DefaultRenderNode,
    renderEdge = DefaultRenderEdge,
    drawLine,
    extraData,
    config = {} as Partial<GraphConfig>,
  } = props
  const graphID = React.useMemo<string>(R.uuid, [])
  const stageRef = React.useRef<{ app: PIXI.Application }>(null)
  const viewportRef = React.useRef<ViewportRef>(null)
  const { cy } = useGraph({
    id: graphID,
    onLoad: () => {
    },
  })
  const graphRef = useForwardRef<GraphRef>(ref, { cy })
  const [
    containerRef,
    { width, height },
  ] = useMeasure()
  const graphLayoutRef = React.useRef<cytoscape.Layouts>(null)
  React.useEffect(() => {
    graphRef.current.app = stageRef.current?.app!
    graphRef.current.viewport = viewportRef.current!
  }, [containerRef.current])
  React.useEffect(() => {
    R.when(
      () => containerRef.current && config.layout,
      () => {
        // @ts-ignore
        const { hitArea } = viewportRef.current
        const boundingBox = {
          x1: hitArea.x,
          y1: hitArea.y,
          w: hitArea.width,
          h: hitArea.height,
        }
        graphLayoutRef.current?.stop()
        // @ts-ignore
        graphLayoutRef.current = cy.createLayout({
          ...config.layout,
          boundingBox,
        })
        graphLayoutRef.current.on('layoutstop', () => {
          // @ts-ignore
          graphLayoutRef.current = null
          // Fix the edge lines
          cy.edges().forEach((edge) => {
            edge.data().onPositionChange()
          })
        })
        graphLayoutRef.current.start()
      },
      true,
    )
  }, [containerRef.current, config.layout])
  const theme = useTheme()
  const backgroundColor = React.useMemo(
    () => C.rgbNumber(theme.palette.background.default),
    [theme.palette.background.default],
  )
  React.useEffect(() => {
    stageRef.current!.app.renderer.backgroundColor = backgroundColor
  }, [backgroundColor])
  return (
    <Div
      ref={containerRef}
      style={style}
    >
      <Stage
        // @ts-ignore
        ref={stageRef}
        {...{ width, height }}
        options={{
          width,
          height,
          resolution: window.devicePixelRatio || 1, // 64, // window.devicePixelRatio || 1,
          antialias: true,
          autoDensity: true,
          backgroundColor,
        }}
      >
        <ThemeProvider
        // @ts-ignore
          theme={theme}
        >
          <Viewport
          // @ts-ignore
            ref={viewportRef}
            onPress={onPress}
            zoom={config.zoom}
            transform={config.transform}
            {...{ width, height }}
          >
            <DataRender
              extraData={[extraData, config.nodes]}
              data={nodes}
              accessor={['children']}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <NodeContainer
                  graphID={graphID}
                  item={item}
                  config={config.nodes?.[item.id]}
                >
                  {renderNode}
                </NodeContainer>
              )}
            />
            <DataRender
              extraData={[extraData, config.edges]}
              data={edges}
              accessor={['children']}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <EdgeContainer
                  graphID={graphID}
                  item={item}
                  drawLine={drawLine}
                  config={config.edges?.[item.id]}
                >
                  {renderEdge}
                </EdgeContainer>
              )}
            />
          </Viewport>
        </ThemeProvider>
      </Stage>
    </Div>
  )
}

/**
 * ## Usage
 * To create a Graph View easily, you can just pass data and render methods.
 * Check example
 *
 * ```js live=true
 * function MyGraph() {
 *  const [data, setData] = React.useState({
 *    nodes: [
 *         { id: 1, position: { x: 10, y: 10 } },
 *         { id: 2, position: { x: 300, y: 100 } },
 *       ],
 *    edges: [
 *         { id: 51, source: 1, target: 2 }
 *       ]
 *  })
 *  return (
 *    <Graph
 *       style={{ width: '100%', height: 250 }}
 *       onPress={({ position }) => {
 *        setData({
 *          nodes: [
 *            ...data.nodes,
 *            { id: ''+(Math.random() * 1000).toFixed(0), position}
 *          ],
 *          edges: data.edges
 *        })
 *       }}
 *       nodes={data.nodes}
 *       edges={data.edges}
 *     />
 *  )
 * }
 * ```
 */
export const Graph = wrapComponent<PropsWithRef<GraphRef, GraphProps>>(
  GraphElement,
  {
    isForwardRef: true,
    isEqual: R.equalsExclude(R.is(Function)),
  },
)
