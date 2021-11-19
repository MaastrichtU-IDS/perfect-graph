import React from 'react'
// import { LayoutChangeEvent } from 'react-native'
import { EdgeSingular, NodeSingular, Core } from 'cytoscape'
import { Position, Enumerable } from 'colay/type'
import { Theme } from '@core/theme'
import {
  ELEMENT_TYPE,
  EVENT,
  DATA_TYPE,
  EDITOR_MODE,
  CYTOSCAPE_EVENT,
} from '@constants'
import { Viewport as ViewportNative } from 'pixi-viewport'
import * as PIXI from 'pixi.js'
import { YogaConstants } from '@utils/addFlexLayout/flex-layout/YogaContants'
import { YogaLayout } from '@utils/addFlexLayout/flex-layout/YogaLayout'
import GraphLayouts from '@core/layouts'
import type { GraphEditorProps } from '@components/GraphEditor'
import type * as PIXIType from './pixi'

export type Style = {[k: string]: any}
// export type OnLayout = (event: LayoutChangeEvent) => void
export type ElementContext<T = (NodeElementSettings | EdgeElementSettings)> = {
  render: (callback?: () => void) => void;
  onPositionChange: () => void;
  settings: T
}

export type BoundingBox = {
  x: number;
  y: number;
  width: number;
  height: number;
}
export type EdgeElementSettings = {
  filtered: boolean;
  nodeFiltered: boolean;
  visibility: {
    nodeVisible: boolean;
  }
  hovered: boolean
}
export type NodeElementSettings = {
  filtered: boolean;
  visibility: {
    cluster: boolean;
  }
  hovered: boolean;
}
export type NodeContext = ElementContext<NodeElementSettings> & {
  boundingBox: BoundingBox;
  element: NodeElement;
}

export type EdgeContext = ElementContext<EdgeElementSettings> & {
  element: EdgeElement;
}

export type EventType = keyof typeof EVENT
export type EditorMode = keyof typeof EDITOR_MODE

export type AdditionalDataItem = {
  name: string;
  value: string[];
  type: RDFType;
}

export type DataItem = {
  name: string;
  value: string[];
  type: RDFType;
  additional?: AdditionalDataItem[];
}

export type Ref<T> = React.Ref<T>
export type EdgeElement = EdgeSingular
export type NodeElement = NodeSingular

export type Element = EdgeElement | NodeElement
export type ElementData = NodeData | EdgeData

export type NodeData = {
  id: string;
  position?: Position;
  data?: DataItem[];
}

export type EdgeData = {
  id: string;
  source: string;
  target: string;
  data?: DataItem[];
}

export type GraphData = {
  nodes: NodeData[];
  edges: EdgeData[];
}

type RenderElementParams = {
  cy: Core;
  graphRef: React.RefObject<GraphRef>;
  theme: Theme;
}

type GraphEditorRenderElementExtraParams = {
  labelPath: string[];
  label: string;
}

type ExtendParams<T extends (a: any) => any, E> = (c: Parameters<T>[0] & E) => ReturnType<T>

export type RenderEdge<Additional extends Record<string, any> = {}> = (c: {
  item: EdgeData;
  element: EdgeElement;
  sourceElement: NodeElement;
  targetElement: NodeElement;
  from: Position;
  to: Position;
  sortedIndex: number;
  index: number;
  count: number;
} & RenderElementParams & Additional) => React.ReactElement

export type RenderNode<Additional extends Record<string, any> = {}> = (c: {
  item: NodeData;
  element: NodeElement;
} & RenderElementParams & Additional) => React.ReactElement

export type RenderClusterNode<Additional extends Record<string, any> = {}> = (c: {
  item: Cluster;
  element: NodeElement;
} & RenderElementParams & Additional) => React.ReactElement

export type GraphEditorRenderEdge<Additional extends Record<string, any> = {}> = ExtendParams<
RenderEdge,
GraphEditorRenderElementExtraParams & Additional
>

export type GraphEditorRenderNode<Additional extends Record<string, any> = {}> = ExtendParams<
RenderNode,
GraphEditorRenderElementExtraParams & Additional
>

export type GraphEditorRenderClusterNode<
Additional extends Record<string, any> = {},
> = ExtendParams<
RenderNode,
GraphEditorRenderElementExtraParams & Additional
>

export type ElementType = keyof typeof ELEMENT_TYPE

export type RDFValue = Enumerable<string | number>
export type RDFType = keyof typeof DATA_TYPE

export type PIXIFlexStyle = {
  display?: keyof typeof YogaConstants.Display | 'none';
  position?: keyof typeof YogaConstants.PositionType ;
  alignItems?: keyof typeof YogaConstants.Align;
  justifyContent?: keyof typeof YogaConstants.JustifyContent;
  flexDirection?: keyof typeof YogaConstants.FlexDirection;
  flexWrap?: keyof typeof YogaConstants.FlexWrap;
}
export type PIXIBasicStyle = {
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  zIndex?: number;
  marginBottom?: number;
} & PIXIFlexStyle

export type PIXIBasicProps = {
  interactive?: boolean;
  buttonMode?: boolean;
} & {
  [k in PIXIType.InteractionEventTypes]?: (e: PIXI.InteractionEvent) => void
}

export type PIXIShapeStyle = {
  backgroundColor?: string;
  color?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
}

