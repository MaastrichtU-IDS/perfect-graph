// @ts-nocheck
import React from 'react'
import * as R from 'unitx/ramda'
import {
  Graph, GraphProps,
  DefaultRenderEdge,
  DefaultRenderNode, GraphConfig,
} from '@components'
import {
  NodeElement, NodeData,
  EdgeElement, DataItem, ActionTypeName,
  Element,
} from '@type'
import { wrapComponent, View } from 'unitx-ui'
import {useData} from 'unitx-ui/hooks'
import { ForwardRef } from 'unitx-ui/type'
import { Position } from 'unitx/type'
import { ActionType } from '@utils/constants'
import FilterBar, { FilterBarProps } from './FilterBar'
import DataBar, { DataBarProps } from './DataBar'
import ActionBar, { ActionBarProps } from './ActionBar'

type OperationType = keyof typeof ActionType

type ElementConfig = {
  filter: FilterBarProps;
  data: DataBarProps;
  action: ActionBarProps;
}
type ElementConfigExtractor = (input: {
  item?: DataItem;
  element?: Element;
}) => ElementConfig
export type GraphEditorProps = {
  onAction?: (c: {
    type: OperationType;
    node: NodeElement;
    nodeItem: NodeData;
    edge: EdgeElement;
    edgeItem: NodeData;
  }) => void;
  graphConfig?: GraphConfig;
  configExtractor?: ElementConfigExtractor;
  renderMoreAction?: () => React.ReactElement;
} & Omit<
GraphProps,
'config'|'onPress'
>
const DEFAULT_HANDLER = R.identity as (c: {
  type: OperationType;
  node: NodeElement;
  nodeItem: NodeData;
  edge: EdgeElement;
  edgeItem: NodeData;
  data: any;
}) => void
// @ts-ignore
const DEFAULT_CONFIG_EXTRACTOR: ElementConfigExtractor = () => ({})

const GraphEditor = (props: GraphEditorProps, ref: ForwardRef<typeof Graph>) => {
  const {
    onAction = DEFAULT_HANDLER,
    renderEdge,
    renderNode,
    graphConfig,
    configExtractor = DEFAULT_CONFIG_EXTRACTOR,
    style,
    ...rest
  } = props
  const [state, updateState] = useData({
    selectedItemInfo: null as unknown as { item: DataItem; element: Element},
    configExtractorResult: configExtractor({}),
    actionType: null as unknown as ActionTypeName,
  })
  const onNodeSelected = React.useCallback((selectedItemInfo) => {
    const result = configExtractor(selectedItemInfo)
    updateState((draft) => {
      draft.selectedItemInfo = selectedItemInfo
      draft.configExtractorResult = result
    })
  }, [state.selectedItemInfo, configExtractor])
  const onPress = React.useCallback(({ position }: { position: Position}) => {
    R.cond([
      [
        R.equals(ActionType.add),
        // @ts-ignore
        () => onAction({
          type: ActionType.add,
          data: position,
        }),
      ],
    ])(state.actionType)
  }, [])
  return (
    <View
      style={style}
    >
      <Graph
        // @ts-ignore
        ref={ref}
        style={{
          width: '100%',
          height: '100%',
        }}
        {...rest}
        config={graphConfig}
        onPress={onPress}
        renderNode={({ item, element, ...rest }) => (
          <Graph.Touchable
            onPress={() => onNodeSelected({
              item,
              element,
            })}
          >
            {(renderNode ?? DefaultRenderNode)({ item, ...rest })}
          </Graph.Touchable>
        )}
        renderEdge={({ item, ...rest }) => (
          (renderEdge ?? DefaultRenderEdge)({ item, ...rest })
        )}
      />
      <FilterBar
        {...(state.configExtractorResult?.filter ?? {})}
      />
      <DataBar
        {...(state.configExtractorResult?.data ?? {})}
        onChange={(data: any) => {
          const {
            element,
            item,
          } = state.selectedItemInfo
          const isNode = element.isNode()
          // @ts-ignore
          onAction({
            type: ActionType.updateData,
            ...(
              isNode
                ? {
                  node: element,
                  nodeItem: item,
                }
                : {
                  edge: element,
                  edgeItem: item,
                }
            ),
            data,
          })
        }}
      />
      <ActionBar
        {...(state.configExtractorResult?.action ?? {})}
        // @ts-ignore
        onAction={(type) => {
          updateState((draft) => {
            draft.actionType = type
          })
        }}
      />
    </View>
  )
}

/**
 * ## Usage
 * To create a GraphEditor easily, you can just pass data and render methods.
 * Check example
 *
 * ```js live=true
 * function MyGraphEditor() {
 *  const [data, setData] = React.useState({
 *    nodes: [
 *         { id: 1, position: { x: 10, y: 10 } },
 *         { id: 2, position: { x: 300, y: 100 } },
 *       ],
 *    edges: [
 *         { id: 51, source: 1, target: 2 }
 *       ]
 *  })
 *  return (
 *    <GraphEditor
 *       style={{ width: '100%', height: 250 }}
 *       configExtractor={({ item }) => ({ data: { data: item }})}
 *       nodes={data.nodes}
 *       edges={data.edges}
 *     />
 *  )
 * }
 * ```
 */
export default wrapComponent<GraphEditorProps>(
  GraphEditor,
  {
    isEqual: R.equalsExclude(R.isFunction),
    isForwardRef: true,
  },
)
