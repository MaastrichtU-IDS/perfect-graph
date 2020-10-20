import React from 'react'
import { LayoutChangeEvent } from 'react-native'
import { EdgeSingular, NodeSingular } from 'cytoscape'
import { Position } from 'unitx-ui/type'
import { ElementType, ActionType } from '@utils/constants'

export type Style = {[k: string]: any}
export type OnLayout = (event: LayoutChangeEvent) => void
export type Context = { render: () => void }
export type DataItem = {
  key: string | number;
  value: any;
  type: 'string'|'number'|'object'|'array'| 'reference'| 'location'| 'image';
}

export type Ref<T> = React.Ref<T>
export type EdgeElement = EdgeSingular
export type NodeElement = NodeSingular

export type Element = EdgeElement | NodeElement

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

export type RenderEdge = (c: {
  item: EdgeData;
  element: EdgeElement;
  sourceElement: NodeElement;
  targetElement: NodeElement;
}) => React.ReactElement

export type RenderNode = (c: {
  item: NodeData;
  element: NodeElement;
}) => React.ReactElement

export type ElementTypeName = keyof typeof ElementType
export type ActionTypeName = keyof typeof ActionType
