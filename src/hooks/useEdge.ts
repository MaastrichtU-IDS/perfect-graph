import { useStateWithCallback } from 'colay-ui'
import { EdgeSingular, Core } from 'cytoscape'
import React from 'react'
import {
  EdgeContext,
  ElementConfig,
  EdgeElement,
  EdgeData,
} from '@type'
import { CYTOSCAPE_EVENT } from '@utils/constants'
import { calculateVisibilityByContext } from '@utils'
import * as R from 'colay/ramda'
import { mutableGraphMap } from './useGraph'
import { useElement } from './useElement'

export type Props<T> = {
  children?: React.ReactNode;
  item?: EdgeData;
  id: string;
  source: string;
  target: string;
  graphID: string;
  onPositionChange?: (c: {element: EdgeSingular; context: EdgeContext }) => void;
  config?: ElementConfig;
}

type Result<T> = {
  element: EdgeSingular;
  context: EdgeContext;
  cy: Core;
}

export default <T>(props: Props<T>): Result<T> => {
  const {
    id, // : givenID,
    source,
    target,
    onPositionChange,
    graphID,
    config = {},
    item,
  } = props
  const { cy } = mutableGraphMap[graphID]
  const [, setState] = useStateWithCallback({}, () => {
  })
  const contextRef = React.useRef<EdgeContext>({
    render: (callback: () => {}) => {
      setState({}, callback)
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
        context: contextRef.current,
        onPositionChange: () => {
          onPositionChange?.({
          // @ts-ignore
            element: contextRef.current.element,
            context: contextRef.current,
          })
        },
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
      element.data({
        onPositionChange: () => {
          onPositionChange?.({ element, context: contextRef.current })
        },
      })
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
      const nodeDataUpdated = (e) => {
        // Update visibility
        const oldVisible = calculateVisibilityByContext(contextRef.current)
        const sourceData = element.source().data()
        const targetData = element.target().data()
        const sourceVisible = calculateVisibilityByContext(sourceData.context)
        const targetVisible = calculateVisibilityByContext(targetData.context)
        const newNodeVisible = sourceVisible && targetVisible
        let forceRender = false
        if (newNodeVisible !== contextRef.current.settings.visibility.nodeVisible) {
          contextRef.current.settings.visibility.nodeVisible = newNodeVisible
          element.data({
            context: contextRef.current,
          })
          if (oldVisible !== calculateVisibilityByContext(contextRef.current)) {
            forceRender = false
          }
        }
        const oldNodeFiltered = contextRef.current.settings.nodeFiltered
        const newNodeFiltered = sourceData.context.settings.filtered
        && targetData.context.settings.filtered
        contextRef.current.settings.nodeFiltered = newNodeFiltered
        if (newNodeFiltered !== oldNodeFiltered) {
          forceRender = true
          element.data({
            context: contextRef.current,
          })
        }
        if (forceRender) {
          contextRef.current.render()
        }
      }
      element.source().on(CYTOSCAPE_EVENT.data, nodeDataUpdated)
      element.target().on(CYTOSCAPE_EVENT.data, nodeDataUpdated)
      // element.source().emit(CYTOSCAPE_EVENT.data)
      return () => {
        element.source().off(CYTOSCAPE_EVENT.data, `#${element.id()}`, nodeDataUpdated)
        element.source().off(CYTOSCAPE_EVENT.data, `#${element.id()}`, nodeDataUpdated)
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
