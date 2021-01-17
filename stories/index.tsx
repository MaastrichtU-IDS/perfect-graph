import { createCodeComponent } from 'colay-docs'
import * as Components from '../src/components'
import * as _Decorators from './Decorators'

export * from '../src/components'

export const Decorators = _Decorators

export const Code = createCodeComponent({
  ...Components,
  Decorators
})