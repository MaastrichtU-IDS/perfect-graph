import React from 'react'
import { Core } from 'cytoscape'
import {
  ElementContext, Element, ElementConfig,
} from '@type'

export type Props = {
  element: Element;
  cy: Core;
  contextRef: React.RefObject<ElementContext>;
  config?: ElementConfig;
}

type Result = {

}

export const useElement = (props: Props): Result => {
  const {
    // cy,
    element,
    contextRef,
    config = {},
  } = props
  const {
    renderEvents = [],
  } = config
  // EventListeners
  React.useEffect(
    () => {
      renderEvents.forEach((eventName) => {
        element.on(eventName, () => {
          contextRef.current?.render?.()
        })
      })
      return () => {
        renderEvents.forEach((eventName) => {
          element.off(eventName)
        })
      }
    },
    [element, renderEvents],
  )

  return {

  }
}
