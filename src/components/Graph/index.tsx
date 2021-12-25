import '@core/config'
import { DefaultTheme, ThemeProvider } from '@core/theme'
import { useGraph } from '@hooks'
import { Stage } from '@inlet/react-pixi'
import {
  DrawLine, EdgeData, GraphConfig,
  GraphRef, NodeData, RenderEdge, RenderNode,
  RenderClusterNode,  NodeConfig, EdgeConfig,
  ViewportType,
  GraphNodesConfig,
  GraphEdgesConfig,
} from '@type'
import {
  calculateVisibilityByContext, 
  contextUtils, cyUnselectAll, isPositionInBox,
  adjustVisualQuality, isFiltered,
} from '@utils'
import { DEFAULT_EDGE_CONFIG, DEFAULT_NODE_CONFIG } from '@constants'
import {
  DataRender, 
  useForwardRef,
  View,
  ViewProps, wrapComponent,
} from 'colay-ui'
import { PropsWithRef } from 'colay-ui/type'
import * as R from 'colay/ramda'
import { BoundingBox } from 'colay/type'
import React from 'react'
import * as PIXI from 'pixi.js'
import { ClusterNodeContainer } from '../ClusterNodeContainer'
import { EdgeContainer } from '../EdgeContainer'
import { NodeContainer } from '../NodeContainer'
import { DefaultRenderClusterNode } from './DefaultRenderClusterNode'
import { DefaultRenderNode } from './DefaultRenderNode'
import { DefaultRenderEdge } from './DefaultRenderEdge'
import { Viewport, ViewportProps } from '../Viewport'

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
    itemIds: string[],
    boundingBox: BoundingBox;
  }) => void;
  selectedElementIds?: string[]
}

