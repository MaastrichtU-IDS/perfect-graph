import React from 'react'
import {Core, NodeSingular, EdgeSingular} from 'cytoscape'
import {ElementContext, Element, NodeConfig, EdgeConfig, ElementData, ElementFilterOption} from '@type'
import {CYTOSCAPE_EVENT, ELEMENT_DATA_FIELDS} from '@constants'
import {calculateVisibilityByContext, contextUtils} from '@utils'
import {useInitializedRef} from 'colay-ui/hooks/useInitializedRef'

export type Props = {
  /**
   * Related element
   */
  element: Element
  /**
   * Element data
   */
  item: ElementData
  /**
   * The created cytoscape instance
   */
  cy: Core
  /**
   * The element context reference
   */
  contextRef: React.RefObject<ElementContext>
  /**
   * The element config
   */
  config: NodeConfig | EdgeConfig
  /**
   * The Filter config
   */
  filter?: ElementFilterOption<Element>
}

type Result = {}

const DEFAULT_RENDER_EVENTS = [] as string[]

/**
 * To support common features of node and edge.
 */
export const useElement = (props: Props): Result => {
  const {
    // cy,
    element,
    contextRef,
    config,
    item
  } = props
  const {renderEvents = DEFAULT_RENDER_EVENTS} = config
  const initializedRef = useInitializedRef()
  // Update data
  React.useEffect(() => {
    if (initializedRef.current) {
      element.data({
        [ELEMENT_DATA_FIELDS.DATA]: item?.data
      })
    }
  }, [item?.data])
  // EventListeners
  React.useEffect(() => {
    renderEvents.forEach(eventName => {
      element.on(eventName, () => {
        contextRef.current?.render?.()
      })
    })
    /// ADD SELECT_EDGE and SELECT_NODE Events ***
    const isNode = element.isNode()
    element.on(CYTOSCAPE_EVENT.select, () => {
      if (isNode) {
        ;(element as NodeSingular).connectedEdges().forEach(edge => {
          edge.emit(CYTOSCAPE_EVENT.selectNode)
        })
      } else {
        const edge = element as EdgeSingular
        edge.source().emit(CYTOSCAPE_EVENT.selectEdge)
        edge.target().emit(CYTOSCAPE_EVENT.selectEdge)
      }
    })
    element.on(CYTOSCAPE_EVENT.unselect, () => {
      if (isNode) {
        ;(element as NodeSingular).connectedEdges().forEach(edge => {
          edge.emit(CYTOSCAPE_EVENT.unselectNode)
        })
      } else {
        const edge = element as EdgeSingular
        edge.source().emit(CYTOSCAPE_EVENT.unselectEdge)
        edge.target().emit(CYTOSCAPE_EVENT.unselectEdge)
      }
    })
    /// ***ADD SELECT_EDGE and SELECT_NODE Events
    return () => {
      renderEvents.forEach(eventName => {
        element.removeListener(eventName)
      })
      /// ADD SELECT_EDGE and SELECT_NODE Events ***
      element.removeListener(CYTOSCAPE_EVENT.select)
      element.removeListener(CYTOSCAPE_EVENT.unselect)
      /// *** ADD SELECT_EDGE and SELECT_NODE Events
    }
  }, [element, renderEvents])
  // Filter
  React.useEffect(() => {
    const oldFiltered = contextRef.current!.settings.filtered
    // @ts-ignore
    const filtered = config.filter?.test?.({element, item}) ?? true
    contextRef.current!.settings.filtered = filtered
    if (oldFiltered !== filtered) {
      contextUtils.update(element, contextRef.current)
      // @ts-ignore
      if (calculateVisibilityByContext(element)) {
        contextRef.current?.render()
      }
    }
  }, [config.filter])

  // Add fields
  React.useMemo(() => {
    element.hovered = () => !!contextRef.current?.settings.hovered
    element.filtered = () => !!contextRef.current?.settings.filtered
  }, [element])
  return {}
}
