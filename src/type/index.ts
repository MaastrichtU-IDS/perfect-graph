import type { GraphEditorProps } from '@components/GraphEditor'
import {
  CYTOSCAPE_EVENT, DATA_TYPE,
  EDITOR_MODE, ELEMENT_TYPE,
  EVENT,
} from '@constants'
import GraphLayouts from '@core/layouts'
import { Theme } from '@core/theme'
import { FormProps as FormPropsDefault } from '@rjsf/core'
import { YogaLayout } from '@utils/addFlexLayout/flex-layout/YogaLayout'
import { Enumerable, Position } from 'colay/type'
// import { LayoutChangeEvent } from 'react-native'
import { Core, EdgeSingular, NodeSingular } from 'cytoscape'
import { Viewport as ViewportNative } from 'pixi-viewport'
import * as PIXI from 'pixi.js'
import React from 'react'
import type * as PIXIType from './pixi'

declare module 'pixi.js' {
  // @ts-ignore
  interface DisplayObject extends PIXI.DisplayObject {
    yoga: YogaLayout;

    /**
    * Internal property for fast checking if object has yoga
    */
    __hasYoga: boolean;

    _visible: boolean;

    flex: boolean;

    /**
    * Applies yoga layout to DisplayObject
    */
    updateYogaLayout(): void;

    /**
    * Checks boundaries of DisplayObject and emits NEED_LAYOUT_UPDATE if needed
    */
    checkIfBoundingBoxChanged(): void;
    _yogaLayoutHash: number;
    _prevYogaLayoutHash: number;
    __yoga: YogaLayout;
  }
}

declare module 'cytoscape' {
  // @ts-ignore
  interface NodeSingular extends cytoscape.NodeSingular {
    /**
     * Node element hovered
     */
    hovered: () => boolean;
    /**
     * Node element filtered
     */
    filtered: () => boolean;
  }
  // @ts-ignore
  interface EdgeSingular extends cytoscape.EdgeSingular  {
    /**
     * Edge element hovered
     */
    hovered: () => boolean;
    /**
     * Edge element filtered
     */
    filtered: () => boolean;
  }
}

/**
* Style for view components
*/
export type Style = { [k: string]: any }

/**
* Cytoscape element context
*/
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
  /**
   * Edge is filtered by given filter function
   */
  filtered: boolean;
  /**
   * Edge's source or target node is filtered
   */
  nodeFiltered: boolean;
  /**
   * Visibility tracking object
   */
  visibility: {
    nodeVisible: boolean;
  }
  /**
   * Hovered state
   */
  hovered: boolean
}
export type NodeElementSettings = {
  /**
   * Node is filtered by given filter function
   */
  filtered: boolean;
  /**
   * Visibility tracking object
   */
  visibility: {
    cluster: boolean;
  }
  /**
   * Hovered state
   */
  hovered: boolean;
}

export type NodeContext = ElementContext<NodeElementSettings> & {
  /**
   * Node's bounding box without children
   */
  boundingBox: BoundingBox;
  /**
   * Node cytoscape element
   */
  element: NodeElement;
}

export type EdgeContext = ElementContext<EdgeElementSettings> & {
  /**
   * Edge cytoscape element
   */
  element: EdgeElement;
}

/**
* GraphEditor Event Types
*/
export type EventType = keyof typeof EVENT
/**
* GraphEditor mode
*/
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
  /**
   * Node id for cytoscape
   */
  id: string;
  /**
   * Node initial position
   */
  position?: Position;
  /**
   * Node data
   */
  data?: any;
}

export type EdgeData = {
  /**
   * Edge id for cytoscape
   */
  id: string;
  /**
   * Edge source id for cytoscape
   */
  source: string;
  /**
   * Edge target id for cytoscape
   */
  target: string;
  /**
   * Edge data
   */
  data?: any;
}

export type GraphData = {
  nodes: NodeData[];
  edges: EdgeData[];
}

/**
 * Edge or Node render element function
 */
type RenderElementParams = {
  /**
   * Related cytoscape instance
   */
  cy: Core;
  /**
   * Related graph instance ref
   */
  graphRef: React.RefObject<GraphRef>;
  theme: Theme;
}

type GraphEditorRenderElementExtraParams = {
  /**
   * Selected label path
   */
  labelPath: string[];
  /**
   * Element default label
   */
  label: string;
}

type ExtendParams<T extends (a: any) => any, E> = (c: Parameters<T>[0] & E) => ReturnType<T>

