import ProfileTemplate from '@components/templates/Profile'
import { ComponentType } from 'colay-ui/type'
import Layouts from '@core/layouts'
import { Clusters } from '@core/clusters'
import { ELEMENT_TYPE } from '@utils/constants'
import View from './View'
import Graphics from './Graphics'
import Pressable from './Pressable'
import Text from './Text'
import Image from './Image'
import HoverContainer from './HoverContainer'
import NativeGraph, { GraphProps } from './Graph'

export const Graph = NativeGraph as ComponentType<GraphProps> & {
  View: typeof View;
  Text: typeof Text;
  Image: typeof Image;
  Pressable: typeof Pressable;
  Graphics: typeof Graphics;
  ProfileTemplate: typeof ProfileTemplate;
  Layouts: typeof Layouts;
  Clusters: typeof Clusters;
  HoverContainer: typeof HoverContainer;
  elementType: typeof ELEMENT_TYPE;
}

Graph.View = View
Graph.Text = Text
Graph.Image = Image
Graph.Pressable = Pressable
Graph.Graphics = Graphics
Graph.ProfileTemplate = ProfileTemplate
Graph.Layouts = Layouts
Graph.Clusters = Clusters
Graph.HoverContainer = HoverContainer
Graph.elementType = ELEMENT_TYPE

export { DefaultRenderEdge, DefaultRenderNode } from './Graph'
export {
  default as ProfileTemplate,
} from './templates/Profile'

export { GraphProps } from './Graph'

export {
  drawLine,
} from './Graphics'

export {
  GraphEditor,
  GraphEditorProps,
} from './GraphEditor'
