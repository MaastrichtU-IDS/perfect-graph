import { useStateWithCallback } from 'colay-ui'
import { EdgeSingular, Core } from 'cytoscape'
import React from 'react'
import {
  EdgeContext, ElementConfig, EdgeElement,
} from '@type'
import { CYTOSCAPE_EVENT } from '@utils/constants'
import { mutableGraphMap } from './useGraph'
import { useElement } from './useElement'

export type Props<T> = {
  children?: React.ReactNode;
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
    config,
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
      visible: true,
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
        const sourceData = element.source().data()
        const targetData = element.target().data()
        const newVisible = sourceData.context.settings.visible
        && targetData.context.settings.visible
        if (newVisible !== contextRef.current.settings.visible) {
          contextRef.current.settings.visible = newVisible
          element.data({
            settings: contextRef.current,
          })
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
    config,
  })
  return {
    element,
    context: contextRef.current,
    cy,
  }
}
