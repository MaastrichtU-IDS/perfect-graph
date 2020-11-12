import React from 'react'
import { LayoutChangeEvent } from 'react-native'
import { EdgeSingular, NodeSingular } from 'cytoscape'
import { Position, Enumerable } from 'unitx/type'
import {
  ELEMENT_TYPE, EVENT, DATA_TYPE, EDITOR_MODE,
} from '@utils/constants'
import { ViewportProps } from '@components/Viewport'
import * as PIXI from 'pixi.js'
import { YogaConstants } from '@utils/addFlexLayout/flex-layout/YogaContants'
import { YogaLayout } from '@utils/addFlexLayout/flex-layout/YogaLayout'
import GraphLayouts from '@core/layouts'

export type Style = {[k: string]: any}
export type OnLayout = (event: LayoutChangeEvent) => void
export type Context = { render: () => void }

export type Event = keyof typeof EVENT
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

export type RenderEdge<Additional extends Record<string, any> = {}> = (c: {
  item: EdgeData;
  element: EdgeElement;
  sourceElement: NodeElement;
  targetElement: NodeElement;
} & Additional) => React.ReactElement

export type RenderNode<Additional extends Record<string, any> = {}> = (c: {
  item: NodeData;
  element: NodeElement;
} & Additional) => React.ReactElement

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
} & PIXIFlexStyle

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

export type GraphConfig = {
  layout?: typeof GraphLayouts['cose'];
  zoom?: ViewportProps['zoom'];
  transform?: ViewportProps['transform'];
  positions?: { [id: string]: Position };
  backgroundColor?: string;
}

export type DisplayObjectWithYoga = PIXI.DisplayObject & {
  flex: boolean;
  yoga: YogaLayout;
}

export type GraphLabelData = {
  global: { nodes: string[]; edges: string[] };
  nodes: Record<string, string[]>;
  edges: Record<string, string[]>;
  isGlobalFirst?: boolean;
}

export type EventInfo = {
  type: Event;
  item: ElementData;
  element: Element;
  extraData?: any;
  dataItem?: DataItem;
  index?: number;
}

export type OnEvent = (eventInfo: EventInfo) => void