const GraphElement = (props: GraphProps, ref: React.ForwardedRef<GraphRef>) => {
  const {
    style = {},
    nodes = [],
    edges = [],
    onPress,
    renderNode = DefaultRenderNode,
    renderEdge = DefaultRenderEdge,
    drawLine,
    extraData,
    config: configProp = {} as Partial<GraphConfig>,
    onBoxSelection,
    selectedElementIds = [],
    children,
    renderClusterNode = DefaultRenderClusterNode,
  } = props
  // const boxSelectionEnabled = !!onBoxSelection
  const width = style?.width as number
  const height = style?.height as number
  const config = React.useMemo(() => ({
    ...DEFAULT_CONFIG,
    ...configProp,
  }), [configProp])
  const { theme } = config
  const graphID = React.useMemo<string>(() => config.graphId ?? R.uuid(), [config.graphId])
  const stageRef = React.useRef<{ app: PIXI.Application }>(null)
  const { cy } = useGraph({
    id: graphID,
    onLoad: () => {
    },
    clusters: config.clusters,
  })
  const graphRef = useForwardRef<GraphRef>(ref, { cy })
  const graphLayoutRef = React.useRef<cytoscape.Layouts>(null)
  React.useMemo(() => {
    const objectCount  = nodes.length + edges.length

    if (graphRef.current.viewport){
      adjustVisualQuality(objectCount, graphRef.current.viewport)
    }
  }, [nodes, edges])
  React.useEffect(() => {
    if (!graphRef.current.app && !config.layout) {
      graphRef.current.viewport.dirty = true
    }
    graphRef.current.app = stageRef.current?.app!
    if (graphRef.current.app) {
      graphRef.current.app.view.addEventListener('contextmenu', (e) => {
        e.preventDefault()
      })
    }
  }, [stageRef.current])
  React.useEffect(() => {
    if (selectedElementIds?.length > 0) {
      cyUnselectAll(cy)
      selectedElementIds.forEach((id) => {
        cy.$id(id).select()
      })
    }
  }, [selectedElementIds, cy])
  React.useEffect(() => {
    if (stageRef.current && config.layout) {
      const {
        expansion, // = getViewportZoom(graphRef.current)
      } = config.layout
      if (expansion) {
        graphRef.current.viewport.setZoom(expansion, true)
      }
      setTimeout(() => {
        const { hitArea } = graphRef.current.viewport
        const boundingBox = {
          x1: hitArea.x,
          y1: hitArea.y,
          w: hitArea.width,
          h: hitArea.height,
        }
        graphLayoutRef.current?.stop()
        // @ts-ignore
        graphLayoutRef.current = cy.createLayout({
          boundingBox,
          ...config.layout,
        })
        graphLayoutRef.current.on('layoutstop', () => {
        // @ts-ignore
          graphLayoutRef.current = null
          // Fix the edge lines
          cy.edges().forEach((edge) => {
            const edgeContext = contextUtils.get(edge)
            edgeContext.onPositionChange()
          })
          // FOR CULLING
          graphRef.current.viewport.dirty = true
        })
        graphLayoutRef.current.start()
      }, 200)
    }
  }, [config.layout])
  const backgroundColor = React.useMemo(
    () => theme.palette.background.default,
    [theme.palette.background.default],
  )
  React.useEffect(() => {
    stageRef.current!.app.renderer.backgroundColor = backgroundColor
  }, [backgroundColor])
  const {
    ids: nodeConfigIds,
    ...globalNodeConfig
  } = React.useMemo(
    () => R.mergeDeepAll([DEFAULT_NODE_CONFIG, config.nodes ?? {}]),
    [config.nodes],
  ) as GraphNodesConfig
  const {
    ids: edgeConfigIds,
    ...globalEdgeConfig
  } =  React.useMemo(
    () => R.mergeDeepAll([DEFAULT_EDGE_CONFIG, config.edges ?? {}]),
    [config.edges],
  ) as GraphEdgesConfig

  const onPressCallback = React.useCallback((e) => {
    cyUnselectAll(cy)
    onPress?.(e)
  }, [cy, onPress])
  return (
    <View
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
            onCreate={(viewport) => {
              graphRef.current.viewport = viewport as ViewportType
            }}
            onPress={onPressCallback}
            zoom={config.zoom}
            transform={config.transform}
            {...{ width, height }}
            onBoxSelectionEnd={({
              event,
              boundingBox,
            }) => {
              const itemIds: string[] = []
              const selectedCollection = cy.nodes().filter((element) => {
                const elementPosition = element.position()
                const selected = calculateVisibilityByContext(element)
                  && isFiltered(element)
                  && isPositionInBox(elementPosition, boundingBox)
                if (selected) {
                  itemIds.push(element.id())
                }
                return selected
              })
              onBoxSelection?.({
                boundingBox,
                elements: selectedCollection,
                event,
                itemIds,
              })
            }}
          >
            <DataRender
              extraData={[extraData, config.nodes, config.clusters]}
              data={nodes}
              accessor={['children']}
              keyExtractor={(item) => item.id}
              renderItem={(args) => (
                <RenderNodeContainer 
                  {...args}
                  graphID={graphID}
                  graphRef={graphRef}
                  globalNodeConfig={globalNodeConfig}
                  nodeConfigIds={nodeConfigIds}
                  renderNode={renderNode}
                />
              )}
            />
            <DataRender
              extraData={[extraData, config.edges, config.clusters]}
              data={edges}
              accessor={['children']}
              keyExtractor={(item) => item.id}
              renderItem={(args) => (
                <RenderEdgeContainer 
                  {...args} 
                  graphID={graphID}
                  graphRef={graphRef}
                  drawLine={drawLine}
                  globalEdgeConfig={globalEdgeConfig}
                  edgeConfigIds={edgeConfigIds}
                  renderEdge={renderEdge}
                />
              )}
            />
            <DataRender
              extraData={[extraData]}
              data={config.clusters ?? []}
              accessor={['children']}
              keyExtractor={(item) => item.id}
              renderItem={(args) => {
                return (
                  <RenderClusterNodeContainer 
                    {...args}
                    graphID={graphID}
                    graphRef={graphRef}
                    globalNodeConfig={globalNodeConfig}
                    nodeConfigIds={nodeConfigIds}
                    renderClusterNode={renderClusterNode}
                  />
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

const RenderNodeContainer = ({
  graphID,
  item,
  graphRef,
  globalNodeConfig,
  nodeConfigIds,
  renderNode,
}: any) => {
  const config = React.useMemo(
    () => R.mergeDeepAll([globalNodeConfig, nodeConfigIds?.[item.id] ?? {}]),
    [globalNodeConfig, nodeConfigIds?.[item.id]],
  ) as NodeConfig
  return (
    <NodeContainer
      graphID={graphID}
      item={item}
      graphRef={graphRef}
      config={config}
    >
      {renderNode}
    </NodeContainer>
  )
}

const RenderEdgeContainer  = ({ 
  item,
  graphID,
  graphRef,
  drawLine,
  globalEdgeConfig,
  edgeConfigIds,
  renderEdge,
}: any) => {
  const config = React.useMemo(
    () => R.mergeDeepAll([globalEdgeConfig, edgeConfigIds?.[item.id] ?? {}]),
    [globalEdgeConfig, edgeConfigIds?.[item.id]],
  ) as EdgeConfig
  return (
    <EdgeContainer
      graphID={graphID}
      item={item}
      graphRef={graphRef}
      drawLine={drawLine}
      config={config}
    >
      {renderEdge}
    </EdgeContainer>
  )
}

const RenderClusterNodeContainer = ({
  graphID,
  item,
  graphRef,
  globalNodeConfig,
  nodeConfigIds,
  renderClusterNode,
}: any) => {
  const config = React.useMemo(
    () => R.mergeDeepAll([globalNodeConfig, nodeConfigIds?.[item.id] ?? {}]),
    [globalNodeConfig, nodeConfigIds?.[item.id]],
  ) as NodeConfig
  return (
    <ClusterNodeContainer
      graphID={graphID}
      item={item}
      graphRef={graphRef}
      config={config}
    >
      {renderClusterNode}
    </ClusterNodeContainer>
  )
}




const DEFAULT_CONFIG = {
  theme: DefaultTheme,
}

export const Graph = wrapComponent<PropsWithRef<GraphRef, GraphProps>>(
  GraphElement,
  {
    isForwardRef: true,
    isEqual: R.equalsExclude(R.is(Function)),
  },
)

export { DefaultRenderClusterNode } from './DefaultRenderClusterNode'
export { DefaultRenderNode } from './DefaultRenderNode'
export { DefaultRenderEdge } from './DefaultRenderEdge'
