import { useStateWithCallback } from 'colay-ui'
import { EdgeSingular, Core } from 'cytoscape'
import React from 'react'
import {
  EdgeContext,
  EdgeConfig,
  EdgeElement,
  EdgeData,
} from '@type'
import { CYTOSCAPE_EVENT, ELEMENT_DATA_FIELDS } from '@constants'
import { calculateVisibilityByContext, contextUtils } from '@utils'
import { mutableGraphMap } from './useGraph'
import { useElement } from './useElement'

export type Props<T> = {
  children?: React.ReactNode;
  item: EdgeData;
  graphID: string;
  onPositionChange?: (c: {element: EdgeSingular; context: EdgeContext; cy: Core }) => void;
  config?: EdgeConfig;
}

type Result<T> = {
  element: EdgeSingular;
  context: EdgeContext;
  cy: Core;
}

export default <T>(props: Props<T>): Result<T> => {
  const {
    onPositionChange,
    graphID,
    config = {},
    item,
  } = props
  const {
    id,
    source,
    target,
  } = item
  const { cy } = mutableGraphMap[graphID]
  const [, setState] = useStateWithCallback({}, () => {
  })
  const contextRef = React.useRef<EdgeContext>({
    render: (callback: () => {}) => {
      setState({}, callback)
    },
    onPositionChange: () => {
      onPositionChange?.({
      // @ts-ignore
        element: contextRef.current.element,
        context: contextRef.current,
        cy,
      })
    },
    element: null as unknown as EdgeElement,
    settings: {
      filtered: true,
      nodeFiltered: true,
      visibility: {
        nodeVisible: true,
      },
    },
  } as EdgeContext)
  contextRef.current.element = React.useMemo(() => {
    const {
      current: {
        element,
      },
    } = contextRef
    if (element) {
      cy.remove(element)
    }
    return cy!.add({
      data: {
        id,
        source,
        target,
        [ELEMENT_DATA_FIELDS.CONTEXT]: contextRef.current,
        [ELEMENT_DATA_FIELDS.DATA]: item?.data,
      },
      group: 'edges',
    })
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [cy, id, source, target])
  const {
    current: {
      element,
    },
  } = contextRef
  React.useEffect(
    () => {
      contextRef.current.onPositionChange = () => {
        onPositionChange?.({ cy, element, context: contextRef.current })
      }
      contextUtils.update(
        element,
        contextRef.current,
      )
    },
    [onPositionChange],
  )
  React.useEffect(() => () => { cy!.remove(element!) },
  // eslint-disable-next-line react-hooks/exhaustive-deps
    [cy, id, source, target])

  // Visibility Change
  // EventListeners
  React.useEffect(
    () => {
      const nodeDataUpdated = () => {
        // Update visibility
        const oldVisible = calculateVisibilityByContext(element)
        const sourceContext = contextUtils.get(element.source())
        const targetContext = contextUtils.get(element.target())
        const sourceVisible = calculateVisibilityByContext(element.source())
        const targetVisible = calculateVisibilityByContext(element.target())
        const newNodeVisible = sourceVisible && targetVisible
        let forceRender = false
        if (newNodeVisible !== contextRef.current.settings.visibility.nodeVisible) {
          contextRef.current.settings.visibility.nodeVisible = newNodeVisible
          contextUtils.update(element, contextRef.current)
          if (oldVisible !== calculateVisibilityByContext(element)) {
            forceRender = false
          }
        }
        const oldNodeFiltered = contextRef.current.settings.nodeFiltered
        const newNodeFiltered = sourceContext.settings.filtered
        && targetContext.settings.filtered
        contextRef.current.settings.nodeFiltered = newNodeFiltered
        if (newNodeFiltered !== oldNodeFiltered) {
          forceRender = true
          contextUtils.update(element, contextRef.current)
        }
        if (forceRender) {
          contextRef.current.render()
        }
      }
      element.source().on(CYTOSCAPE_EVENT.data, nodeDataUpdated)
      element.target().on(CYTOSCAPE_EVENT.data, nodeDataUpdated)
      // element.source().emit(CYTOSCAPE_EVENT.data)
      return () => {
        // element.source().off(CYTOSCAPE_EVENT.data, `#${element.id()}`, nodeDataUpdated)
        // element.target().off(CYTOSCAPE_EVENT.data, `#${element.id()}`, nodeDataUpdated)
        element.source().removeListener(CYTOSCAPE_EVENT.data)
        element.target().removeListener(CYTOSCAPE_EVENT.data)
      }
    },
    [element],
  )
  useElement({
    contextRef,
    cy,
    element,
    item,
    config,
  })
  return {
    element,
    context: contextRef.current,
    cy,
  }
}