export type RenderEdge<Additional extends Record<string, any> = {}> = (c: {
  /**
   * Edge data
   */
  item: EdgeData;
  /**
   * Edge cytoscape element
   */
  element: EdgeElement;
  /**
   * Edge source element
   */
  sourceElement: NodeElement;
  /**
   * Edge target element
   */
  targetElement: NodeElement;
  /**
   * Edge source position
   */
  from: Position;
  /**
   * Edge target position
   */
  to: Position;
  /**
   * Edge index among neighbors after sorting
   */
  sortedIndex: number;
  /**
   * Edge index among neighbors
   */
  index: number;
  /**
   * Edge count with neighbors
   */
  count: number;
  /**
   * Edge config data
   */
  config: EdgeConfig;
  /**
   * Edge context
   */
  context: EdgeContext;
} & RenderElementParams & Additional) => React.ReactElement

export type RenderNode<Additional extends Record<string, any> = {}> = (c: {
  /**
   * Node data
   */
  item: NodeData;
  /**
   * Node cytoscape element
   */
  element: NodeElement;
  /**
   * Node config data
   */
  config: NodeConfig;
  /**
   * Node context
   */
  context: NodeContext;
} & RenderElementParams & Additional) => React.ReactElement

export type RenderClusterNode<Additional extends Record<string, any> = {}> = (c: {
  /**
   * Cluster Node data
   */
  item: Cluster;
  /**
   * Cluster node cytoscape element
   */
  element: NodeElement;
  /**
   * Cluster node config data
   */
  config: NodeConfig;
  /**
   * Cluster node context
   */
  context: NodeContext;
} & RenderElementParams & Additional) => React.ReactElement

/**
 * GraphEditor Edge render element function
 */
export type GraphEditorRenderEdge<Additional extends Record<string, any> = {}> = ExtendParams<
RenderEdge,
GraphEditorRenderElementExtraParams & Additional
>


/**
 * GraphEditor Node render element function
 */
export type GraphEditorRenderNode<Additional extends Record<string, any> = {}> = ExtendParams<
RenderNode,
GraphEditorRenderElementExtraParams & Additional
>


/**
 * GraphEditor Cluster Node render element function
 */
export type GraphEditorRenderClusterNode<
Additional extends Record<string, any> = {},
> = ExtendParams<
RenderNode,
GraphEditorRenderElementExtraParams & Additional
>

export type ElementType = keyof typeof ELEMENT_TYPE

export type RDFValue = Enumerable<string | number>

export type RDFType = keyof typeof DATA_TYPE



export type PIXIBasicProps = {
  interactive?: boolean;
  buttonMode?: boolean;
} & {
  [k in PIXIType.InteractionEventTypes]?: (e: PIXI.InteractionEvent) => void
}

export type {
  GraphEditorProps,
} from '@components/GraphEditor'
export type {
  Theme,
} from '../core/theme'

export type CytoscapeEvent = keyof typeof CYTOSCAPE_EVENT

export type ElementFilterOption<E> = {
  /**
   * If return true, element will be filtered
   */
  test?:(
    params: { element: E; item: (NodeData | EdgeData) }
  ) => boolean
  /**
   * Settings for filtered elements
   */
  settings: {
    opacity: number
  }
}
export type ElementConfig<T = (NodeElement | EdgeElement)> = {
  /**
   * When events are triggered, the element will be rerendered.
   */
  renderEvents: CytoscapeEvent[];
  /**
   * Filter config data
   */
  filter: ElementFilterOption<T>;
}
export type NodeConfig = {
  /**
   * Node position
   */
  position?: Position;
  /**
   * Node view settings
   */
  view: {
    width: number;
    height: number;
    radius: number;
    fill: {
      hovered: number;
      selected: number;
      default: number;
      edgeSelected: number;
    };
    labelVisible: boolean;
  }
} & ElementConfig<NodeElement>

export type EdgeLineType = 'bezier' | 'segments' | 'line'

export type EdgeConfig = {
  /**
   * Edge view settings
   */
  view: {
    lineType: EdgeLineType;
    width: number;
    alpha: number;
    fill: {
      hovered: number;
      selected: number;
      default: number;
      nodeSelected: number;
    };
    labelVisible: boolean;
  }
} & ElementConfig<EdgeElement>

export type Cluster = {
  id: string;
  /**
   * Cluster name or label
   */
  name: string;
  /**
   * Member node ids
   */
  ids: string[];
  /**
   * Member child cluster ids
   */
  childClusterIds: string[]
  visible?: boolean;
  /**
   * Cluster node position
   */
  position?: Position;
}

