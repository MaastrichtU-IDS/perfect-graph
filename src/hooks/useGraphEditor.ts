import { createStoreProvider } from 'colay-ui'
// import { createStoreProvider } from '@root/components/GraphEditor/createStoreProvider'
import {
  GraphEditorContextType,
} from '@type'

const {
  Context,
  useSelector,
  Provider,
} = createStoreProvider<GraphEditorContextType>(
  {} as unknown as GraphEditorContextType, { immer: false },
)

export const GraphEditorContext = Context
export const GraphEditorProvider = Provider

/**
 * To use graph editor context values.
 */
export const useGraphEditor = useSelector
