import { createCodeComponent } from 'colay-docs'
import * as Components from '../src/components'
import {GraphEditor} from '../src/components/GraphEditor'
import * as _Decorators from './Decorators'

export const Decorators = _Decorators

export const Code = createCodeComponent({
  ...Components,
  GraphEditor,
  Decorators
})