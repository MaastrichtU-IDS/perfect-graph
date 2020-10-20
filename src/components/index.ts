import ProfileTemplate from '@components/templates/Profile'
import { ComponentType } from 'unitx-ui/type'
import Layouts from '@core/layouts'
import { ElementType } from '@utils/constants'
import View from './components/View'
import Graphics from './components/Graphics'
import Touchable from './components/Touchable'
import Text from './components/Text'
import Image from './components/Image'
import HoverContainer from './components/HoverContainer'
import NativeGraph, { GraphProps } from './components/Graph'

export const Graph = NativeGraph as ComponentType<GraphProps> & {
  View: typeof View;
  Text: typeof Text;
  Image: typeof Image;
  Touchable: typeof Touchable;
  Graphics: typeof Graphics;
  ProfileTemplate: typeof ProfileTemplate;
  Layouts: typeof Layouts;
  HoverContainer: typeof HoverContainer;
  elementType: typeof ElementType;
}

/* eslint-disable functional/immutable-data, functional/no-expression-statement */
Graph.View = View
Graph.Text = Text
Graph.Image = Image
Graph.Touchable = Touchable
Graph.Graphics = Graphics
Graph.ProfileTemplate = ProfileTemplate
Graph.Layouts = Layouts
Graph.HoverContainer = HoverContainer
Graph.elementType = ElementType
/* eslint-enable functional/immutable-data, functional/no-expression-statement */

export { DefaultRenderEdge, DefaultRenderNode } from './components/Graph'
export {
  default as ProfileTemplate,
} from './templates/Profile'

export { GraphProps, GraphConfig } from './components/Graph'
