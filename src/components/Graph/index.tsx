import React from 'react'
import { Stage } from '@inlet/react-pixi'
import * as R from 'colay/ramda'
import {
  wrapComponent,
  useForwardRef,
  useMeasure,
  View,
  ViewProps,
  DataRender,
} from 'colay-ui'
import * as C from 'colay/color'
import { useGraph } from '@hooks'
import {
  NodeData, EdgeData, RenderEdge, RenderNode,
  GraphConfig, DrawLine, GraphRef, ViewportRef,
  RenderCluster,
} from '@type'
import { PropsWithRef } from 'colay-ui/type'
import { BoundingBox } from 'colay/type'
import '@core/config'
import { ThemeProvider, DefaultTheme } from '@core/theme'
import { CYTOSCAPE_EVENT } from '@utils/constants'
import { isPositionInBox, cyUnselectAll, contextUtils } from '@utils'
import { Viewport, ViewportProps } from '../Viewport'
import { NodeContainer } from '../NodeContainer'
import { EdgeContainer } from '../EdgeContainer'
import { ClusterNodeContainer } from '../ClusterNodeContainer'
// import { Pressable } from '../Pressable'
import { Text as GraphText } from '../Text'
import { View as GraphView } from '../View'

export type GraphProps = {
  children?: React.ReactNode;
  extraData?: any;
  nodes: NodeData[];
  edges: EdgeData[];
  style?: ViewProps['style'];
  renderNode?: RenderNode;
  renderEdge?: RenderEdge;
  renderClusterNode?: RenderClusterNode;
  onPress?: ViewportProps['onPress'];
  drawLine?: DrawLine;
  config?: GraphConfig;
  onBoxSelection?: (c: {
    event: PIXI.InteractionEvent,
    elements: cytoscape.Collection,
    elementIds: string[],
    boundingBox: BoundingBox;
  }) => void;
  selectedElementIds?: string[]
}

const DEFAULT_NODE_CONFIG = {
  renderEvents: [
    CYTOSCAPE_EVENT.select,
    CYTOSCAPE_EVENT.unselect,
    CYTOSCAPE_EVENT.selectEdge,
    CYTOSCAPE_EVENT.unselectEdge,
  ],
}

const DEFAULT_EDGE_CONFIG = {
  renderEvents: [
    CYTOSCAPE_EVENT.select,
    CYTOSCAPE_EVENT.unselect,
    CYTOSCAPE_EVENT.selectNode,
    CYTOSCAPE_EVENT.unselectNode,
  ],
}

export const DefaultRenderNode: RenderNode = ({
  item, element, cy, theme,
}) => {
  const hasSelectedEdge = element.connectedEdges(':selected').length > 0
  return (
    <GraphView
      style={{
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        backgroundColor: hasSelectedEdge
          ? theme.palette.secondary.main
          : (element.selected()
            ? theme.palette.primary.main
            : theme.palette.background.paper),
        borderRadius: 50,
      }}
      interactive
      click={() => {
        cyUnselectAll(cy)
        element.select()
      }}
      // rightclick={(e) => {
        // alert('Heyy')
      // }}
      // onRightPress={(e) => {
      // }}
      // mouseover={(e) => {
      // }}
      // onPressEnd={(e) => {
      // }}
    >
      <GraphText
        style={{
          position: 'absolute',
          top: -40,
          color: 'black',
        }}
        isSprite
      >
        {R.last(item.id.split('/'))?.substring(0, 10)}
      </GraphText>
    </GraphView>
  )
}

// @ts-ignore
export const DefaultRenderEdge: RenderEdge = ({
  cy,
  item,
  element,
}) => (
  <GraphView
    style={{
      // width: 20,
      // height: 20,
      position: 'absolute',

      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
      // backgroundColor: DefaultTheme.palette.background.paper,
      // element.selected()
      //   ? DefaultTheme.palette.primary.main
      //   : DefaultTheme.palette.background.paper,
      // borderRadius: 50,
    }}
    click={() => {
      cyUnselectAll(cy)
      element.select()
    }}
  >
    <GraphText
      style={{
        // position: 'absolute',
        // top: -40,
        // backgroundColor: DefaultTheme.palette.background.paper,
        color: 'black',
        fontSize: 12,
      }}
      isSprite
    >
      {R.last(item.id.split('/'))?.substring(0, 10)}
    </GraphText>
  </GraphView>
)

export const DefaultRenderClusterNode: RenderNode = ({
  item, element, cy, theme,
}) => {
  const hasSelectedEdge = element.connectedEdges(':selected').length > 0
  return (
    <GraphView
      style={{
        width: 150,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        backgroundColor: hasSelectedEdge
          ? theme.palette.secondary.main
          : (element.selected()
            ? theme.palette.primary.main
            : theme.palette.warning.main),
        borderRadius: 20,
      }}
      interactive
      click={() => {
        cyUnselectAll(cy)
        element.select()
      }}
      // rightclick={(e) => {
        // alert('Heyy')
      // }}
      // onRightPress={(e) => {
      // }}
      // mouseover={(e) => {
      // }}
      // onPressEnd={(e) => {
      // }}
    >
      <GraphText
        style={{
          position: 'absolute',
          top: -90,
          color: 'black',
        }}
        isSprite
      >
        {R.last(item.id.split('/'))?.substring(0, 10)}
      </GraphText>
    </GraphView>
  )
}

