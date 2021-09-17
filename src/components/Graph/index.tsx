import '@core/config'
import { DefaultTheme, ThemeProvider } from '@core/theme'
import { useGraph } from '@hooks'
import { Stage } from '@inlet/react-pixi'
import {
  DrawLine, EdgeData, GraphConfig,
  GraphRef, NodeData, RenderEdge, RenderNode, ViewportRef,
  RenderClusterNode,
} from '@type'
import {
  calculateVisibilityByContext, contextUtils, cyUnselectAll, isPositionInBox,
} from '@utils'
import { CYTOSCAPE_EVENT } from '@constants'
import {
  DataRender, useForwardRef,
  View,
  ViewProps, wrapComponent,
} from 'colay-ui'
import { PropsWithRef } from 'colay-ui/type'
import * as C from 'colay/color'
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
    elementIds: string[],
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
  React.useEffect(() => {
    graphRef.current.app = stageRef.current?.app!
    if (graphRef.current.app) {
      graphRef.current.app.view.addEventListener('contextmenu', (e) => {
        e.preventDefault()
      })
    }
  }, [stageRef.current])
  React.useEffect(() => {
    cyUnselectAll(cy)
    selectedElementIds.forEach((id) => {
      cy.$id(id).select()
    })
  }, [selectedElementIds, cy])
  React.useEffect(() => {
    if (stageRef.current && config.layout) {
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
    }
  }, [config.layout])
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
              graphRef.current.viewport = viewport
            }}
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
                const elementContext = contextUtils.get(element)
                const selected = calculateVisibilityByContext(elementContext)
                  && isPositionInBox(elementPosition, boundingBox)
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
              extraData={[extraData, config.nodes, config.clusters]}
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
              extraData={[extraData, config.edges, config.clusters]}
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
              renderItem={({ item }) => (
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
              )}
            />
            {children}
          </Viewport>
        </ThemeProvider>
      </Stage>
    </View>
  )
}

const DEFAULT_NODE_CONFIG = {
  renderEvents: [
    CYTOSCAPE_EVENT.select,
    CYTOSCAPE_EVENT.unselect,
    CYTOSCAPE_EVENT.selectEdge,
    CYTOSCAPE_EVENT.unselectEdge,
    CYTOSCAPE_EVENT.mouseover,
    CYTOSCAPE_EVENT.mouseout,
  ],
}

const DEFAULT_EDGE_CONFIG = {
  renderEvents: [
    CYTOSCAPE_EVENT.select,
    CYTOSCAPE_EVENT.unselect,
    CYTOSCAPE_EVENT.selectNode,
    CYTOSCAPE_EVENT.unselectNode,
    CYTOSCAPE_EVENT.mouseover,
    CYTOSCAPE_EVENT.mouseout,
  ],
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