export type ClustersByNodeId = Record<string, Cluster[]>

export type ClustersByChildClusterId = Record<string, Cluster[]>

export type GraphNodesConfig = NodeConfig & {
  ids?: {
    [id: string]: NodeConfig;
  }
}

export type GraphEdgesConfig = EdgeConfig & {
  ids?: {
    [id: string]: EdgeConfig;
  }
}

export type GraphConfig = {
  /**
   * Calculate the layout of the graph and set the node positions.
   */
  layout?: typeof GraphLayouts['cose'] & {
    /**
     * Change the zoom and avoid overlaps of the nodes.
     */
    expansion?: number;
  };
  /**
  * Cluster config data
  */
  clusters?: Cluster[];
  /**
  * Viewport zoom level
  */
  zoom?: number;
  /**
  * Viewport transform data
  */
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
  /**
  * Graph node data list
  */
  nodes?: GraphNodesConfig;
  /**
  * Graph edge data list
  */
  edges?: GraphEdgesConfig
  /**
  * Viewport background color
  */
  backgroundColor?: number;
  /**
  * Theme for graph stage and elements
  */
  theme?: Theme;
  /**
  * Related graph id, if not set, it will be generated
  */
  graphId?: string
}

export type DisplayObjectWithYoga = PIXI.DisplayObject & {
  flex: boolean;
  yoga: YogaLayout;
}



export type PIXIDisplayObjectProps = {
  /**
  * To make object interactive
  */
  interactive?: boolean;
  /**
  * To make object clickable
  */
  buttonMode?: boolean;
}

export type GraphLabelData = {
  /**
  * To set label path for all nodes and edges ; will be overridden 
  * by set node and edge label path
  */
  global: { nodes: string[]; edges: string[] };
  /**
  * To override global label path for specific nodes (id as key)
  */
  nodes: Record<string, string[]>;
  /**
  * To override global label path for specific edges (id as key)
  */
  edges: Record<string, string[]>;
  /**
  * Is global label path override
  */
  isGlobalFirst?: { nodes: boolean; edges: boolean; };
}

export type EventInfo = {
  /**
  * Unique event id
  */
  id: string;
  /**
  * Event date
  */
  date: string;
  type: EventType;
  /**
  * Event target element data
  */
  item?: ElementData;
  /**
  * Event target element id
  */
  elementId?: string;
  /**
  * Event payload
  */
  payload?: any;
  /**
  * Event dataItem ; deprecated
  */
  dataItem?: DataItem;
  /**
  * Event index ; deprecated
  */
  index?: number;
  /**
  * Original event
  */
  event?: Partial<PIXI.InteractionEvent>;
  /**
  * To avoid events being recorded by event recorder
  */
  avoidEventRecording?: boolean;
  /**
  * To avoid events being recorded by history recorder
  */
  avoidHistoryRecording?: boolean;
}

export type LiteEventInfo = {
  type: EventType;
  /**
  * Event target element data
  */
  item?: ElementData;
  /**
  * Event target element id
  */
  elementId?: string;
  /**
  * Event payload
  */
  payload?: any;
  /**
  * Event dataItem ; deprecated
  */
  dataItem?: DataItem;
  /**
  * Event index ; deprecated
  */
  index?: number;
  /**
  * Original event
  */
  event?: Partial<PIXI.InteractionEvent>;
  /**
  * To avoid events being recorded by event recorder
  */
  avoidEventRecording?: boolean;
  /**
  * To avoid events being recorded by history recorder
  */
  avoidHistoryRecording?: boolean;
}

/**
* GraphEditor Event handler
*/
export type OnEvent = (eventInfo: EventInfo) => void

/**
* GraphEditor Lite Event handler
*/
export type OnEventLite = (eventInfo: Omit<EventInfo, 'id' | 'date'>) => void

/**
* Graph drawLine function for edge vectors
*/
export type DrawLine = (
  arg: Parameters<RenderEdge>[0] & {
    /**
    * Graphics instance
    */
    graphics: PIXI.Graphics;
    /**
    * Edge source position
    */
    from: Position;
    /**
    * Edge target position
    */
    to: Position;
  }) => void

export type ViewportType = PIXI.DisplayObject & ViewportNative & {
  /**
  * To track double click ; save first click event
  */
  clickEvent: any;
  /**
  * To track double click ; save isClick
  */
  isClick: boolean;
  /**
  * Refers to area of Viewport
  */
  hitArea: BoundingBox;
  /**
  * Track the quality of rendering settings
  */
  qualityLevel: number;
  /**
  * Old quality of rendering settings
  */
  oldQualityLevel: number;
}
export type ViewportRef = ViewportType