export type {
  Theme,
} from '../core/theme'

export type CytoscapeEvent = keyof typeof CYTOSCAPE_EVENT

export type ElementFilterOption<E> = {
  test:(
    params: {element: E; item: (NodeData | EdgeData) }
  ) => boolean
  settings?: {
    opacity?: number
  }
}
export type ElementConfig<T = (NodeElement| EdgeElement)> = {
  renderEvents?: CytoscapeEvent[];
  filter?: ElementFilterOption<T>
}
export type NodeConfig = {
  position?: Position;
} & ElementConfig<NodeElement>

export type EdgeConfig = {
} & ElementConfig<EdgeElement>

export type Cluster = {
  id: string;
  name: string;
  ids: string[];
  childClusterIds: string[]
  visible?: boolean;
}

export type ClustersByNodeId = Record<string, Cluster[]>

export type ClustersByChildClusterId = Record<string, Cluster[]>

export type GraphConfig = {
  layout?: typeof GraphLayouts['cose'];
  clusters?: Cluster[];
  zoom?: number;
  transform?: {
    x?: number;
    y?: number;
    scaleX?: number;
    scaleY?: number;
    rotation?: number;
    skewX?: number;
    skewY?: number;
    pivotX?: number;
    pivotY?: number;
  };
  nodes?: {
    filter?: ElementFilterOption<NodeElement>
    renderEvents?: CytoscapeEvent[];
    ids?: {
      [id: string]: NodeConfig;
    }
  };
  edges?: {
    filter?: ElementFilterOption<EdgeElement>
    renderEvents?: CytoscapeEvent[];
    ids?: {
      [id: string]: EdgeConfig;
    }
  };
  backgroundColor?: string;
  theme?: Theme;
  graphId?: string
}

export type DisplayObjectWithYoga = PIXI.DisplayObject & {
  flex: boolean;
  yoga: YogaLayout;
}



export type PIXIDisplayObjectProps = {
  interactive?: boolean;
  buttonMode?: boolean;
} & Partial<PIXIEvents>

export type GraphLabelData = {
  global: { nodes: string[]; edges: string[] };
  nodes: Record<string, string[]>;
  edges: Record<string, string[]>;
  isGlobalFirst?: { nodes: boolean; edges: boolean; };
}

export type EventInfo = {
  id: string;
  date: string;
  type: EventType;
  item?: ElementData;
  elementId?: string;
  payload?: any;
  dataItem?: DataItem;
  index?: number;
  event?: Partial<PIXI.InteractionEvent>;
  avoidEventRecording?: boolean;
  avoidHistoryRecording?: boolean;
}

export type LightEventInfo = {
  type: EventType;
  item?: ElementData;
  elementId?: string;
  payload?: any;
  dataItem?: DataItem;
  index?: number;
  event?: Partial<PIXI.InteractionEvent>;
  avoidEventRecording?: boolean;
  avoidHistoryRecording?: boolean;
}

export type OnEvent = (eventInfo: EventInfo) => void
export type OnEventLite = (eventInfo: Omit<EventInfo, 'id' | 'date'>) => void

export type DrawLine = (
  arg: Parameters<RenderEdge>[0] & {
    graphics: PIXI.Graphics;
    to: Position;
    from: Position;
  }) => void

export type ViewportType = PIXI.DisplayObject & ViewportNative & {
  clickEvent: any;
  isClick: boolean;
  hitArea: BoundingBox
}
export type ViewportRef = ViewportType

export type GraphRef = {
  cy: Core;
  app: PIXI.Application;
  viewport: ViewportRef;
}

export type GraphEditorRef = GraphRef & {
  context: GraphEditorContext;
}

export type RecordedEvent = EventInfo

export type EventHistory = {
  currentIndex: number;
  events: EventInfo[];
  undoEvents: EventInfo[];
}

export type Playlist = {
  id: string;
  name: string;
  events: EventInfo[]
}

export type ControllerState = {
  label: GraphLabelData;
} & Pick<
GraphEditorProps,
'nodes' | 'edges' | 'mode' | 'selectedElementIds'
| 'actionBar' | 'dataBar' | 'settingsBar'
| 'graphConfig'
>

export type GraphEditorConfig = {
  enableNetworkStatistics?: boolean;
}

export type {
  GraphEditorProps,
} from '@components/GraphEditor'

export type NetworkStatistics = {
  global?: any
  local?: any
}

export type GraphEditorContext = {
  onEvent: OnEventLite;
  graphConfig?: GraphConfig;
  config?: GraphEditorConfig;
  label?: GraphLabelData;
  selectedElementIds?: string[] | null;
  mode?: EditorMode;
  events?: RecordedEvent[]
  eventHistory?: EventHistory;
  playlists?: Playlist[];
  localDataRef: React.RefObject<{
    initialized: boolean;
    targetNode: NodeElement | null;
    props: GraphEditorProps;
    issuedClusterId: string|null;
    newClusterBoxSelection: {
      elementIds: string[];
    };
    networkStatistics?: NetworkStatistics;
  }>;
  selectedItem?: ElementData;
  selectedElement?: Element;
  graphEditorRef: React.RefObject<GraphEditorRef>
  networkStatistics?: NetworkStatistics;
  nodes: NodeData[]
  edges: EdgeData[]
}