export type GraphType = React.FC<GraphProps>

const DEFAULT_CONFIG = {
  theme: DefaultTheme,
}
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
    config: _config = {} as Partial<GraphConfig>,
    onBoxSelection,
    selectedElementIds = [],
    children,
    renderClusterNode = DefaultRenderClusterNode,
  } = props
  const boxSelectionEnabled = !!onBoxSelection
  const config = React.useMemo(() => ({
    ...DEFAULT_CONFIG,
    ..._config,
  }), [_config])
  const { theme } = config
  const graphID = React.useMemo<string>(() => config.graphId ?? R.uuid(), [config.graphId])
  const stageRef = React.useRef<{ app: PIXI.Application }>(null)
  const viewportRef = React.useRef<ViewportRef>(null)
  const { cy } = useGraph({
    id: graphID,
    onLoad: () => {
    },
    clusters: config.clusters,
  })
  const graphRef = useForwardRef<GraphRef>(ref, { cy })
  const [
    containerRef,
    { width, height, initialized },
  ] = useMeasure()
  const graphLayoutRef = React.useRef<cytoscape.Layouts>(null)
  React.useMemo(() => {
    graphRef.current.app = stageRef.current?.app!
    graphRef.current.viewport = viewportRef.current!
    if (graphRef.current.app) {
      graphRef.current.app.view.addEventListener('contextmenu', (e) => {
        e.preventDefault()
      })
    }
  }, [stageRef.current, viewportRef.current])
  React.useEffect(() => {
    cyUnselectAll(cy)
    selectedElementIds.forEach((id) => {
      cy.$id(id).select()
    })
  }, [selectedElementIds, cy])
  React.useEffect(() => {
    R.when(
      () => stageRef.current && config.layout && initialized,
      () => {
        setTimeout(() => {
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
              const edgeContext = contextUtils.get(edge)
              edgeContext.onPositionChange()
            })
          })
          graphLayoutRef.current.start()
        }, 100)
      },
      true,
    )
  }, [stageRef.current, config.layout, initialized])
  const backgroundColor = React.useMemo(
    () => C.rgbNumber(theme.palette.background.default),
    [theme.palette.background.default],
  )
  React.useEffect(() => {
    stageRef.current!.app.renderer.backgroundColor = backgroundColor
  }, [backgroundColor])
  const {
    ids: nodeConfigIds,
    ...globalNodeConfig
  } = {
    ...DEFAULT_NODE_CONFIG,
    ...(config.nodes ?? {}),
  }
  const {
    ids: edgeConfigIds,
    ...globalEdgeConfig
  } = {
    ...DEFAULT_EDGE_CONFIG,
    ...(config.edges ?? {}),
  }
  // useWhyDidUpdate('heyy', {
  //   stageRef: stageRef.current, layout: config.layout, width, height,
  // })
  const onPressCallback = React.useCallback((e) => {
    cyUnselectAll(cy)
    onPress?.(e)
  }, [cy, onPress])
  return (
    <View
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
          value={theme}
        >
          <Viewport
          // @ts-ignore
            ref={viewportRef}
            onPress={onPressCallback}
            zoom={config.zoom}
            transform={config.transform}
            {...{ width, height }}
            onBoxSelectionEnd={({
              event,
              boundingBox,
            }) => {
              cyUnselectAll(cy)
              const elementIds: string[] = []
              const selectedCollection = cy.nodes().filter((element) => {
                const elementPosition = element.position()
                const selected = isPositionInBox(elementPosition, boundingBox)
                if (selected) {
                  element.select()
                  elementIds.push(element.id())
                }
                return selected
              })
              onBoxSelection?.({
                boundingBox,
                elements: selectedCollection,
                event,
                elementIds,
              })
            }}
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
                  graphRef={graphRef}
                  config={{
                    ...(globalNodeConfig ?? {}),
                    ...(nodeConfigIds?.[item.id] ?? {}),
                  }}
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
                  graphRef={graphRef}
                  drawLine={drawLine}
                  config={{
                    ...(globalEdgeConfig ?? {}),
                    ...(edgeConfigIds?.[item.id] ?? {}),
                  }}
                >
                  {renderEdge}
                </EdgeContainer>
              )}
            />
            <DataRender
              extraData={[extraData]}
              data={config.clusters ?? []}
              accessor={['children']}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                return (
                  <ClusterNodeContainer
                    graphID={graphID}
                    item={item}
                    graphRef={graphRef}
                    config={{
                      ...(globalNodeConfig ?? {}),
                      ...(nodeConfigIds?.[item.id] ?? {}),
                    }}
                  >
                    {renderClusterNode}
                  </ClusterNodeContainer>
                )
              }}
            />
            {children}
          </Viewport>
        </ThemeProvider>
      </Stage>
    </View>
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