export type GraphRef = {
  /**
  * Cytoscape instance
  */
  cy: Core;
  /**
  * PIXI instance
  */
  app: PIXI.Application;
  /**
  * PIXI Viewport instance
  */
  viewport: ViewportRef;
}

export type GraphEditorRef = GraphRef & {
  /**
  * GraphEditor context
  */
  context: GraphEditorContextType;
}

export type RecordedEvent = EventInfo

export type EventHistory = {
  currentIndex: number;
  /**
  * Recorded events
  */
  events: EventInfo[];
  /**
  * To undo events 
  */
  undoEvents: EventInfo[];
}

export type Playlist = {
  id: string;
  name: string;
  /**
  * Recorded events
  */
  events: EventInfo[]
}

export type ControllerState = {
  /**
   * GraphEditor Event Handler
   */
  onEvent: (
    eventInfo: EventInfo & {
      graphEditor: GraphEditorRef;
    },
    draft: ControllerState
  ) => boolean | void
} & Pick<
GraphEditorProps,
'nodes' | 'edges' | 'mode' | 'selectedElementIds'
| 'actionBar' | 'dataBar' | 'settingsBar'
| 'graphConfig' | 'playlists' | 'isLoading' | 'modals' | 'events'
| 'preferencesModal' | 'isFocusMode' | 'previousDataList' | 'label' 
| 'networkStatistics'

>

export type GraphEditorConfig = {
  enableNetworkStatistics?: boolean;
}


export type NetworkStatistics = {
  /**
   * Global network statistics calculated for whole graph
   */
  global?: any
  /**
   * Local network statistics calculated for imported graph
   */
  local?: any
  /**
   * Sort function for network statistics fields
   */
  sort?: any;
}

export type GraphEditorContextType = {
  /**
   * Event handler for all events that are emitted by the graph editor.
   */
  onEvent: OnEventLite;
  /**
  * All graph config data for nodes and edges. It will supply the config data for the graph.
  */
  graphConfig?: GraphConfig;
  /**
  * GraphEditor config data for all operations.
  */
  config?: GraphEditorConfig;
  /**
  * Config for labels of nodes and edges
  */
  label?: GraphLabelData;
  /**
  * It gives the selected nodes. It is used for selected node highlighting and DataBar
  */
  selectedElementIds?: string[] | null;
  /**
  * Editor mode for changing actions and mouse icon
  */
  mode?: EditorMode;
  /**
  * Recorded events will be displayed on SettingsBar
  */
  events?: RecordedEvent[]
  /**
  * Event history will be displayed on SettingsBar
  */
  eventHistory?: EventHistory;
  /**
  * Events playlist will be displayed on SettingsBar
  */
  playlists?: Playlist[];
  /**
  * Locally used state for GraphEditor
  */
  localDataRef: React.RefObject<{
    initialized: boolean;
    targetNode: NodeElement | null;
    props: GraphEditorProps;
    issuedClusterId: string | null;
    newClusterBoxSelection: {
      elementIds: string[];
    };
    networkStatistics?: NetworkStatistics;
    contextMenu: {
      itemIds: string[]
    }
  }>;
  /**
  * GraphEditor instance ref
  */
  graphEditorRef: React.RefObject<GraphEditorRef>
  /**
  * Calculated network statistics will be displayed on SettingsBar
  */
  networkStatistics?: NetworkStatistics;
  /**
  * Node data list
  */
  nodes: NodeData[]
  /**
  * Edge data list
  */
  edges: EdgeData[]
  /**
  * Selected Item to view data
  */
  selectedItem?: ElementData | null;
  /**
  * Selected Element to view data
  */
  selectedElement?: Element | null;
}


export type FormProps<T = any> = FormPropsDefault<T> & {
  onClear?: (params: { formData: T }) => void;
}

type OnBoxSelectionEvent = {
  /**
   * Original Event
   */
  event: PIXI.InteractionEvent,
  /**
   * Selected elements
   */
  elements: cytoscape.Collection,
  /**
   * Selected elements ids
   */
  itemIds: string[],
  /**
   * Selected boundingBox
   */
  boundingBox: BoundingBox;
}

export type OnBoxSelection = (event: OnBoxSelectionEvent) => void

export type PreviousData = {
  nodes: NodeData[];
  edges: EdgeData[];
}

export type PropsWithRef<C, P> = Omit<P, 'ref'> & {
  ref?: React.Ref<C>;
}