import ProfileTemplate from '@components/templates/Profile'
import { ComponentType } from 'unitx-ui/type'
import Layouts from '@core/layouts'
import { ELEMENT_TYPE } from '@utils/constants'
import View from './View'
import Graphics from './Graphics'
import Touchable from './Touchable'
import Text from './Text'
import Image from './Image'
import HoverContainer from './HoverContainer'
import NativeGraph, { GraphProps } from './Graph'

export const Graph = NativeGraph as ComponentType<GraphProps> & {
  View: typeof View;
  Text: typeof Text;
  Image: typeof Image;
  Touchable: typeof Touchable;
  Graphics: typeof Graphics;
  ProfileTemplate: typeof ProfileTemplate;
  Layouts: typeof Layouts;
  HoverContainer: typeof HoverContainer;
  elementType: typeof ELEMENT_TYPE;
}

Graph.View = View
Graph.Text = Text
Graph.Image = Image
Graph.Touchable = Touchable
Graph.Graphics = Graphics
Graph.ProfileTemplate = ProfileTemplate
Graph.Layouts = Layouts
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
