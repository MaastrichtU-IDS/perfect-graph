import {ProfileTemplate} from '@components/templates/Profile'
import {ComponentType} from 'colay-ui/type'
import Layouts from '@core/layouts'
import {Clusters} from '@core/clusters'
import {ELEMENT_TYPE} from '@constants'
import {View} from './View'
import {Graphics} from './Graphics'
import {Text} from './Text'
import {Graph as NativeGraph, GraphProps} from './Graph'

export const Graph = NativeGraph as ComponentType<GraphProps> & {
  View: typeof View
  Text: typeof Text
  Graphics: typeof Graphics
  ProfileTemplate: typeof ProfileTemplate
  Layouts: typeof Layouts
  Clusters: typeof Clusters
  elementType: typeof ELEMENT_TYPE
}

Graph.View = View
Graph.Text = Text
Graph.Graphics = Graphics
Graph.ProfileTemplate = ProfileTemplate
Graph.Layouts = Layouts
Graph.Clusters = Clusters
Graph.elementType = ELEMENT_TYPE

export {DefaultRenderEdge, DefaultRenderNode} from './Graph'
export {ProfileTemplate} from './templates/Profile'

export type {GraphProps} from './Graph'
export type {GraphEditorProps} from './GraphEditor'

// export  { GraphEditor } from './GraphEditor'

export {drawLine} from './Graphics'
